import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export type RadioVariant = "default" | "card";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  description?: string;
  variant?: RadioVariant;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Radio({
  className,
  label,
  description,
  variant = "default",
  id,
  disabled,
  ...props
}: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // URA Law 4 + WCAG 4.1.2: a radio with no accessible name is meaningless and
  // inaccessible. An empty label is fine as long as aria-label/aria-labelledby
  // provides a name; with no name from any source, render nothing.
  const hasAccessibleName =
    Boolean(label) || Boolean(props["aria-label"]) || Boolean(props["aria-labelledby"]);
  if (!hasAccessibleName) return null;

  const labelId = label ? `${inputId}-label` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;

  return (
    <label
      className={joinClasses(
        "atlas-radio",
        `atlas-radio--${variant}`,
        disabled && "atlas-radio--disabled",
        className,
      )}
    >
      {/* Native radio: real semantics, keyboard behavior, and form grouping.
          aria-labelledby pins the name to the label so the description (which
          is wired via aria-describedby) does not leak into the accessible name. */}
      <input
        type="radio"
        className="atlas-radio__input"
        id={inputId}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={descId}
        {...props}
      />
      {label || description ? (
        <span className="atlas-radio__body">
          {label ? (
            <span id={labelId} className="atlas-radio__label">
              {label}
            </span>
          ) : null}
          {description ? (
            <span id={descId} className="atlas-radio__description">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
