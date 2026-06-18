import type { HTMLAttributes, ReactNode } from "react";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerLabelPosition = "start" | "center" | "end";

export type DividerSpacing = "none" | "sm" | "md" | "lg";

export type DividerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  orientation?: DividerOrientation;
  label?: ReactNode;
  labelPosition?: DividerLabelPosition;
  spacing?: DividerSpacing;
  decorative?: boolean;
  hidden?: boolean;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Divider({
  orientation = "horizontal",
  label,
  labelPosition = "center",
  spacing = "md",
  decorative = false,
  hidden = false,
  className,
  ...props
}: DividerProps) {
  if (hidden) return null;

  // Labels only apply to horizontal dividers.
  const hasLabel = orientation === "horizontal" && label != null && label !== "";

  // Decorative dividers are purely visual; semantic ones expose separator role.
  const semantics = decorative
    ? { "aria-hidden": true as const }
    : { role: "separator" as const, "aria-orientation": orientation };

  return (
    <div
      className={joinClasses(
        "atlas-divider",
        `atlas-divider--${orientation}`,
        `atlas-divider--spacing-${spacing}`,
        hasLabel && "atlas-divider--has-label",
        hasLabel && `atlas-divider--label-${labelPosition}`,
        className,
      )}
      {...semantics}
      {...props}
    >
      {hasLabel ? <span className="atlas-divider__label">{label}</span> : null}
    </div>
  );
}
