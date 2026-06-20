import type { HTMLAttributes, ReactNode } from "react";

export type TagSize = "sm" | "md" | "lg";

export type TagTone = "neutral" | "info" | "success" | "warning" | "danger";

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  size?: TagSize;
  tone?: TagTone;
  icon?: ReactNode;
  avatar?: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Tag({
  children,
  size = "md",
  tone = "neutral",
  icon,
  avatar,
  onRemove,
  removeLabel,
  className,
  ...props
}: TagProps) {
  // URA Law 4: no label/content, nothing meaningful to show, render nothing.
  if (children == null || children === "" || children === false) return null;

  // Name the remove button by the tag's content so it isn't an ambiguous
  // "Remove" repeated across many tags. Overridable via removeLabel.
  const removeButtonLabel =
    removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");

  return (
    <span
      className={joinClasses("atlas-tag", `atlas-tag--${size}`, `atlas-tag--${tone}`, className)}
      data-tone={tone}
      {...props}
    >
      {avatar ? <span className="atlas-tag__avatar">{avatar}</span> : null}
      {icon ? (
        <span className="atlas-tag__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="atlas-tag__label">{children}</span>
      {onRemove ? (
        <button type="button" className="atlas-tag__remove" aria-label={removeButtonLabel} onClick={onRemove}>
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </span>
  );
}
