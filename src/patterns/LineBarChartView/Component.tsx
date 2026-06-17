import { useId } from "react";
import type { ReactNode } from "react";
import { isMeaningfulMetric } from "../../headless";
import type { LineBarChartSeries, Metric } from "../../types";

export type LineBarChartViewProps = {
  series?: LineBarChartSeries[];
  label?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showEmptyState?: boolean;
  showZero?: boolean;
  emptyLabel?: ReactNode;
  valueFormatter?: (value: number) => string;
};

type NormalizedPoint = {
  key: string;
  label: string;
  value: number;
};

type NormalizedSeries = Omit<LineBarChartSeries, "points"> & {
  points: NormalizedPoint[];
};

type DomainPoint = {
  key: string;
  label: string;
};

const chartWidth = 640;
const defaultHeight = 240;
const padding = {
  bottom: 34,
  left: 44,
  right: 18,
  top: 18,
};
const defaultPalette = [
  "var(--atlas-color-primary)",
  "var(--atlas-color-info)",
  "var(--atlas-color-success)",
  "var(--atlas-color-warning)",
  "var(--atlas-color-danger)",
  "var(--atlas-color-muted)",
];

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getNumericValue(metric: Metric, showZero: boolean): number | null {
  if (!isMeaningfulMetric(metric, { showZero })) return null;
  if (typeof metric.value === "string" && metric.value.trim().length === 0) return null;

  const value = Number(metric.value);
  return Number.isFinite(value) ? value : null;
}

function normalizeSeries(series: LineBarChartSeries[], showZero: boolean): NormalizedSeries[] {
  return series
    .filter((item) => !item.hidden && item.label.trim().length > 0)
    .map((item) => ({
      ...item,
      points: item.points
        .map((point) => {
          const value = getNumericValue(point, showZero);
          const label = point.label.trim();

          if (value === null || label.length === 0) return null;

          return {
            key: point.id ?? label,
            label,
            value,
          };
        })
        .filter((point): point is NormalizedPoint => point !== null),
    }))
    .filter((item) => item.points.length > 0);
}

function getDomain(series: NormalizedSeries[]): DomainPoint[] {
  const domain = new Map<string, DomainPoint>();

  for (const item of series) {
    for (const point of item.points) {
      if (!domain.has(point.key)) {
        domain.set(point.key, { key: point.key, label: point.label });
      }
    }
  }

  return Array.from(domain.values());
}

function getValueRange(series: NormalizedSeries[]): [number, number] {
  const values = series.flatMap((item) => item.points.map((point) => point.value));
  let minimum = Math.min(0, ...values);
  let maximum = Math.max(0, ...values);

  if (minimum === maximum) {
    maximum = minimum + 1;
  }

  return [minimum, maximum];
}

function getPointMap(series: NormalizedSeries): Map<string, NormalizedPoint> {
  return new Map(series.points.map((point) => [point.key, point]));
}

function getTicks(minimum: number, maximum: number): number[] {
  const count = 4;
  const step = (maximum - minimum) / count;

  return Array.from({ length: count + 1 }, (_, index) => minimum + step * index);
}

function getSafeHeight(height: number): number {
  if (!Number.isFinite(height)) return defaultHeight;
  return Math.max(160, Math.trunc(height));
}

function formatDefaultValue(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(2)));
}

function truncateLabel(label: string): string {
  return label.length > 16 ? `${label.slice(0, 13)}...` : label;
}

