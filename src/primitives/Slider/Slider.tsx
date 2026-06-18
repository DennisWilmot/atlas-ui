import { useId, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

export type SliderValue = number | [number, number];

export type SliderProps = {
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  onValueCommit?: (value: SliderValue) => void;
  range?: boolean;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hideLabelVisually?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  showMinMaxLabels?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi);
}

export function Slider({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  range = false,
  min = 0,
  max = 100,
  step = 1,
  label,
  hideLabelVisually = false,
  disabled = false,
  showValue = false,
  showMinMaxLabels = false,
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: SliderProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = label ? `${baseId}-label` : undefined;

  const isControlled = value !== undefined;

  const [internal, setInternal] = useState<SliderValue>(() => {
    const init = isControlled ? value : defaultValue;
    if (range) {
      const arr = Array.isArray(init) ? init : [min, max];
      return [clamp(arr[0], min, max), clamp(arr[1], min, max)];
    }
    return clamp(typeof init === "number" ? init : min, min, max);
  });

  // URA Law 4 + WCAG 4.1.2: a single slider with no accessible name is
  // meaningless and inaccessible. Range thumbs are always named (min/max), so
  // this only guards single mode.
  if (!range && !label && !ariaLabel) return null;

  const raw = isControlled ? (value as SliderValue) : internal;

  // Clamp the rendered value so it never falls outside min/max (or crosses).
  const current: SliderValue = range
    ? (() => {
        const arr = Array.isArray(raw) ? raw : [min, max];
        const lo = clamp(arr[0], min, max);
        const hi = clamp(arr[1], min, max);
        return [Math.min(lo, hi), Math.max(lo, hi)] as [number, number];
      })()
    : clamp(typeof raw === "number" ? raw : min, min, max);

  function emitChange(next: SliderValue) {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }

  function handleSingleChange(event: ChangeEvent<HTMLInputElement>) {
    emitChange(clamp(Number(event.target.value), min, max));
  }

  function handleRangeChange(index: 0 | 1, event: ChangeEvent<HTMLInputElement>) {
    const arr = current as [number, number];
    const v = clamp(Number(event.target.value), min, max);
    const next: [number, number] =
      index === 0 ? [Math.min(v, arr[1]), arr[1]] : [arr[0], Math.max(v, arr[0])];
    emitChange(next);
  }

  function handleCommit() {
    onValueCommit?.(current);
  }

  const pct = (n: number) => (max > min ? ((n - min) / (max - min)) * 100 : 0);
  const baseName = label ?? ariaLabel;
  const valueText = range
    ? `${(current as [number, number])[0]} - ${(current as [number, number])[1]}`
    : `${current as number}`;

  return (
    <div className={joinClasses("atlas-slider", disabled && "atlas-slider--disabled", className)}>
      {label || showValue ? (
        <div className="atlas-slider__header">
          {label ? (
            <span
              id={labelId}
              className={joinClasses("atlas-slider__label", hideLabelVisually && "atlas-visually-hidden")}
            >
              {label}
            </span>
          ) : null}
          {showValue ? (
            <span className="atlas-slider__value" aria-hidden="true">
              {valueText}
            </span>
          ) : null}
        </div>
      ) : null}

      {range ? (
        <span className="atlas-slider__control atlas-slider__range">
          <span className="atlas-slider__track" aria-hidden="true" />
          <span
            className="atlas-slider__fill"
            aria-hidden="true"
            style={
              {
                left: `${pct((current as [number, number])[0])}%`,
                width: `${pct((current as [number, number])[1]) - pct((current as [number, number])[0])}%`,
              } as CSSProperties
            }
          />
          <input
            type="range"
            className="atlas-slider__input"
            min={min}
            max={max}
            step={step}
            value={(current as [number, number])[0]}
            disabled={disabled}
            aria-label={baseName ? `${baseName} minimum` : "Minimum"}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={(current as [number, number])[0]}
            onChange={(event) => handleRangeChange(0, event)}
            onPointerUp={handleCommit}
            onKeyUp={handleCommit}
          />
          <input
            type="range"
            className="atlas-slider__input"
            min={min}
            max={max}
            step={step}
            value={(current as [number, number])[1]}
            disabled={disabled}
            aria-label={baseName ? `${baseName} maximum` : "Maximum"}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={(current as [number, number])[1]}
            onChange={(event) => handleRangeChange(1, event)}
            onPointerUp={handleCommit}
            onKeyUp={handleCommit}
          />
        </span>
      ) : (
        <input
          type="range"
          className="atlas-slider__input atlas-slider__input--single"
          min={min}
          max={max}
          step={step}
          value={current as number}
          disabled={disabled}
          name={name}
          aria-labelledby={labelId}
          aria-label={labelId ? undefined : ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current as number}
          onChange={handleSingleChange}
          onPointerUp={handleCommit}
          onKeyUp={handleCommit}
        />
      )}

      {showMinMaxLabels ? (
        <div className="atlas-slider__minmax" aria-hidden="true">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      ) : null}
    </div>
  );
}
