import { useRef, type HTMLAttributes, type KeyboardEvent } from "react";
import { Button, type ButtonSize } from "../Button";
import type { Action } from "../../types";

export type ButtonGroupVariant = "attached" | "segmented";

export type ButtonGroupSelectionMode = "toggle" | "single";

export type ButtonGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  items: Action[];
  variant?: ButtonGroupVariant;
  selectedId?: string;
  size?: ButtonSize;
  onItemClick?: (id: string) => void;
  /**
   * Accessibility pattern.
   * - "toggle" (default): a toolbar of toggle buttons (`role="group"`,
   *   `aria-pressed` per item). Tab moves between buttons. Leave as-is for
   *   action clusters or multi-state groups.
   * - "single": a single-select radio group (`role="radiogroup"`,
   *   `role="radio"` + `aria-checked` per item) with arrow-key roving focus.
   *   Use when the group picks exactly one of N.
   */
  selectionMode?: ButtonGroupSelectionMode;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * A small cluster of related buttons (attached or segmented).
 *
 * Intended for a small, fixed set of items: segmented controls, view
 * switchers, or a few related actions. It deliberately has no overflow
 * handling: pass a handful of items, not dozens. For large or unbounded
 * option sets, use a select/list pattern instead.
 *
 * Items use the canonical `Action` type, but `Action.intent` is intentionally
 * not applied. Every item shares the group's `variant` so a segmented control
 * reads as a single unit. Use `selectedId` to emphasize the active item rather
 * than per-item intent.
 */
export function ButtonGroup({
  items,
  variant = "attached",
  selectedId,
  size = "md",
  onItemClick,
  selectionMode = "toggle",
  className,
  ...props
}: ButtonGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  // Hidden actions are respected by not rendering them.
  const visibleItems = items.filter((item) => !item.hidden);

  // URA Law 4: nothing meaningful to show, render nothing.
  if (!visibleItems.length) return null;

  const single = selectionMode === "single";
  const selectable = selectedId !== undefined;
  const firstEnabledIndex = visibleItems.findIndex((item) => !item.disabled);

  // Roving tabindex for the radio pattern: only the selected (or, with no
  // selection, the first enabled) item is in the tab order; arrows do the rest.
  function tabIndexFor(item: Action, index: number): number | undefined {
    if (!single) return undefined;
    if (selectable) return item.id === selectedId ? 0 : -1;
    return index === firstEnabledIndex ? 0 : -1;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;

    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      ".atlas-button-group__item",
    );
    if (!buttons || !buttons.length) return;

    event.preventDefault();
    const current = Array.from(buttons).indexOf(
      document.activeElement as HTMLButtonElement,
    );
    const direction = forward ? 1 : -1;
    const count = visibleItems.length;

    let next = current < 0 ? (forward ? -1 : 0) : current;
    for (let step = 0; step < count; step += 1) {
      next = (next + direction + count) % count;
      if (!visibleItems[next].disabled) break;
    }
    if (visibleItems[next].disabled) return; // every item disabled

    buttons[next]?.focus();
    onItemClick?.(visibleItems[next].id);
  }

  return (
    <div
      ref={groupRef}
      className={joinClasses(
        "atlas-button-group",
        `atlas-button-group--${variant}`,
        className,
      )}
      role={single ? "radiogroup" : "group"}
      onKeyDown={single ? handleKeyDown : undefined}
      {...props}
    >
      {visibleItems.map((item, index) => {
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
            role={single ? "radio" : undefined}
            aria-pressed={!single && selectable ? selected : undefined}
            aria-checked={single ? selected : undefined}
            tabIndex={tabIndexFor(item, index)}
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
