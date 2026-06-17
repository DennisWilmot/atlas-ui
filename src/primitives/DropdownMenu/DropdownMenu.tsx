import { useState } from "react";
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
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) return null;

  return (
    <div className={joinClasses("atlas-dropdown-menu", `atlas-dropdown-menu--${align}`, className)}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className="atlas-action-menu__item"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {triggerLabel}
      </button>
      {open ? (
        <div className="atlas-dropdown-menu__content" role="menu">
          {visibleItems.map((item) => (
            <button
              className="atlas-dropdown-menu__item"
              disabled={item.disabled}
              key={item.id}
              onClick={() => {
                if (item.disabled) return;
                onSelect?.(item.id);
                setOpen(false);
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
