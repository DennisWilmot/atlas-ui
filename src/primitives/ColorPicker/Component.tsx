import type { ChangeEvent, CSSProperties, HTMLAttributes, MouseEvent } from "react";
import { useId, useState } from "react";

export type ColorPickerSwatch = {
  value: string;
  label?: string;
  disabled?: boolean;
};

export type ColorPickerChangeSource = "input" | "swatch";

export type ColorPickerChangeMeta = {
  source: ColorPickerChangeSource;
  event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>;
  swatch?: ColorPickerSwatch;
};

export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, meta: ColorPickerChangeMeta) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  swatches?: ColorPickerSwatch[];
  hint?: string;
  error?: string;
  showValue?: boolean;
};

const defaultColor = "#000000";
const hexColorPattern = /^#[0-9a-f]{6}$/i;

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getInputColor(value: string): string {
  return hexColorPattern.test(value) ? value : defaultColor;
}

function normalizeColor(value: string): string {
  return value.trim().toLowerCase();
}

export function ColorPicker({
  className,
  defaultValue,
  disabled = false,
  error,
  hint,
  id,
  label,
  name,
  onChange,
  readOnly = false,
  required,
  showValue = true,
  swatches = [],
  value,
  ...props
}: ColorPickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? value ?? defaultColor);
  const currentValue = value ?? internalValue;
  const inputValue = getInputColor(currentValue);
  const normalizedValue = normalizeColor(currentValue);
  const hasSwatches = swatches.length > 0;

  function commitValue(nextValue: string, meta: ColorPickerChangeMeta) {
    if (disabled || readOnly) return;

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue, meta);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    commitValue(event.target.value, { source: "input", event });
  }

  function handleSwatchClick(
    swatch: ColorPickerSwatch,
    event: MouseEvent<HTMLButtonElement>,
  ) {
    commitValue(swatch.value, { source: "swatch", event, swatch });
  }

  return (
    <div className={joinClasses("atlas-color-picker", className)} {...props}>
      <label className="atlas-field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="atlas-color-picker__control">
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          aria-readonly={readOnly || undefined}
          className="atlas-color-picker__input"
          disabled={disabled}
          id={inputId}
          name={name}
          onChange={handleInputChange}
          readOnly={readOnly}
          required={required}
          type="color"
          value={inputValue}
        />
        {showValue ? (
          <output className="atlas-color-picker__value" htmlFor={inputId}>
            {currentValue}
          </output>
        ) : null}
      </div>
      {hasSwatches ? (
        <div
          aria-label={`${label} swatches`}
          className="atlas-color-picker__swatches"
          role="group"
        >
          {swatches.map((swatch, index) => {
            const swatchLabel = swatch.label ?? swatch.value;
            const swatchStyle = {
              "--atlas-color-picker-swatch": swatch.value,
            } as CSSProperties;

            return (
              <button
                aria-label={swatchLabel}
                aria-pressed={normalizeColor(swatch.value) === normalizedValue}
                className="atlas-color-picker__swatch"
                disabled={disabled || readOnly || swatch.disabled}
                key={`${swatch.value}-${index}`}
                onClick={(event) => handleSwatchClick(swatch, event)}
                style={swatchStyle}
                type="button"
              />
            );
          })}
        </div>
      ) : null}
      {hint ? (
        <span className="atlas-field__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="atlas-field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
