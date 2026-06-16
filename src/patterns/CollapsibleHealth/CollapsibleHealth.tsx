import { useState } from "react";
import type { HealthItem, HealthStatus } from "../../types";
import { getAttentionHealthItems, getVisibleActions, getVisibleHealthItems } from "../../headless";
import { Badge, type BadgeVariant } from "../../primitives";
import { ActionMenu } from "../ActionMenu";
import { ListView } from "../ListView";

type HealthStatusLabels = Partial<Record<HealthStatus, string>>;

export type CollapsibleHealthProps = {
  items?: HealthItem[];
  label?: string;
  className?: string;
  readOnly?: boolean;
  defaultExpanded?: boolean;
  healthyLabel?: string;
  attentionLabel?: string;
  emptyLabel?: React.ReactNode;
  showEmptyState?: boolean;
  pageSize?: number;
  statusLabels?: HealthStatusLabels;
  onAction?: (actionId: string, itemId: string) => void;
};

const defaultStatusLabels = {
  healthy: "Healthy",
  degraded: "Degraded",
  pending: "Pending",
} satisfies Record<HealthStatus, string>;

const statusVariants = {
  healthy: "success",
  degraded: "warning",
  pending: "info",
} satisfies Record<HealthStatus, BadgeVariant>;

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function matchesHealthItem(item: HealthItem, query: string): boolean {
  const text = [item.label, item.status].join(" ").toLowerCase();
  return text.includes(query);
}

export function CollapsibleHealth({
  attentionLabel = "Needs attention",
  className,
  defaultExpanded = true,
  emptyLabel = "Nothing to show",
  healthyLabel,
  items = [],
  label = "Health",
  onAction,
  pageSize,
  readOnly = false,
  showEmptyState = false,
  statusLabels,
}: CollapsibleHealthProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const visibleItems = getVisibleHealthItems(items);

  if (visibleItems.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const mergedStatusLabels = { ...defaultStatusLabels, ...statusLabels };
  const attentionItems = getAttentionHealthItems(visibleItems);

  if (attentionItems.length === 0) {
    return (
      <section
        aria-label={label}
        className={joinClasses("atlas-collapsible-health", "atlas-collapsible-health--compact", className)}
      >
        <Badge dot variant="success">{healthyLabel ?? mergedStatusLabels.healthy}</Badge>
      </section>
    );
  }

  const hasDegraded = attentionItems.some((item) => item.status === "degraded");
  const summaryVariant = hasDegraded ? statusVariants.degraded : statusVariants.pending;

  return (
    <section className={joinClasses("atlas-collapsible-health", className)} aria-label={label}>
      <button
        aria-expanded={expanded}
        className="atlas-collapsible-health__summary"
        onClick={() => setExpanded((current) => !current)}
        type="button"
      >
        <Badge dot variant={summaryVariant}>{attentionLabel}</Badge>
        <span className="atlas-collapsible-health__count">{attentionItems.length}</span>
      </button>
      {expanded ? (
        <ListView
          getItemKey={(item) => item.id}
          items={attentionItems}
          label={`${label} items`}
          pageSize={pageSize}
          renderItem={(item) => (
            <div className="atlas-health-item">
              <div className="atlas-health-item__body">
                <Badge dot variant={statusVariants[item.status]}>{mergedStatusLabels[item.status]}</Badge>
                <span className="atlas-health-item__label">{item.label}</span>
                {item.description ? <span className="atlas-health-item__description">{item.description}</span> : null}
              </div>
              {readOnly ? null : (
                <ActionMenu
                  actions={getVisibleActions(item.actions)}
                  ariaLabel={`${item.label} actions`}
                  onAction={(actionId) => onAction?.(actionId, item.id)}
                />
              )}
            </div>
          )}
          searchPredicate={matchesHealthItem}
        />
      ) : null}
    </section>
  );
}
