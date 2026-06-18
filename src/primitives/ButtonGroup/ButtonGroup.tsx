import type { HTMLAttributes, ReactNode } from "react";
import { Button, type ButtonSize } from "../Button";

export type ButtonGroupVariant = "attached" | "segmented";

export type ButtonGroupItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: ButtonGroupItem[];
  variant?: ButtonGroupVariant;
  selectedId?: string;
  size?: ButtonSize;
  onItemClick?: (id: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function ButtonGroup({
  items,
  variant = "attached",
  selectedId,
  size = "md",
  onItemClick,
  className,
  ...props
}: ButtonGroupProps) {
  // URA Law 4: no items, nothing meaningful to show, render nothing.
  if (!items.length) return null;

  const selectable = selectedId !== undefined;

  return (
    <div
      className={joinClasses("atlas-button-group", `atlas-button-group--${variant}`, className)}
      role="group"
      {...props}
    >
      {items.map((item) => {
        const selected = selectable && item.id === selectedId;

        return (
          <Button
            key={item.id}
            type="button"
            size={size}
            variant={variant === "segmented" ? "ghost" : "secondary"}
            className="atlas-button-group__item"
            disabled={item.disabled}
            leftIcon={item.icon}
            aria-pressed={selectable ? selected : undefined}
            data-selected={selected ? "true" : undefined}
            onClick={() => onItemClick?.(item.id)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
