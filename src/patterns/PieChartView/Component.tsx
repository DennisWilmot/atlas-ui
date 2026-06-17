import type { ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import { getPieChartSlices, shouldUseSearchableList } from "../../headless";
import type { PieChartSegment } from "../../types";

const DEFAULT_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#4b5563",
];

export type PieChartFormatterSegment = PieChartSegment & {
  value: number;
  percent: number;
};

export type PieChartViewProps = {
  segments?: PieChartSegment[];
  label?: string;
  className?: string;
  emptyLabel?: ReactNode;
  pageSize?: number;
  showEmptyState?: boolean;
  showLegend?: boolean;
  size?: number;
  valueFormatter?: (value: number, segment: PieChartFormatterSegment) => ReactNode;
};

type RenderableSlice = ReturnType<typeof getPieChartSlices>[number] & {
  color: string;
  path: string;
};

function toPoint(center: number, radius: number, angle: number) {
  const radians = (angle - 90) * (Math.PI / 180);

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function describeSlice(center: number, radius: number, startAngle: number, endAngle: number): string {
  const start = toPoint(center, radius, startAngle);
  const end = toPoint(center, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${center} ${center}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function formatDefaultValue(value: number): string {
  return value.toLocaleString();
}

function formatPercent(percent: number): string {
  return `${Math.round(percent * 100)}%`;
}

function getSafePageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize <= 0) return 20;
  return Math.max(1, Math.trunc(pageSize));
}

function getSafeSize(size: number): number {
  if (!Number.isFinite(size) || size <= 0) return 192;
  return Math.max(96, Math.trunc(size));
}

export function PieChartView({
  className,
  emptyLabel = "Nothing to show",
  label = "Pie chart",
  pageSize = 20,
  segments = [],
  showEmptyState = false,
  showLegend = true,
  size = 192,
  valueFormatter = formatDefaultValue,
}: PieChartViewProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const safePageSize = getSafePageSize(pageSize);
  const safeSize = getSafeSize(size);

  const slices = useMemo(() => getPieChartSlices(segments), [segments]);

  const renderableSlices = useMemo<RenderableSlice[]>(() => {
    const center = safeSize / 2;
    const radius = center;

    return slices.map((slice, index) => ({
      ...slice,
      color: slice.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      path: describeSlice(center, radius, slice.startAngle, slice.endAngle),
    }));
  }, [safeSize, slices]);

  const searchable = showLegend && shouldUseSearchableList(renderableSlices.length);

  const filteredSlices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return renderableSlices;

    return renderableSlices.filter((slice) => slice.label.toLowerCase().includes(normalizedQuery));
  }, [query, renderableSlices, searchable]);

  if (renderableSlices.length === 0) {
    if (!showEmptyState) return null;
    return (
      <div className="atlas-empty" role="status">
        {emptyLabel}
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(filteredSlices.length / safePageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * safePageSize : 0;
  const visibleLegendSlices = searchable ? filteredSlices.slice(start, start + safePageSize) : filteredSlices;
  const chartDescription = renderableSlices
    .map((slice) => `${slice.label}: ${formatDefaultValue(slice.value)} (${formatPercent(slice.percent)})`)
    .join("; ");
  const singleSlice = renderableSlices.length === 1 ? renderableSlices[0] : undefined;

  return (
    <section className={className ? `atlas-pie-chart-view ${className}` : "atlas-pie-chart-view"} aria-label={label}>
      <svg
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className="atlas-pie-chart-view__chart"
        height={safeSize}
        role="img"
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        width={safeSize}
      >
        <title id={titleId}>{label}</title>
        <desc id={descriptionId}>{chartDescription}</desc>
        {singleSlice ? (
          <circle cx={safeSize / 2} cy={safeSize / 2} fill={singleSlice.color} r={safeSize / 2} />
        ) : (
          renderableSlices.map((slice) => <path d={slice.path} fill={slice.color} key={slice.id} />)
        )}
      </svg>
      {showLegend ? (
        <div className="atlas-pie-chart-view__legend">
          {searchable ? (
            <label className="atlas-field">
              <span className="atlas-field__label">{label} search</span>
              <input
                className="atlas-field__control"
                onChange={(event) => {
                  setPage(0);
                  setQuery(event.target.value);
                }}
                type="search"
                value={query}
              />
            </label>
          ) : null}
          {visibleLegendSlices.length > 0 ? (
            <ul className="atlas-pie-chart-view__legend-list" aria-label={`${label} segments`}>
              {visibleLegendSlices.map((slice) => (
                <li className="atlas-pie-chart-view__legend-item" key={slice.id}>
                  <span
                    aria-hidden="true"
                    className="atlas-pie-chart-view__swatch"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="atlas-pie-chart-view__segment-label">{slice.label}</span>
                  <span className="atlas-pie-chart-view__segment-value">
                    {valueFormatter(slice.value, slice)}
                  </span>
                  <span className="atlas-pie-chart-view__segment-percent">{formatPercent(slice.percent)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="atlas-empty" role="status">
              Nothing matches
            </div>
          )}
          {searchable && pageCount > 1 ? (
            <div className="atlas-pagination" aria-label={`${label} pagination`}>
              <button
                className="atlas-action-menu__item"
                disabled={safePage === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                type="button"
              >
                Previous
              </button>
              <span>
                {safePage + 1} / {pageCount}
              </span>
              <button
                className="atlas-action-menu__item"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                type="button"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
