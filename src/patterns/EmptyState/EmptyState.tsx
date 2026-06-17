import { useId } from "react";
import type { ReactNode } from "react";
import { getVisibleActions } from "../../headless";
import type { Action } from "../../types";
import { ActionMenu } from "../ActionMenu";

export type EmptyStateProps = {
  actions?: Action[];
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  onAction?: (actionId: string) => void;
  title?: ReactNode;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function isMeaningfulNode(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (Array.isArray(node)) return node.some(isMeaningfulNode);
  return true;
}

export function EmptyState({
  actions = [],
  ariaLabel = "Empty state",
  children,
  className,
  description,
  icon,
  onAction,
  title,
}: EmptyStateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const visibleActions = getVisibleActions(actions);
  const hasTitle = isMeaningfulNode(title);
  const hasDescription = isMeaningfulNode(description);
  const hasIcon = isMeaningfulNode(icon);
  const hasChildren = isMeaningfulNode(children);

  if (!hasTitle && !hasDescription && !hasIcon && !hasChildren && visibleActions.length === 0) {
    return null;
  }

  return (
    <section
      aria-describedby={hasDescription ? descriptionId : undefined}
      aria-label={hasTitle ? undefined : ariaLabel}
      aria-labelledby={hasTitle ? titleId : undefined}
      className={joinClasses("atlas-empty-state", className)}
    >
      {hasIcon ? <div className="atlas-empty-state__icon" aria-hidden="true">{icon}</div> : null}
      {hasTitle ? <h2 className="atlas-empty-state__title" id={titleId}>{title}</h2> : null}
      {hasDescription ? (
        <div className="atlas-empty-state__description" id={descriptionId}>
          {description}
        </div>
      ) : null}
      {hasChildren ? <div className="atlas-empty-state__content">{children}</div> : null}
      {visibleActions.length > 0 ? (
        <ActionMenu actions={visibleActions} ariaLabel={`${ariaLabel} actions`} onAction={onAction} />
      ) : null}
    </section>
  );
}
