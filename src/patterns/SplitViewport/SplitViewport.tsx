import type { ReactNode } from "react";

export type SplitViewportSlot = {
  id: string;
  content: ReactNode;
  label?: ReactNode;
  hidden?: boolean;
  predictionScore?: number;
};

export type SplitViewportProps = {
  slots?: SplitViewportSlot[];
  primarySlotId?: string;
  label?: string;
  className?: string;
  showEmptyState?: boolean;
  emptyLabel?: ReactNode;
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

function getPredictionScore(slot: SplitViewportSlot): number {
  const score = slot.predictionScore;
  return typeof score === "number" && Number.isFinite(score) ? score : 0;
}

function getVisibleSlots(slots: SplitViewportSlot[]): SplitViewportSlot[] {
  return slots.filter((slot) => !slot.hidden && isMeaningfulNode(slot.content));
}

function getPredictedPrimarySlot(
  slots: SplitViewportSlot[],
  primarySlotId?: string,
): SplitViewportSlot | undefined {
  const requestedSlot = primarySlotId ? slots.find((slot) => slot.id === primarySlotId) : undefined;
  if (requestedSlot) return requestedSlot;

  return [...slots].sort((a, b) => getPredictionScore(b) - getPredictionScore(a))[0];
}

function renderSlot(slot: SplitViewportSlot, className: string) {
  return (
    <div className={className} data-slot-id={slot.id} key={slot.id}>
      {slot.label ? <div className="atlas-split-viewport__slot-label">{slot.label}</div> : null}
      <div className="atlas-split-viewport__slot-content">{slot.content}</div>
    </div>
  );
}

export function SplitViewport({
  className,
  emptyLabel = "Nothing to show",
  label = "Split viewport",
  primarySlotId,
  showEmptyState = false,
  slots = [],
}: SplitViewportProps) {
  const visibleSlots = getVisibleSlots(slots);

  if (visibleSlots.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const primarySlot = getPredictedPrimarySlot(visibleSlots, primarySlotId);
  if (!primarySlot) return null;

  const secondarySlots = visibleSlots.filter((slot) => slot.id !== primarySlot.id);

  return (
    <section
      className={joinClasses(
        "atlas-split-viewport",
        secondarySlots.length === 0 && "atlas-split-viewport--single",
        className,
      )}
      aria-label={label}
    >
      {renderSlot(primarySlot, "atlas-split-viewport__primary")}
      {secondarySlots.length > 0 ? (
        <div className="atlas-split-viewport__secondary">
          {secondarySlots.map((slot) =>
            renderSlot(slot, "atlas-split-viewport__secondary-slot"),
          )}
        </div>
      ) : null}
    </section>
  );
}
