import type { ReactNode } from "react";
import type { ProgressStep, ProgressStepState } from "../../types";
import { getVisibleActions, getVisibleProgressSteps } from "../../headless";
import { Badge, type BadgeVariant } from "../../primitives";
import { ActionMenu } from "../ActionMenu";
import { ListView } from "../ListView";

type ProgressStepLabels = Partial<Record<ProgressStepState, ReactNode>>;

export type ProgressStepsProps = {
  steps?: ProgressStep[];
  label?: string;
  className?: string;
  readOnly?: boolean;
  emptyLabel?: ReactNode;
  showEmptyState?: boolean;
  pageSize?: number;
  stateLabels?: ProgressStepLabels;
  onAction?: (actionId: string, stepId: string) => void;
};

const defaultStateLabels = {
  blocked: "Blocked",
  complete: "Complete",
  current: "Current",
  upcoming: "Upcoming",
} satisfies Record<ProgressStepState, string>;

const stateVariants = {
  blocked: "warning",
  complete: "success",
  current: "info",
  upcoming: "neutral",
} satisfies Record<ProgressStepState, BadgeVariant>;

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function matchesProgressStep(step: ProgressStep, query: string): boolean {
  return [step.label, step.state].join(" ").toLowerCase().includes(query);
}

export function ProgressSteps({
  className,
  emptyLabel = "Nothing to show",
  label = "Progress steps",
  onAction,
  pageSize,
  readOnly = false,
  showEmptyState = false,
  stateLabels,
  steps = [],
}: ProgressStepsProps) {
  const visibleSteps = getVisibleProgressSteps(steps);

  if (visibleSteps.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const mergedStateLabels = { ...defaultStateLabels, ...stateLabels };

  return (
    <ListView
      className={joinClasses("atlas-progress-steps", className)}
      getItemKey={(step) => step.id}
      items={visibleSteps}
      label={label}
      pageSize={pageSize}
      renderItem={(step) => {
        const actions = readOnly ? [] : getVisibleActions(step.actions);

        return (
          <div
            aria-current={step.state === "current" ? "step" : undefined}
            className={joinClasses("atlas-progress-step", `atlas-progress-step--${step.state}`)}
          >
            <span className="atlas-progress-step__marker" aria-hidden="true" />
            <div className="atlas-progress-step__body">
              <div className="atlas-progress-step__header">
                <span className="atlas-progress-step__label">{step.label}</span>
                <Badge dot variant={stateVariants[step.state]}>{mergedStateLabels[step.state]}</Badge>
              </div>
              {step.description ? (
                <div className="atlas-progress-step__description">{step.description}</div>
              ) : null}
            </div>
            {actions.length > 0 ? (
              <ActionMenu
                actions={actions}
                ariaLabel={`${step.label} actions`}
                onAction={(actionId) => onAction?.(actionId, step.id)}
              />
            ) : null}
          </div>
        );
      }}
      searchPredicate={matchesProgressStep}
    />
  );
}
