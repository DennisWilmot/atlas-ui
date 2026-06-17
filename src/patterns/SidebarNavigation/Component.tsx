import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { Action, SidebarNavigationItem } from "../../types";
import { getVisibleActions, shouldUseSearchableList } from "../../headless";
import { ActionMenu } from "../ActionMenu";

export type SidebarNavigationProps = {
  items?: SidebarNavigationItem[];
  ariaLabel?: string;
  searchLabel?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  pageSize?: number;
  showEmptyState?: boolean;
  emptyLabel?: ReactNode;
  onNavigate?: (itemId: string) => void;
  onAction?: (itemId: string, actionId: string) => void;
};

type SidebarNavigationEntry = SidebarNavigationItem & {
  depth: number;
};

const DEFAULT_PAGE_SIZE = 20;

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getVisibleNavigationItems(items: SidebarNavigationItem[] = []): SidebarNavigationItem[] {
  return items.reduce<SidebarNavigationItem[]>((visibleItems, item) => {
    const label = item.label.trim();
    if (item.hidden || label.length === 0) return visibleItems;

    visibleItems.push({
      ...item,
      label,
      children: getVisibleNavigationItems(item.children),
    });

    return visibleItems;
  }, []);
}

function countNavigationItems(items: SidebarNavigationItem[]): number {
  return items.reduce((count, item) => count + 1 + countNavigationItems(item.children ?? []), 0);
}

function flattenNavigationItems(items: SidebarNavigationItem[], depth = 0): SidebarNavigationEntry[] {
  return items.flatMap((item) => [
    {
      ...item,
      depth,
    },
    ...flattenNavigationItems(item.children ?? [], depth + 1),
  ]);
}

function getMatchingNavigationItems(
  items: SidebarNavigationItem[],
  query: string,
): SidebarNavigationItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.reduce<SidebarNavigationItem[]>((matchingItems, item) => {
    const matchingChildren = getMatchingNavigationItems(item.children ?? [], normalizedQuery);
    const selfMatches =
      item.label.toLowerCase().includes(normalizedQuery) ||
      (typeof item.description === "string" && item.description.toLowerCase().includes(normalizedQuery));

    if (selfMatches || matchingChildren.length > 0) {
      matchingItems.push({
        ...item,
        children: matchingChildren,
      });
    }

    return matchingItems;
  }, []);
}

function getInteractiveActions(actions: Action[] | undefined, disabled: boolean): Action[] {
  if (!actions || actions.length === 0) return [];

  return disabled ? actions.map((action) => ({ ...action, disabled: true })) : actions;
}

function getSafePageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize < 1) return DEFAULT_PAGE_SIZE;
  return Math.floor(pageSize);
}

export function SidebarNavigation({
  ariaLabel = "Navigation",
  className,
  disabled = false,
  emptyLabel = "Nothing to show",
  items = [],
  onAction,
  onNavigate,
  pageSize = 20,
  readOnly = false,
  searchLabel,
  showEmptyState = false,
}: SidebarNavigationProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const visibleItems = useMemo(() => getVisibleNavigationItems(items), [items]);
  const visibleItemCount = useMemo(() => countNavigationItems(visibleItems), [visibleItems]);
  const searchable = shouldUseSearchableList(visibleItemCount);
  const safePageSize = getSafePageSize(pageSize);

  const filteredItems = useMemo(() => {
    if (!searchable) return visibleItems;
    return getMatchingNavigationItems(visibleItems, query);
  }, [query, searchable, visibleItems]);
  const filteredEntries = useMemo(() => flattenNavigationItems(filteredItems), [filteredItems]);

  if (visibleItemCount === 0) {
    if (!showEmptyState) return null;
    return (
      <div className="atlas-empty" role="status">
        {emptyLabel}
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / safePageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * safePageSize : 0;
  const pageItems = searchable ? filteredEntries.slice(start, start + safePageSize) : filteredEntries;
  const resolvedSearchLabel = searchLabel ?? `${ariaLabel} search`;

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    item: SidebarNavigationItem,
  ) => {
    if (disabled || readOnly || item.disabled) {
      event.preventDefault();
      return;
    }

    onNavigate?.(item.id);
  };

  const renderItem = (item: SidebarNavigationEntry): ReactNode => {
    const itemDisabled = disabled || readOnly || item.disabled;
    const itemActions = readOnly ? [] : getInteractiveActions(item.actions, disabled || item.disabled === true);
    const visibleActions = getVisibleActions(itemActions);
    const content = (
      <>
        {item.icon ? <span className="atlas-button__icon">{item.icon}</span> : null}
        <span className="atlas-sidebar-navigation__content">
          <span className="atlas-sidebar-navigation__label">{item.label}</span>
          {item.description ? (
            <span className="atlas-sidebar-navigation__description">{item.description}</span>
          ) : null}
        </span>
        {item.meta ? <span className="atlas-sidebar-navigation__meta">{item.meta}</span> : null}
      </>
    );

    return (
      <li className="atlas-sidebar-navigation__item" key={item.id}>
        <div
          className={joinClasses(
            "atlas-sidebar-navigation__row",
            item.current && "atlas-sidebar-navigation__row--current",
          )}
          style={{ "--atlas-sidebar-navigation-depth": item.depth } as CSSProperties}
        >
          {item.href && !itemDisabled ? (
            <a
              aria-current={item.current ? "page" : undefined}
              className="atlas-sidebar-navigation__link"
              href={item.href}
              onClick={(event) => handleNavigate(event, item)}
            >
              {content}
            </a>
          ) : (
            <button
              aria-current={item.current ? "page" : undefined}
              className="atlas-sidebar-navigation__link"
              disabled={itemDisabled}
              onClick={(event) => handleNavigate(event, item)}
              type="button"
            >
              {content}
            </button>
          )}
          {visibleActions.length > 0 ? (
            <ActionMenu
              actions={visibleActions}
              ariaLabel={`${item.label} actions`}
              onAction={(actionId) => onAction?.(item.id, actionId)}
            />
          ) : null}
        </div>
      </li>
    );
  };

  const renderItems = (navigationItems: SidebarNavigationEntry[]): ReactNode => (
    <ul className="atlas-sidebar-navigation__list">
      {navigationItems.map((item) => renderItem(item))}
    </ul>
  );

  return (
    <nav className={joinClasses("atlas-sidebar-navigation", className)} aria-label={ariaLabel}>
      {searchable ? (
        <label className="atlas-field">
          <span className="atlas-field__label">{resolvedSearchLabel}</span>
          <input
            className="atlas-field__control"
            disabled={disabled}
            onChange={(event) => {
              setPage(0);
              setQuery(event.target.value);
            }}
            type="search"
            value={query}
          />
        </label>
      ) : null}
      {pageItems.length > 0 ? (
        renderItems(pageItems)
      ) : (
        <div className="atlas-empty" role="status">
          Nothing matches
        </div>
      )}
      {searchable && pageCount > 1 ? (
        <div className="atlas-pagination" aria-label={`${ariaLabel} pagination`}>
          <button
            className="atlas-action-menu__item"
            disabled={safePage === 0 || disabled}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            type="button"
          >
            Previous
          </button>
          <span>
            {safePage + 1} / {pageCount}
          </span>
          <button
            className="atlas-action-menu__item"
            disabled={safePage >= pageCount - 1 || disabled}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      ) : null}
    </nav>
  );
}
