import type { Action } from "../../types";
import { getVisibleActions } from "../../headless";

export type ActionMenuProps = {
  actions?: Action[];
  ariaLabel?: string;
  className?: string;
  onAction?: (actionId: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function ActionMenu({
  actions = [],
  ariaLabel = "Actions",
  className,
  onAction,
}: ActionMenuProps) {
  const visibleActions = getVisibleActions(actions);

  if (visibleActions.length === 0) return null;

  return (
    <div className={joinClasses("atlas-action-menu", className)} role="group" aria-label={ariaLabel}>
      {visibleActions.map((action) => (
        <button
          className={joinClasses(
            "atlas-action-menu__item",
            action.intent ? `atlas-action-menu__item--${action.intent}` : undefined,
          )}
          disabled={action.disabled}
          key={action.id}
          onClick={() => {
            if (!action.disabled) onAction?.(action.id);
          }}
          type="button"
        >
          {action.icon ? <span className="atlas-button__icon">{action.icon}</span> : null}
          {action.label}
        </button>
      ))}
    </div>
  );
}
