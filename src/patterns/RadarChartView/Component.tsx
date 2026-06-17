import type { CSSProperties, Key, ReactNode } from "react";
import type { Action, RadarChartAxis, Row } from "../../types";
import { getVisibleActions, hasVisibleActions } from "../../headless";
import { ActionMenu } from "../ActionMenu";

export type RadarChartViewProps<T extends Row = Row> = {
  axes: RadarChartAxis<T>[];
  rows?: T[];
  actions?: Action[];
  className?: string;
  emptyLabel?: ReactNode;
  getRowKey?: (row: T, index: number) => Key;
  getRowLabel?: (row: T, index: number) => ReactNode;
  getSeriesColor?: (row: T, index: number) => string;
  getValue?: (row: T, axis: RadarChartAxis<T>) => number | null | undefined;
  label?: string;
  levels?: number;
  onAction?: (actionId: string) => void;
  readOnly?: boolean;
  showEmptyState?: boolean;
  showZero?: boolean;
  size?: number;
};

type RadarStyle = CSSProperties & {
  "--atlas-radar-series-color": string;
};

const defaultPalette = ["#2563eb", "#15803d", "#b45309", "#0369a1", "#7c3aed", "#be123c"];

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function defaultGetValue<T extends Row>(row: T, axis: RadarChartAxis<T>): number | null {
  return toFiniteNumber(row[String(axis.key)]);
}

function renderEmpty(showEmptyState: boolean, emptyLabel: ReactNode): ReactNode {
  if (!showEmptyState) return null;
  return (
    <div className="atlas-empty" role="status">
      {emptyLabel}
    </div>
  );
}

export function RadarChartView<T extends Row = Row>({
  actions = [],
  axes,
  className,
  emptyLabel = "Nothing to show",
  getRowKey,
  getRowLabel,
  getSeriesColor,
  getValue = defaultGetValue,
  label = "Radar chart",
  levels = 4,
  onAction,
  readOnly = false,
  rows = [],
  showEmptyState = false,
  showZero = false,
  size = 320,
}: RadarChartViewProps<T>) {
  const visibleAxes = axes.filter(
    (axis) => !axis.hidden && String(axis.key).trim().length > 0 && axis.label.trim().length > 0,
  );

  if (rows.length === 0 || visibleAxes.length < 3) {
    return renderEmpty(showEmptyState, emptyLabel);
  }

  const rawSeries = rows.map((row, rowIndex) => ({
    key: getRowKey?.(row, rowIndex) ?? rowIndex,
    label: getRowLabel?.(row, rowIndex) ?? `Series ${rowIndex + 1}`,
    row,
    rowIndex,
    values: visibleAxes.map((axis) => toFiniteNumber(getValue(row, axis))),
  }));

  const meaningfulSeries = rawSeries.filter((series) =>
    series.values.some((value) => value !== null && (showZero || value !== 0)),
  );

  if (meaningfulSeries.length === 0) {
    return renderEmpty(showEmptyState, emptyLabel);
  }

  const safeSize = Math.max(220, size);
  const center = safeSize / 2;
  const radius = safeSize * 0.3;
  const labelRadius = safeSize * 0.43;
  const safeLevels = Math.max(1, Math.floor(levels));
  const levelValues = Array.from({ length: safeLevels }, (_, index) => (index + 1) / safeLevels);

  const ranges = visibleAxes.map((axis, axisIndex) => {
    const min = axis.min ?? 0;
    const observedMax = Math.max(
      min,
      ...meaningfulSeries
        .map((series) => series.values[axisIndex])
        .filter((value): value is number => value !== null),
    );
    const requestedMax = axis.max ?? observedMax;
    const max = requestedMax > min ? requestedMax : min + 1;

    return { min, max };
  });

  const pointFor = (axisIndex: number, ratio: number, pointRadius = radius) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * axisIndex) / visibleAxes.length;
    const distance = pointRadius * ratio;

    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };

  const polygonPoints = (ratio: number) =>
    visibleAxes
      .map((_, axisIndex) => {
        const point = pointFor(axisIndex, ratio);
        return `${point.x},${point.y}`;
      })
      .join(" ");

  const hasActions = !readOnly && hasVisibleActions(actions);

  return (
    <section className={joinClasses("atlas-radar-chart-view", className)} aria-label={label}>
      {hasActions ? (
        <ActionMenu actions={getVisibleActions(actions)} ariaLabel={`${label} actions`} onAction={onAction} />
      ) : null}
      <div className="atlas-radar-chart-view__canvas">
        <svg
          aria-label={label}
          className="atlas-radar-chart-view__svg"
          role="img"
          viewBox={`0 0 ${safeSize} ${safeSize}`}
        >
          <title>{label}</title>
          {levelValues.map((levelValue) => (
            <polygon
              className="atlas-radar-chart-view__grid"
              key={levelValue}
              points={polygonPoints(levelValue)}
            />
          ))}
          {visibleAxes.map((axis, axisIndex) => {
            const end = pointFor(axisIndex, 1);
            const labelPoint = pointFor(axisIndex, 1, labelRadius);

            return (
              <g key={axis.key}>
                <line
                  className="atlas-radar-chart-view__axis"
                  x1={center}
                  x2={end.x}
                  y1={center}
                  y2={end.y}
                />
                <text
                  className="atlas-radar-chart-view__axis-label"
                  dominantBaseline="middle"
                  textAnchor={labelPoint.x < center - 4 ? "end" : labelPoint.x > center + 4 ? "start" : "middle"}
                  x={labelPoint.x}
                  y={labelPoint.y}
                >
                  {axis.label}
                </text>
              </g>
            );
          })}
          {meaningfulSeries.map((series, seriesIndex) => {
            const color =
              getSeriesColor?.(series.row, series.rowIndex) ?? defaultPalette[seriesIndex % defaultPalette.length];
            const style: RadarStyle = { "--atlas-radar-series-color": color };
            const points = series.values.map((value, axisIndex) => {
              const range = ranges[axisIndex];
              const ratio = value === null ? 0 : clamp((value - range.min) / (range.max - range.min));
              return pointFor(axisIndex, ratio);
            });

            return (
              <g className="atlas-radar-chart-view__series" key={series.key} style={style}>
                <polygon
                  aria-label={typeof series.label === "string" ? series.label : undefined}
                  className="atlas-radar-chart-view__series-area"
                  points={points.map((point) => `${point.x},${point.y}`).join(" ")}
                />
                {points.map((point, axisIndex) => (
                  <circle
                    aria-hidden="true"
                    className="atlas-radar-chart-view__point"
                    cx={point.x}
                    cy={point.y}
                    key={visibleAxes[axisIndex].key}
                    r="3"
                  />
                ))}
              </g>
            );
          })}
        </svg>
        <ul className="atlas-radar-chart-view__legend" aria-label={`${label} legend`}>
          {meaningfulSeries.map((series, seriesIndex) => {
            const color =
              getSeriesColor?.(series.row, series.rowIndex) ?? defaultPalette[seriesIndex % defaultPalette.length];
            const style: RadarStyle = { "--atlas-radar-series-color": color };

            return (
              <li className="atlas-radar-chart-view__legend-item" key={series.key}>
                <span className="atlas-radar-chart-view__legend-swatch" style={style} />
                <span>{series.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
