import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { OverlayMode } from "../../types";

export type DatePickerValue = Date | string | null | undefined;

export type DatePickerProps = {
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  label?: string;
  placeholder?: string;
  min?: DatePickerValue;
  max?: DatePickerValue;
  mode?: OverlayMode;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  hidden?: boolean;
  name?: string;
  className?: string;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateInputValue(value: DatePickerValue): string {
  if (value === null || value === undefined || value === "") return "";

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";

    return [
      value.getFullYear(),
      padDatePart(value.getMonth() + 1),
      padDatePart(value.getDate()),
    ].join("-");
  }

  if (ISO_DATE_PATTERN.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join("-");
}

function getDateKeyTime(value: string): number {
  const [year = "0", month = "1", day = "1"] = value.split("-");

  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

function formatDateLabel(value: string): string {
  if (!value) return "";

  const [year = "0", month = "1", day = "1"] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return Number.isNaN(date.getTime()) ? value : DISPLAY_DATE_FORMATTER.format(date);
}

export function DatePicker({
  className,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  hidden = false,
  label = "Date",
  max,
  min,
  mode = "modal",
  name,
  onChange,
  onOpenChange,
  open,
  placeholder = "Choose date",
  readOnly = false,
  required = false,
  value,
}: DatePickerProps) {
  const generatedId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState(toDateInputValue(defaultValue));

  const selectedValue = value === undefined ? internalValue : toDateInputValue(value);
  const minValue = useMemo(() => toDateInputValue(min), [min]);
  const maxValue = useMemo(() => toDateInputValue(max), [max]);
  const invalidRange = minValue.length > 0 && maxValue.length > 0 && getDateKeyTime(minValue) > getDateKeyTime(maxValue);
  const controlsDisabled = disabled || readOnly;
  const isOpen = (open ?? internalOpen) && !controlsDisabled;
  const labelId = `${generatedId}-label`;
  const valueId = `${generatedId}-value`;
  const overlayId = `${generatedId}-overlay`;
  const inputId = `${generatedId}-input`;

  if (hidden || invalidRange) return null;

  const setOpen = (nextOpen: boolean) => {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const closeOverlay = () => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  };

  const setValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
    closeOverlay();
  };

  const displayValue = formatDateLabel(selectedValue);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className={joinClasses("atlas-date-picker", className)}>
      <div className="atlas-field">
        <span className="atlas-field__label" id={labelId}>
          {label}
        </span>
        <button
          aria-controls={isOpen ? overlayId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-labelledby={`${labelId} ${valueId}`}
          className="atlas-date-picker__trigger"
          disabled={controlsDisabled}
          onClick={() => {
            if (isOpen) {
              closeOverlay();
              return;
            }

            setOpen(true);
          }}
          ref={triggerRef}
          type="button"
        >
          <span className={displayValue ? undefined : "atlas-date-picker__placeholder"} id={valueId}>
            {displayValue || placeholder}
          </span>
        </button>
      </div>
      {isOpen ? (
        <div
          aria-labelledby={labelId}
          aria-modal={mode === "modal" ? true : undefined}
          className={joinClasses("atlas-date-picker__overlay", `atlas-date-picker__overlay--${mode}`)}
          id={overlayId}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeOverlay();
            }
          }}
          role="dialog"
        >
          <label className="atlas-field" htmlFor={inputId}>
            <span className="atlas-field__label">{label}</span>
            <input
              className="atlas-field__control"
              disabled={disabled}
              id={inputId}
              max={maxValue || undefined}
              min={minValue || undefined}
              name={name}
              onChange={(event) => setValue(event.target.value)}
              ref={inputRef}
              readOnly={readOnly}
              required={required}
              type="date"
              value={selectedValue}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
