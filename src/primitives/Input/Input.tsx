import type { InputHTMLAttributes } from "react";
import { useId } from "react";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "aria-invalid"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasHint = typeof hint === "string" && hint.trim().length > 0;
  const hasError = typeof error === "string" && error.trim().length > 0;
  const showHint = hasHint && !hasError;
  const hintId = showHint ? `${inputId}-hint` : undefined;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className ? `atlas-field ${className}` : "atlas-field"}>
      <label className="atlas-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="atlas-field__control"
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        {...props}
      />
      {showHint ? (
        <span className="atlas-field__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {hasError ? (
        <span className="atlas-field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
