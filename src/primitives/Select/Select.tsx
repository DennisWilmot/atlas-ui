import { useId, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { SelectItem as CanonicalOption } from "../../types";

// Reuse the canonical SelectOption ({ id, label, disabled? }) and add the value
// the form control submits.
export type SelectOption = CanonicalOption & {
  value: string;
};

export type SelectProps = {
  items: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** Optional message shown when a search yields no matches (no default copy). */
  noResultsLabel?: string;
  "aria-label"?: string;
};

// URA Rule 12 / DESIGN.md overflow threshold: at most this many options use a
// standard select; more upgrade to a searchable combobox automatically.
const OVERFLOW_THRESHOLD = 10;

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Select({
  items,
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder,
  hint,
  error,
  disabled = false,
  required = false,
  name,
  id,
  className,
  noResultsLabel,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const controlId = `${baseId}-control`;
  const labelId = label ? `${baseId}-label` : undefined;
  // The error replaces the hint: only describe/show the hint when there is no error.
  const hintId = hint && !error ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const isControlled = value !== undefined;
  // If only one item exists and nothing is preselected, select it by default.
  const [internal, setInternal] = useState<string | undefined>(
    defaultValue ?? (items.length === 1 ? items[0].value : undefined),
  );

  // URA Law 4: no options, nothing meaningful to show, render nothing.
  if (!items.length) return null;

  const currentValue = isControlled ? value : internal;

  function handleSelect(next: string) {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }

  const searchable = items.length > OVERFLOW_THRESHOLD;

  return (
    <div className={joinClasses("atlas-field", "atlas-select", className)}>
      {label ? (
        <label className="atlas-field__label" id={labelId} htmlFor={controlId}>
          {label}
          {required ? (
            <span className="atlas-field__required" aria-hidden="true">
              {" *"}
            </span>
          ) : null}
        </label>
      ) : null}

      {searchable ? (
        <SelectCombobox
          items={items}
          value={currentValue}
          onSelect={handleSelect}
          controlId={controlId}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          describedBy={describedBy}
          invalid={Boolean(error)}
          ariaLabel={label ? undefined : ariaLabel}
          labelledBy={labelId}
          noResultsLabel={noResultsLabel}
        />
      ) : (
        <SelectNative
          items={items}
          value={currentValue}
          onSelect={handleSelect}
          controlId={controlId}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          name={name}
          describedBy={describedBy}
          invalid={Boolean(error)}
          ariaLabel={label ? undefined : ariaLabel}
        />
      )}

      {hint && !error ? (
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

type NativeProps = {
  items: SelectOption[];
  value: string | undefined;
  onSelect: (value: string) => void;
  controlId: string;
  placeholder?: string;
  disabled: boolean;
  required: boolean;
  name?: string;
  describedBy?: string;
  invalid: boolean;
  ariaLabel?: string;
};

function SelectNative({
  items,
  value,
  onSelect,
  controlId,
  placeholder,
  disabled,
  required,
  name,
  describedBy,
  invalid,
  ariaLabel,
}: NativeProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onSelect(event.target.value);
  }

  return (
    <div className="atlas-select__field">
      <select
        id={controlId}
        className="atlas-field__control atlas-select__native"
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        name={name}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-label={ariaLabel}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {items.map((item) => (
          <option key={item.id} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>
      <svg
        className="atlas-select__chevron"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

type ComboboxProps = {
  items: SelectOption[];
  value: string | undefined;
  onSelect: (value: string) => void;
  controlId: string;
  placeholder?: string;
  disabled: boolean;
  required: boolean;
  describedBy?: string;
  invalid: boolean;
  ariaLabel?: string;
  labelledBy?: string;
  noResultsLabel?: string;
};

function SelectCombobox({
  items,
  value,
  onSelect,
  controlId,
  placeholder,
  disabled,
  required,
  describedBy,
  invalid,
  ariaLabel,
  labelledBy,
  noResultsLabel,
}: ComboboxProps) {
  const listboxId = `${controlId}-listbox`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedItem = items.find((item) => item.value === value);
  const needle = query.trim().toLowerCase();
  const filtered = needle ? items.filter((item) => item.label.toLowerCase().includes(needle)) : items;
  const displayValue = open ? query : selectedItem?.label ?? "";

  function commitSelect(item: SelectOption) {
    if (item.disabled) return;
    onSelect(item.value);
    setOpen(false);
    setQuery("");
  }

  function moveActive(direction: 1 | -1) {
    if (!filtered.length) return;
    let next = activeIndex;
    for (let i = 0; i < filtered.length; i += 1) {
      next = (next + direction + filtered.length) % filtered.length;
      if (!filtered[next].disabled) break;
    }
    setActiveIndex(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
      } else {
        moveActive(1);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (open) moveActive(-1);
    } else if (event.key === "Enter") {
      if (open && filtered[activeIndex]) {
        event.preventDefault();
        commitSelect(filtered[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div className="atlas-select__combobox">
      <input
        type="text"
        role="combobox"
        id={controlId}
        className="atlas-field__control atlas-select__input"
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelledBy}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      <svg
        className="atlas-select__chevron"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {open && !disabled ? (
        <ul role="listbox" id={listboxId} className="atlas-select__listbox" aria-label={ariaLabel}>
          {filtered.length ? (
            filtered.map((item, index) => (
              <li
                key={item.id}
                id={`${listboxId}-opt-${index}`}
                role="option"
                aria-selected={item.value === value}
                aria-disabled={item.disabled || undefined}
                className={joinClasses(
                  "atlas-select__option",
                  index === activeIndex && "atlas-select__option--active",
                  item.disabled && "atlas-select__option--disabled",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commitSelect(item)}
              >
                {item.label}
              </li>
            ))
          ) : noResultsLabel ? (
            <li className="atlas-select__empty" aria-disabled="true">
              {noResultsLabel}
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
