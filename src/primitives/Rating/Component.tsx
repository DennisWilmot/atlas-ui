import type { HTMLAttributes } from "react";

export type RatingProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number | null | undefined;
  max?: number;
  label?: string;
  showValue?: boolean;
  showZero?: boolean;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getStarCount(max: number): number {
  if (!Number.isFinite(max)) return 0;
  return Math.max(0, Math.trunc(max));
}

function clampValue(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

function formatRatingValue(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(2)));
}

function getStarFillPercent(index: number, value: number): number {
  return Math.max(0, Math.min(1, value - index)) * 100;
}

export function Rating({
  "aria-label": ariaLabel,
  className,
  label,
  max = 5,
  showValue = false,
  showZero = false,
  value,
  ...props
}: RatingProps) {
  const starCount = getStarCount(max);

  if (starCount === 0 || value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  const ratingValue = clampValue(value, starCount);

  if (ratingValue === 0 && !showZero) return null;

  const formattedValue = formatRatingValue(ratingValue);
  const formattedMax = formatRatingValue(starCount);
  const accessibleLabel = ariaLabel ?? `${label ? `${label}: ` : ""}${formattedValue} out of ${formattedMax}`;

  return (
    <div
      {...props}
      className={joinClasses("atlas-rating", className)}
      role="img"
      aria-label={accessibleLabel}
    >
      {label ? <span className="atlas-rating__label">{label}</span> : null}
      <span className="atlas-rating__stars" aria-hidden="true">
        {Array.from({ length: starCount }, (_, index) => (
          <span className="atlas-rating__star" key={index}>
            <span
              className="atlas-rating__star-fill"
              style={{ width: `${getStarFillPercent(index, ratingValue)}%` }}
            />
          </span>
        ))}
      </span>
      {showValue ? (
        <span className="atlas-rating__value">
          {formattedValue}/{formattedMax}
        </span>
      ) : null}
    </div>
  );
}
