import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "aria-invalid"> & {
  label?: string;
  hint?: string;
  error?: string;
  autoResize?: boolean;
  showCount?: boolean;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Textarea({
  className,
  label,
  hint,
  error,
  autoResize = false,
  showCount = false,
  id,
  value,
  defaultValue,
  onChange,
  maxLength,
  required,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  // The error replaces the hint: show the hint only when there is no error.
  const showHint = Boolean(hint) && !error;
  const hintId = showHint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const countId = showCount ? `${fieldId}-count` : undefined;
  const describedBy = [hintId, errorId, countId].filter(Boolean).join(" ") || undefined;

  const ref = useRef<HTMLTextAreaElement>(null);
  const isControlled = value !== undefined;
  const initialValue = (isControlled ? value : defaultValue) ?? "";
  const [currentLength, setCurrentLength] = useState(String(initialValue).length);

  // Keep the count in sync when a controlled value changes externally.
  useEffect(() => {
    if (isControlled) setCurrentLength(String(value ?? "").length);
  }, [isControlled, value]);

  // Grow to fit content when auto-resizing.
  useEffect(() => {
    if (!autoResize) return;
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize, value, currentLength]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCurrentLength(event.target.value.length);
    onChange?.(event);
  }

  const atLimit = maxLength != null && currentLength >= maxLength;

  return (
    <div className={joinClasses("atlas-field", className)}>
      {label ? (
        <label className="atlas-field__label" htmlFor={fieldId}>
          {label}
          {required ? (
            <span className="atlas-field__required" aria-hidden="true">
              {" *"}
            </span>
          ) : null}
        </label>
      ) : null}
      <textarea
        ref={ref}
        className={joinClasses("atlas-field__control", "atlas-textarea", autoResize && "atlas-textarea--auto")}
        id={fieldId}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {showHint ? (
        <span className="atlas-field__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="atlas-field__error" id={errorId}>
          {error}
        </span>
      ) : null}
      {showCount ? (
        <span
          className={joinClasses(
            "atlas-field__hint",
            "atlas-textarea__count",
            atLimit && "atlas-textarea__count--limit",
          )}
          id={countId}
        >
          {maxLength != null ? `${currentLength} / ${maxLength}` : currentLength}
        </span>
      ) : null}
    </div>
  );
}
