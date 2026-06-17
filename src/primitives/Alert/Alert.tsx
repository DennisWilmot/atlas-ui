import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Action } from "../../types";
import { getVisibleActions } from "../../headless";

export type AlertTone = "info" | "success" | "warning" | "danger";

export type AlertProps = {
  actions?: Action[];
  autoDismissMs?: number;
  className?: string;
  description?: ReactNode;
  dismissable?: boolean;
  onAction?: (actionId: string) => void;
  onDismiss?: () => void;
  title?: ReactNode;
  tone?: AlertTone;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Alert({
  actions = [],
  autoDismissMs,
  className,
  description,
  dismissable = false,
  onAction,
  onDismiss,
  title,
  tone = "info",
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  const visibleActions = useMemo(() => getVisibleActions(actions), [actions]);
  const hasContent = Boolean(title || description || visibleActions.length > 0);

  useEffect(() => {
    if (tone !== "success" || !autoDismissMs || !visible) return undefined;

    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss, tone, visible]);

  if (!visible || !hasContent) return null;

  function dismiss() {
    setVisible(false);
    onDismiss?.();
  }

  return (
    <section className={joinClasses("atlas-alert", `atlas-alert--${tone}`, className)} role="status">
      <span className="atlas-alert__content">
        {title ? <span className="atlas-alert__title">{title}</span> : null}
        {description ? <span className="atlas-alert__description">{description}</span> : null}
      </span>
      {visibleActions.length > 0 ? (
        <span className="atlas-alert__actions">
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
        </span>
      ) : null}
      {dismissable ? (
        <button className="atlas-alert__dismiss" onClick={dismiss} type="button">
          Dismiss
        </button>
      ) : null}
    </section>
  );
}
