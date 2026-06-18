import type { CSSProperties, HTMLAttributes } from "react";
import { Avatar, type AvatarSize } from "../Avatar";

export type AvatarGroupItem = {
  id: string;
  label: string;
  imageSrc?: string;
  initials?: string;
};

export type AvatarGroupProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  items: AvatarGroupItem[];
  maxVisible?: number;
  size?: AvatarSize;
  /**
   * Color of the cut-out ring between stacked avatars. Set this to the surface
   * the group sits on so the gap reads on any background. Defaults to the page
   * background token.
   */
  ringColor?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function AvatarGroup({
  items,
  maxVisible = 5,
  size = "md",
  ringColor,
  className,
  style,
  ...props
}: AvatarGroupProps) {
  // URA Law 4: no items, nothing meaningful to show, render nothing.
  if (!items.length) return null;

  const limit = Math.max(0, maxVisible);
  const visible = items.slice(0, limit);
  const overflowCount = items.length - visible.length;

  const rootStyle: CSSProperties | undefined = ringColor
    ? { ...style, ["--atlas-avatar-group-ring" as string]: ringColor }
    : style;

  return (
    <span
      className={joinClasses("atlas-avatar-group", `atlas-avatar-group--${size}`, className)}
      style={rootStyle}
      {...props}
    >
      {visible.map((item, index) => (
        // Each next avatar sits above the previous one.
        <span key={item.id} className="atlas-avatar-group__item" style={{ zIndex: index + 1 }}>
          <Avatar size={size} src={item.imageSrc} initials={item.initials} alt={item.label} />
        </span>
      ))}
      {overflowCount > 0 ? (
        <span className="atlas-avatar-group__item" style={{ zIndex: visible.length + 1 }}>
          <span
            className={joinClasses("atlas-avatar-group__overflow", `atlas-avatar--${size}`)}
            role="img"
            aria-label={`${overflowCount} more`}
          >
            +{overflowCount}
          </span>
        </span>
      ) : null}
    </span>
  );
}
