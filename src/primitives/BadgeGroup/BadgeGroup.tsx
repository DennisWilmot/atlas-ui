import type { HTMLAttributes, ReactNode } from "react";
import { Badge, type BadgeVariant } from "../Badge";

export type BadgeGroupItem = {
  id: string;
  label: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: ReactNode;
};

export type BadgeGroupProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  items: BadgeGroupItem[];
  maxVisible?: number;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function BadgeGroup({ items, maxVisible, className, ...props }: BadgeGroupProps) {
  const limit = maxVisible === undefined ? items.length : Math.max(0, maxVisible);
  const visible = items.slice(0, limit);

  // URA Law 4: nothing meaningful renders when there are no visible badges.
  if (!visible.length) return null;

  const overflowCount = items.length - visible.length;

  return (
    <span className={joinClasses("atlas-badge-group", className)} {...props}>
      {visible.map((item) => (
        <Badge key={item.id} variant={item.variant} dot={item.dot} icon={item.icon}>
          {item.label}
        </Badge>
      ))}
      {overflowCount > 0 ? (
        <Badge className="atlas-badge-group__overflow" aria-label={`${overflowCount} more`}>
          +{overflowCount}
        </Badge>
      ) : null}
    </span>
  );
}
