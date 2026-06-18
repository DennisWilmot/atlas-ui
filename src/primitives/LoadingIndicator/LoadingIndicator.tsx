import type { HTMLAttributes, ReactNode } from "react";

export type LoadingIndicatorVariant = "spinner" | "skeleton";

export type LoadingIndicatorSize = "xs" | "sm" | "md" | "lg";

export type LoadingIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  variant?: LoadingIndicatorVariant;
  size?: LoadingIndicatorSize;
  label?: ReactNode;
  hideLabelVisually?: boolean;
  active?: boolean;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * An accessible loading indicator.
 *
 * - "spinner": for active waiting states (an action in progress).
 * - "skeleton": for initial loading only (placeholder for content not yet
 *   rendered).
 *
 * Renders a `role="status"` live region so the `label` is announced. The
 * animated visual is decorative (`aria-hidden`). Returns `null` when `active`
 * is false. It holds no loading copy of its own; supply the wording via `label`.
 */
export function LoadingIndicator({
  variant = "spinner",
  size = "md",
  label,
  hideLabelVisually = false,
  active = true,
  className,
  ...props
}: LoadingIndicatorProps) {
  // Nothing is loading, so nothing renders.
  if (!active) return null;

  const hasLabel = label != null && label !== "";

  return (
    <div
      className={joinClasses(
        "atlas-loading",
        `atlas-loading--${variant}`,
        `atlas-loading--${size}`,
        className,
      )}
      role="status"
      {...props}
    >
      <span
        className={variant === "skeleton" ? "atlas-loading__skeleton" : "atlas-loading__spinner"}
        aria-hidden="true"
      />
      {hasLabel ? (
        <span
          className={joinClasses("atlas-loading__label", hideLabelVisually && "atlas-visually-hidden")}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
