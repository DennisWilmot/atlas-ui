import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function joinIds(...ids: Array<string | false | undefined>): string | undefined {
  const joined = ids.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

export function Checkbox({
  checked,
  className,
  defaultChecked = false,
  disabled,
  error,
  hint,
  id,
  indeterminate = false,
  label,
  onChange,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const currentChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalChecked(event.target.checked);
    }

    onCheckedChange?.(event.target.checked);
    onChange?.(event);
  }

  return (
    <label className={joinClasses("atlas-checkbox", className)} htmlFor={inputId}>
      <input
        aria-describedby={joinIds(props["aria-describedby"], hintId, errorId)}
        aria-invalid={error ? true : props["aria-invalid"]}
        checked={currentChecked}
        className="atlas-checkbox__input"
        disabled={disabled}
        id={inputId}
        onChange={handleChange}
        ref={inputRef}
        type="checkbox"
        {...props}
      />
      <span className="atlas-checkbox__body">
        {label ? <span className="atlas-checkbox__label">{label}</span> : null}
        {hint ? <span className="atlas-field__hint" id={hintId}>{hint}</span> : null}
        {error ? <span className="atlas-field__error" id={errorId}>{error}</span> : null}
      </span>
    </label>
  );
}
