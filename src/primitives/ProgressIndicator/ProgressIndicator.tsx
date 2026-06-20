import { useId, type HTMLAttributes, type ReactNode } from "react";

export type ProgressIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value?: number;
  min?: number;
  max?: number;
  indeterminate?: boolean;
  label?: ReactNode;
  hideLabel?: boolean;
  /**
   * Human-friendly text announced for the current value, e.g. "60%" or
   * "3 of 10 files". Applied as `aria-valuetext` in determinate mode. The app
   * supplies it because only the app knows the right wording/units.
   */
  valueText?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function hasNodeContent(node: ReactNode): boolean {
  if (node === null || node === undefined || node === false) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (Array.isArray(node)) return node.some(hasNodeContent);

  return true;
}

/**
 * An accessible progress bar with determinate and indeterminate modes.
 *
 * In determinate mode it exposes `aria-valuenow/min/max`; in indeterminate
 * mode `aria-valuenow` is omitted (per ARIA) and the bar animates. Provide a
 * `label` to name it; set `hideLabel` to keep the name for assistive tech
 * while hiding it visually.
 */
export function ProgressIndicator({
  value,
  min = 0,
  max = 100,
  indeterminate = false,
  label,
  hideLabel = false,
  valueText,
  className,
  ...props
}: ProgressIndicatorProps) {
  const labelId = useId();
  const hasLabel = hasNodeContent(label);

  const clamped = Math.min(Math.max(value ?? min, min), max);
  const percent = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

  return (
    <div
      className={joinClasses("atlas-progress", className)}
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuetext={indeterminate ? undefined : valueText}
      aria-labelledby={hasLabel ? labelId : undefined}
      data-indeterminate={indeterminate ? "true" : undefined}
      {...props}
    >
      {hasLabel ? (
        <span
          id={labelId}
          className={joinClasses("atlas-progress__label", hideLabel && "atlas-visually-hidden")}
        >
          {label}
        </span>
      ) : null}
      <span className="atlas-progress__track">
        <span
          className="atlas-progress__bar"
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </span>
    </div>
  );
}
