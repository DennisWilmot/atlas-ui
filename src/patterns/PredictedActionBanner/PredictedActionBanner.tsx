import type { ReactNode } from "react";
import type { FordScoredItem, FordWeights } from "../../headless";
import { fordScore } from "../../headless";
import type { Action } from "../../types";
import { ActionMenu } from "../ActionMenu";

export type PredictedAction = FordScoredItem<Action> & {
  pending?: boolean;
};

export type PredictedActionBannerProps = {
  actions?: PredictedAction[];
  ariaLabel?: string;
  className?: string;
  description?: ReactNode;
  label?: ReactNode;
  maxActions?: number;
  onAction?: (actionId: string) => void;
  weights?: FordWeights;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function hasPrediction(entry: PredictedAction, weights: FordWeights): boolean {
  return Boolean(entry.pending) || fordScore(entry, weights) > 0;
}

function getActionLimit(maxActions: number | undefined, fallback: number): number {
  if (maxActions === undefined) return fallback;
  if (!Number.isFinite(maxActions)) return fallback;
  return Math.max(0, Math.floor(maxActions));
}

function isRenderableNode(node: ReactNode): boolean {
  return node !== null && node !== undefined && node !== false && node !== "";
}

export function PredictedActionBanner({
  actions = [],
  ariaLabel = "Predicted actions",
  className,
  description,
  label,
  maxActions = 3,
  onAction,
  weights = {},
}: PredictedActionBannerProps) {
  const visiblePredictions = actions
    .filter((entry) => !entry.item.hidden && hasPrediction(entry, weights))
    .sort((a, b) => {
      const scoreDelta = fordScore(b, weights) - fordScore(a, weights);
      if (scoreDelta !== 0) return scoreDelta;
      if (a.pending !== b.pending) return a.pending ? -1 : 1;
      return 0;
    });
  const rankedActions = visiblePredictions
    .slice(0, getActionLimit(maxActions, visiblePredictions.length))
    .map((entry) => entry.item);
  const hasLabel = isRenderableNode(label);
  const hasDescription = isRenderableNode(description);

  if (rankedActions.length === 0) return null;

  return (
    <section
      aria-label={ariaLabel}
      className={joinClasses("atlas-predicted-action-banner", className)}
    >
      {hasLabel || hasDescription ? (
        <div className="atlas-predicted-action-banner__content">
          {hasLabel ? <div className="atlas-predicted-action-banner__label">{label}</div> : null}
          {hasDescription ? (
            <div className="atlas-predicted-action-banner__description">{description}</div>
          ) : null}
        </div>
      ) : null}
      <ActionMenu actions={rankedActions} ariaLabel={ariaLabel} onAction={onAction} />
    </section>
  );
}