export function LineBarChartView({
  className,
  emptyLabel = "Nothing to show",
  height = defaultHeight,
  label = "Line bar chart",
  series = [],
  showEmptyState = false,
  showGrid = true,
  showLegend = true,
  showZero = false,
  valueFormatter = formatDefaultValue,
}: LineBarChartViewProps) {
  const titleId = useId();
  const normalizedSeries = normalizeSeries(series, showZero);

  if (normalizedSeries.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const domain = getDomain(normalizedSeries);

  if (domain.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const safeHeight = getSafeHeight(height);
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = safeHeight - padding.top - padding.bottom;
  const [minimum, maximum] = getValueRange(normalizedSeries);
  const valueToY = (value: number) => padding.top + ((maximum - value) / (maximum - minimum)) * plotHeight;
  const baselineY = valueToY(0);
  const groupWidth = plotWidth / domain.length;
  const getX = (index: number) => padding.left + groupWidth * (index + 0.5);
  const barSeries = normalizedSeries.filter((item) => item.type === "bar");
  const lineSeries = normalizedSeries.filter((item) => item.type === "line");
  const barGap = Math.min(4, Math.max(2, groupWidth * 0.04));
  const barWidth = Math.max(
    4,
    Math.min(28, (groupWidth * 0.68 - barGap * Math.max(0, barSeries.length - 1)) / Math.max(1, barSeries.length)),
  );
  const totalBarWidth = barSeries.length * barWidth + Math.max(0, barSeries.length - 1) * barGap;
  const axisLabelInterval = Math.max(1, Math.ceil(domain.length / 8));
  const ticks = getTicks(minimum, maximum);

  return (
    <section className={joinClasses("atlas-line-bar-chart-view", className)} aria-label={label}>
      {showLegend ? (
        <div className="atlas-line-bar-chart-view__legend" aria-label={`${label} series`}>
          {normalizedSeries.map((item, index) => (
            <span className="atlas-line-bar-chart-view__legend-item" key={item.id}>
              <span
                className={joinClasses(
                  "atlas-line-bar-chart-view__legend-marker",
                  item.type === "line" && "atlas-line-bar-chart-view__legend-marker--line",
                )}
                style={{ backgroundColor: item.color ?? defaultPalette[index % defaultPalette.length] }}
              />
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      ) : null}
      <div className="atlas-line-bar-chart-view__plot">
        <svg
          aria-labelledby={titleId}
          className="atlas-line-bar-chart-view__svg"
          height={safeHeight}
          role="img"
          viewBox={`0 0 ${chartWidth} ${safeHeight}`}
          width={chartWidth}
        >
          <title id={titleId}>{label}</title>
          <line
            className="atlas-line-bar-chart-view__axis"
            x1={padding.left}
            x2={chartWidth - padding.right}
            y1={baselineY}
            y2={baselineY}
          />
          {showGrid ? (
            <g aria-hidden="true">
              {ticks.map((tick) => {
                const y = valueToY(tick);

                return (
                  <g className="atlas-line-bar-chart-view__tick" key={tick}>
                    <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} />
                    <text x={padding.left - 10} y={y + 4}>
                      {valueFormatter(tick)}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : null}
          {barSeries.map((item, seriesIndex) => {
            const pointMap = getPointMap(item);
            const color = item.color ?? defaultPalette[seriesIndex % defaultPalette.length];

            return (
              <g className="atlas-line-bar-chart-view__bars" key={item.id}>
                {domain.map((point, pointIndex) => {
                  const value = pointMap.get(point.key)?.value;

                  if (value === undefined) return null;

                  const x = getX(pointIndex) - totalBarWidth / 2 + seriesIndex * (barWidth + barGap);
                  const valueY = valueToY(value);
                  const y = Math.min(valueY, baselineY);
                  const barHeight = Math.max(1, Math.abs(baselineY - valueY));

                  return (
                    <rect
                      aria-label={`${item.label}, ${point.label}: ${valueFormatter(value)}`}
                      className="atlas-line-bar-chart-view__bar"
                      fill={color}
                      height={barHeight}
                      key={point.key}
                      role="img"
                      width={barWidth}
                      x={x}
                      y={y}
                    />
                  );
                })}
              </g>
            );
          })}
          {lineSeries.map((item, seriesIndex) => {
            const pointMap = getPointMap(item);
            const points = domain
              .map((point, pointIndex) => {
                const value = pointMap.get(point.key)?.value;

                if (value === undefined) return null;

                return {
                  key: point.key,
                  label: point.label,
                  value,
                  x: getX(pointIndex),
                  y: valueToY(value),
                };
              })
              .filter((point): point is NormalizedPoint & { x: number; y: number } => point !== null);
            const color = item.color ?? defaultPalette[(barSeries.length + seriesIndex) % defaultPalette.length];
            const path = points.map((point, pointIndex) => `${pointIndex === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

            return (
              <g className="atlas-line-bar-chart-view__line-series" key={item.id}>
                {path ? (
                  <path
                    className="atlas-line-bar-chart-view__line"
                    d={path}
                    fill="none"
                    stroke={color}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                {points.map((point) => (
                  <circle
                    aria-label={`${item.label}, ${point.label}: ${valueFormatter(point.value)}`}
                    className="atlas-line-bar-chart-view__point"
                    cx={point.x}
                    cy={point.y}
                    fill={color}
                    key={point.key}
                    r="4"
                    role="img"
                  />
                ))}
              </g>
            );
          })}
          <g aria-hidden="true" className="atlas-line-bar-chart-view__labels">
            {domain.map((point, index) => {
              const shouldRender = index % axisLabelInterval === 0 || index === domain.length - 1;

              if (!shouldRender) return null;

              return (
                <text key={point.key} textAnchor="middle" x={getX(index)} y={safeHeight - 10}>
                  {truncateLabel(point.label)}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
