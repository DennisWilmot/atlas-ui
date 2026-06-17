import { useId, useMemo, useState } from "react";
import { shouldUseSearchableSelect } from "../../headless";
import type { SelectItem } from "../../types";

export type MultiSelectViewProps = {
  items?: SelectItem[];
  value?: string[];
  label?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  onChange?: (itemIds: string[]) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getMeaningfulItems(items: SelectItem[]): SelectItem[] {
  const seenIds = new Set<string>();

  return items.filter((item) => {
    if (item.id.trim().length === 0 || item.label.trim().length === 0) return false;
    if (seenIds.has(item.id)) return false;

    seenIds.add(item.id);
    return true;
  });
}

function getNormalizedValue(value: string[], itemIds: ReadonlySet<string>): string[] {
  const seenIds = new Set<string>();

  return value.filter((itemId) => {
    if (!itemIds.has(itemId)) return false;
    if (seenIds.has(itemId)) return false;

    seenIds.add(itemId);
    return true;
  });
}

function getMatchingItems(items: SelectItem[], query: string): SelectItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
}

export function MultiSelectView({
  className,
  disabled = false,
  items = [],
  label = "Select items",
  onChange,
  readOnly = false,
  searchPlaceholder = "Search items",
  value = [],
}: MultiSelectViewProps) {
  const baseId = useId();
  const [query, setQuery] = useState("");
  const meaningfulItems = useMemo(() => getMeaningfulItems(items), [items]);
  const meaningfulItemIds = useMemo(() => new Set(meaningfulItems.map((item) => item.id)), [meaningfulItems]);
  const selectedValue = useMemo(() => getNormalizedValue(value, meaningfulItemIds), [meaningfulItemIds, value]);
  const selectedIds = useMemo(() => new Set(selectedValue), [selectedValue]);
  const searchable = shouldUseSearchableSelect(meaningfulItems.length);
  const visibleItems = useMemo(() => {
    if (!searchable) return meaningfulItems;

    return getMatchingItems(meaningfulItems, query);
  }, [meaningfulItems, query, searchable]);

  if (meaningfulItems.length === 0) return null;

  const handleItemChange = (item: SelectItem, checked: boolean) => {
    if (disabled || readOnly || item.disabled) return;

    const selected = selectedIds.has(item.id);
    if (checked === selected) return;

    const nextValue = checked
      ? [...selectedValue, item.id]
      : selectedValue.filter((itemId) => itemId !== item.id);

    onChange?.(nextValue);
  };

  return (
    <fieldset className={joinClasses("atlas-multi-select-view", className)}>
      <legend className="atlas-field__label">{label}</legend>
      {searchable ? (
        <label className="atlas-field" htmlFor={`${baseId}-search`}>
          <span className="atlas-field__label">{label} search</span>
          <input
            aria-controls={`${baseId}-options`}
            className="atlas-field__control"
            disabled={disabled}
            id={`${baseId}-search`}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={query}
          />
        </label>
      ) : null}
      <div
        className={joinClasses(
          "atlas-multi-select-view__options",
          searchable && "atlas-multi-select-view__options--searchable",
        )}
        id={`${baseId}-options`}
      >
        {visibleItems.length > 0 ? (
          visibleItems.map((item, index) => {
            const optionId = `${baseId}-option-${index}`;
            const optionDisabled = disabled || readOnly || item.disabled;

            return (
              <label
                className={joinClasses(
                  "atlas-multi-select-view__option",
                  optionDisabled && "atlas-multi-select-view__option--disabled",
                )}
                htmlFor={optionId}
                key={item.id}
              >
                <input
                  checked={selectedIds.has(item.id)}
                  className="atlas-multi-select-view__checkbox"
                  disabled={optionDisabled}
                  id={optionId}
                  onChange={(event) => handleItemChange(item, event.target.checked)}
                  type="checkbox"
                />
                <span>{item.label}</span>
              </label>
            );
          })
        ) : (
          <div className="atlas-empty" role="status">
            Nothing matches
          </div>
        )}
      </div>
    </fieldset>
  );
}
