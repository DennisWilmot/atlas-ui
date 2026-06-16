import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: ReactNode;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Badge({
  children,
  className,
  dot = false,
  icon,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span className={joinClasses("atlas-badge", `atlas-badge--${variant}`, className)} {...props}>
      {dot ? <span className="atlas-badge__dot" aria-hidden="true" /> : null}
      {icon ? <span className="atlas-badge__icon">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}
