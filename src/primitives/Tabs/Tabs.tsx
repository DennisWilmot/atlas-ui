import { useMemo, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
};

export type TabsProps = {
  className?: string;
  defaultSelectedKey?: string;
  items?: TabItem[];
  label?: string;
  onSelectionChange?: (itemId: string) => void;
  selectedKey?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getFirstSelectable(items: TabItem[]): TabItem | undefined {
  return items.find((item) => !item.disabled) ?? items[0];
}

export function Tabs({
  className,
  defaultSelectedKey,
  items = [],
  label = "Tabs",
  onSelectionChange,
  selectedKey,
}: TabsProps) {
  const visibleItems = useMemo(() => items.filter((item) => !item.hidden), [items]);
  const firstSelectable = getFirstSelectable(visibleItems);
  const isControlled = selectedKey !== undefined;
  const [internalSelectedKey, setInternalSelectedKey] = useState(
    defaultSelectedKey ?? firstSelectable?.id ?? "",
  );

  if (visibleItems.length === 0) return null;

  const requestedKey = isControlled ? selectedKey : internalSelectedKey;
  const requestedItem = visibleItems.find((item) => item.id === requestedKey);
  const selectedItem = requestedItem && !requestedItem.disabled ? requestedItem : firstSelectable;
  const activeKey = selectedItem?.id ?? visibleItems[0]?.id;

  function selectItem(item: TabItem | undefined) {
    if (!item || item.disabled) return;

    if (!isControlled) {
      setInternalSelectedKey(item.id);
    }

    onSelectionChange?.(item.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabledItems = visibleItems.filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;

    const currentIndex = enabledItems.findIndex((item) => item.id === activeKey);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectItem(enabledItems[(safeIndex + 1) % enabledItems.length]);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectItem(enabledItems[(safeIndex - 1 + enabledItems.length) % enabledItems.length]);
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectItem(enabledItems[0]);
    }

    if (event.key === "End") {
      event.preventDefault();
      selectItem(enabledItems[enabledItems.length - 1]);
    }
  }

  return (
    <div className={joinClasses("atlas-tabs", className)}>
      <div aria-label={label} className="atlas-tabs__list" onKeyDown={handleKeyDown} role="tablist">
        {visibleItems.map((item) => {
          const selected = item.id === activeKey;

          return (
            <button
              aria-controls={`${item.id}-panel`}
              aria-selected={selected}
              className={joinClasses("atlas-tabs__tab", selected && "atlas-tabs__tab--selected")}
              disabled={item.disabled}
              id={`${item.id}-tab`}
              key={item.id}
              onClick={() => selectItem(item)}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {visibleItems.map((item) => (
        <div
          aria-labelledby={`${item.id}-tab`}
          hidden={item.id !== activeKey}
          id={`${item.id}-panel`}
          key={item.id}
          role="tabpanel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
