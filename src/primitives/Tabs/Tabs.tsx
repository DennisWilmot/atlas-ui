import { useId, useMemo, useRef, useState } from "react";
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
  const generatedId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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

  function getTabId(itemId: string) {
    return `${generatedId}-${itemId}-tab`;
  }

  function getPanelId(itemId: string) {
    return `${generatedId}-${itemId}-panel`;
  }

  function selectItem(item: TabItem | undefined, options?: { focus?: boolean }) {
    if (!item || item.disabled) return;

    if (!isControlled) {
      setInternalSelectedKey(item.id);
    }

    if (options?.focus) {
      tabRefs.current[item.id]?.focus();
    }

    onSelectionChange?.(item.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentItem: TabItem) {
    const enabledItems = visibleItems.filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;

    const currentIndex = enabledItems.findIndex((item) => item.id === currentItem.id);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectItem(enabledItems[(safeIndex + 1) % enabledItems.length], { focus: true });
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectItem(enabledItems[(safeIndex - 1 + enabledItems.length) % enabledItems.length], { focus: true });
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectItem(enabledItems[0], { focus: true });
    }

    if (event.key === "End") {
      event.preventDefault();
      selectItem(enabledItems[enabledItems.length - 1], { focus: true });
    }
  }

  return (
    <div className={joinClasses("atlas-tabs", className)}>
      <div aria-label={label} className="atlas-tabs__list" role="tablist">
        {visibleItems.map((item) => {
          const selected = item.id === activeKey;

          return (
            <button
              aria-controls={getPanelId(item.id)}
              aria-selected={selected}
              className={joinClasses("atlas-tabs__tab", selected && "atlas-tabs__tab--selected")}
              disabled={item.disabled}
              id={getTabId(item.id)}
              key={item.id}
              onClick={() => selectItem(item)}
              onKeyDown={(event) => handleKeyDown(event, item)}
              ref={(element) => {
                tabRefs.current[item.id] = element;
              }}
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
          aria-labelledby={getTabId(item.id)}
          hidden={item.id !== activeKey}
          id={getPanelId(item.id)}
          key={item.id}
          role="tabpanel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
