import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

export type DropdownMenuAlign = "start" | "end";

export type DropdownMenuItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
};

export type DropdownMenuProps = {
  align?: DropdownMenuAlign;
  ariaLabel?: string;
  className?: string;
  items?: DropdownMenuItem[];
  onSelect?: (itemId: string) => void;
  triggerLabel?: ReactNode;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function DropdownMenu({
  align = "start",
  ariaLabel = "Menu",
  className,
  items = [],
  onSelect,
  triggerLabel = "Menu",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) return null;

  const enabledIndexes = visibleItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.disabled)
    .map(({ index }) => index);

  function focusItem(index: number | undefined) {
    if (index === undefined) return;
    queueMicrotask(() => itemRefs.current[index]?.focus());
  }

  function openMenu(focusTarget: "first" | "last" | "none" = "none") {
    setOpen(true);

    if (focusTarget === "first") {
      focusItem(enabledIndexes[0]);
      return;
    }

    if (focusTarget === "last") {
      focusItem(enabledIndexes[enabledIndexes.length - 1]);
    }
  }

  function closeMenu(options?: { restoreFocus?: boolean }) {
    setOpen(false);

    if (options?.restoreFocus !== false) {
      queueMicrotask(() => triggerRef.current?.focus());
    }
  }

  function getAdjacentEnabledIndex(currentIndex: number, direction: 1 | -1): number | undefined {
    if (enabledIndexes.length === 0) return undefined;

    const currentEnabledPosition = enabledIndexes.indexOf(currentIndex);
    const safePosition = currentEnabledPosition >= 0 ? currentEnabledPosition : 0;
    const nextPosition = (safePosition + direction + enabledIndexes.length) % enabledIndexes.length;
    return enabledIndexes[nextPosition];
  }

  return (
    <div className={joinClasses("atlas-dropdown-menu", `atlas-dropdown-menu--${align}`, className)}>
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className="atlas-action-menu__item"
        onClick={() => {
          if (open) {
            closeMenu({ restoreFocus: false });
            return;
          }

          openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            openMenu("first");
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            openMenu("last");
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMenu("first");
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            closeMenu();
          }
        }}
        ref={triggerRef}
        type="button"
      >
        {triggerLabel}
      </button>
      {open ? (
        <div
          className="atlas-dropdown-menu__content"
          id={menuId}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;

            setOpen(false);
          }}
          role="menu"
        >
          {visibleItems.map((item, index) => (
            <button
              className="atlas-dropdown-menu__item"
              disabled={item.disabled}
              key={item.id}
              onClick={() => {
                if (item.disabled) return;
                onSelect?.(item.id);
                closeMenu();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  focusItem(getAdjacentEnabledIndex(index, 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  focusItem(getAdjacentEnabledIndex(index, -1));
                } else if (event.key === "Home") {
                  event.preventDefault();
                  focusItem(enabledIndexes[0]);
                } else if (event.key === "End") {
                  event.preventDefault();
                  focusItem(enabledIndexes[enabledIndexes.length - 1]);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  closeMenu();
                } else if (event.key === "Tab") {
                  setOpen(false);
                }
              }}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              role="menuitem"
              type="button"
            >
              {item.icon ? <span className="atlas-button__icon">{item.icon}</span> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
