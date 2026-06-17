import type { ReactNode } from "react";
import { Button } from "../../../src/primitives";

export type SocialButtonAction = {
  id: string;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
};

export type SocialButtonsExampleProps = {
  actions?: SocialButtonAction[];
  disabled?: boolean;
  groupLabel?: string;
  onAction?: (actionId: string) => void;
};

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function SocialButtonsExample({
  actions = [],
  disabled = false,
  groupLabel = "Identity provider access",
  onAction,
}: SocialButtonsExampleProps) {
  const visibleActions = actions.filter((action) => !action.hidden && hasText(action.label));

  if (visibleActions.length === 0) return null;

  return (
    <div className="social-buttons-example" role="group" aria-label={hasText(groupLabel) ? groupLabel : undefined}>
      {visibleActions.map((action) => (
        <Button
          disabled={disabled || action.disabled}
          key={action.id}
          leftIcon={
            action.icon ? (
              <span className="social-buttons-example__icon" aria-hidden="true">
                {action.icon}
              </span>
            ) : undefined
          }
          onClick={() => onAction?.(action.id)}
          type="button"
          variant="secondary"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
