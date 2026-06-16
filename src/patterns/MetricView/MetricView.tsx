import type { Metric } from "../../types";
import { isMeaningfulMetric } from "../../headless";

export type MetricViewProps = {
  metric: Metric;
  showZero?: boolean;
  className?: string;
};

export function MetricView({ className, metric, showZero = false }: MetricViewProps) {
  if (!isMeaningfulMetric(metric, { showZero })) return null;

  const trendLabel = metric.trend === undefined ? undefined : `${metric.trend > 0 ? "+" : ""}${metric.trend}`;

  return (
    <section className={className ? `atlas-metric ${className}` : "atlas-metric"} aria-label={metric.label}>
      <span className="atlas-metric__label">{metric.label}</span>
      <span className="atlas-metric__value">
        <span>{metric.value}</span>
        {metric.unit ? <span className="atlas-metric__unit">{metric.unit}</span> : null}
      </span>
      {trendLabel ? <span className="atlas-metric__trend">{trendLabel}</span> : null}
    </section>
  );
}
