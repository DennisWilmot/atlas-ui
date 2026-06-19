import { useId } from "react";
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
  decorative,
  hidden = false,
  className,
  ...props
}: DividerProps) {
  if (hidden) return null;

  const labelId = useId();
  // Labels only apply to horizontal dividers.
  const hasLabel = orientation === "horizontal" && label != null && label !== "";
  const isDecorative = decorative ?? !hasLabel;

  // Unlabeled dividers are visual by default. Labeled or explicitly semantic
  // dividers expose separator semantics and keep visible label text accessible.
  const semantics =
    isDecorative && !hasLabel
      ? { "aria-hidden": true as const }
      : {
          role: "separator" as const,
          "aria-orientation": orientation,
          ...(hasLabel ? { "aria-labelledby": labelId } : {}),
        };

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
      {hasLabel ? (
        <span className="atlas-divider__label" id={labelId}>
          {label}
        </span>
      ) : null}
    </div>
  );
}
