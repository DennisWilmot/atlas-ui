import { useId } from "react";
import { isMeaningfulMetric } from "../../headless";
import type { Metric } from "../../types";

export type GaugeValueFormatter = (value: number, metric: Metric) => string;

export type GaugeViewProps = {
  metric: Metric;
  min?: number;
  max?: number;
  showZero?: boolean;
  showValue?: boolean;
  className?: string;
  valueFormatter?: GaugeValueFormatter;
  "aria-label"?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function toFiniteNumber(value: Metric["value"]): number | null {
  if (typeof value === "string" && value.trim().length === 0) return null;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatGaugeValue(value: number, unit: string | undefined): string {
  const formattedValue = formatNumber(value);

  if (!unit) return formattedValue;
  if (unit === "%") return `${formattedValue}%`;
  return `${formattedValue} ${unit}`;
}

export function GaugeView({
  "aria-label": ariaLabel,
  className,
  max = 100,
  metric,
  min = 0,
  showValue = true,
  showZero = false,
  valueFormatter,
}: GaugeViewProps) {
  const labelId = useId();
  const valueId = useId();

  if (!isMeaningfulMetric(metric, { showZero })) return null;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return null;

  const numberValue = toFiniteNumber(metric.value);
  if (numberValue === null) return null;

  const boundedValue = clampValue(numberValue, min, max);
  const fillPercent = ((boundedValue - min) / (max - min)) * 100;
  const valueLabel = valueFormatter?.(boundedValue, metric) ?? formatGaugeValue(boundedValue, metric.unit);

  return (
    <section className={joinClasses("atlas-gauge-view", className)} aria-labelledby={labelId}>
      <div className="atlas-gauge-view__header">
        <span className="atlas-gauge-view__label" id={labelId}>
          {metric.label}
        </span>
        {showValue ? (
          <span className="atlas-gauge-view__value" id={valueId}>
            {valueLabel}
          </span>
        ) : null}
      </div>
      <div
        aria-describedby={showValue ? valueId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelId}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={boundedValue}
        aria-valuetext={valueLabel}
        className="atlas-gauge-view__meter"
        role="meter"
      >
        <span
          aria-hidden="true"
          className="atlas-gauge-view__fill"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </section>
  );
}
