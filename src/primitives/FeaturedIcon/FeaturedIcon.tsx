import type { HTMLAttributes, ReactNode } from "react";

export type FeaturedIconSize = "sm" | "md" | "lg" | "xl";

export type FeaturedIconTone = "neutral" | "info" | "success" | "warning" | "danger";

export type FeaturedIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  icon: ReactNode;
  size?: FeaturedIconSize;
  tone?: FeaturedIconTone;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function FeaturedIcon({
  icon,
  size = "md",
  tone = "neutral",
  className,
  ...props
}: FeaturedIconProps) {
  return (
    <span
      className={joinClasses(
        "atlas-featured-icon",
        `atlas-featured-icon--${size}`,
        `atlas-featured-icon--${tone}`,
        className,
      )}
      // Decorative by default: the icon carries no meaning of its own, so it is
      // hidden from assistive tech. Callers may override via props if needed.
      aria-hidden="true"
      {...props}
    >
      {icon}
    </span>
  );
}
