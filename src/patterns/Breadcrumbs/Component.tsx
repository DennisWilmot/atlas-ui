import type { MouseEvent, ReactNode } from "react";
import type { BreadcrumbItem } from "../../types";

export type BreadcrumbsProps = {
  items?: BreadcrumbItem[];
  ariaLabel?: string;
  className?: string;
  separator?: ReactNode;
  onNavigate?: (itemId: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getVisibleBreadcrumbItems(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return items.reduce<BreadcrumbItem[]>((visibleItems, item) => {
    const label = item.label.trim();
    if (item.hidden || label.length === 0) return visibleItems;

    visibleItems.push({ ...item, label });
    return visibleItems;
  }, []);
}

function getCurrentItemId(items: BreadcrumbItem[]): string | undefined {
  return items.find((item) => item.current)?.id ?? items.at(-1)?.id;
}

export function Breadcrumbs({
  ariaLabel = "Breadcrumb",
  className,
  items = [],
  onNavigate,
  separator = "/",
}: BreadcrumbsProps) {
  const visibleItems = getVisibleBreadcrumbItems(items);

  if (visibleItems.length < 2) return null;

  const currentItemId = getCurrentItemId(visibleItems);

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    item: BreadcrumbItem,
  ) => {
    if (item.disabled || item.id === currentItemId) {
      event.preventDefault();
      return;
    }

    onNavigate?.(item.id);
  };

  return (
    <nav className={joinClasses("atlas-breadcrumbs", className)} aria-label={ariaLabel}>
      <ol className="atlas-breadcrumbs__list">
        {visibleItems.map((item, index) => {
          const isCurrent = item.id === currentItemId;
          const isDisabled = item.disabled || isCurrent;
          const content = (
            <>
              {item.icon ? <span className="atlas-breadcrumbs__icon">{item.icon}</span> : null}
              <span>{item.label}</span>
            </>
          );

          return (
            <li className="atlas-breadcrumbs__item" key={item.id}>
              {index > 0 ? (
                <span className="atlas-breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
              {isCurrent || isDisabled ? (
                <span
                  className={joinClasses(
                    "atlas-breadcrumbs__link",
                    isCurrent && "atlas-breadcrumbs__link--current",
                    item.disabled && "atlas-breadcrumbs__link--disabled",
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                  aria-disabled={item.disabled && !isCurrent ? true : undefined}
                >
                  {content}
                </span>
              ) : item.href ? (
                <a
                  className="atlas-breadcrumbs__link"
                  href={item.href}
                  onClick={(event) => handleNavigate(event, item)}
                >
                  {content}
                </a>
              ) : (
                <button
                  className="atlas-breadcrumbs__link atlas-breadcrumbs__link--button"
                  onClick={(event) => handleNavigate(event, item)}
                  type="button"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
