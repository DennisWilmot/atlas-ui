import type { Key, ReactNode } from "react";
import { useMemo, useState } from "react";
import { getVisibleActions, shouldUseSearchableList } from "../../headless";
import type { Action, Field } from "../../types";
import { ActionMenu } from "../ActionMenu";
import { FieldView } from "../FieldView";

export type MessageListItem = {
  id: Key;
  title?: ReactNode;
  body?: ReactNode;
  source?: ReactNode;
  timestamp?: ReactNode;
  metadata?: Field[];
  actions?: Action[];
  hidden?: boolean;
  searchText?: string;
};

export type MessageListViewProps = {
  messages?: MessageListItem[];
  label?: string;
  className?: string;
  emptyLabel?: ReactNode;
  pageSize?: number;
  readOnly?: boolean;
  showEmptyState?: boolean;
  searchPredicate?: (message: MessageListItem, query: string) => boolean;
  onAction?: (actionId: string, message: MessageListItem) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function hasMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function hasMeaningfulNode(node: ReactNode): boolean {
  if (node === null || node === undefined) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return !Number.isNaN(node);
  if (typeof node === "boolean") return node;
  if (Array.isArray(node)) return node.some(hasMeaningfulNode);
  return true;
}

function getMeaningfulFields(fields: Field[] = []): Field[] {
  return fields.filter((field) => hasMeaningfulValue(field.value));
}

function isMeaningfulMessage(message: MessageListItem): boolean {
  if (message.hidden) return false;

  return (
    hasMeaningfulNode(message.title) ||
    hasMeaningfulNode(message.body) ||
    hasMeaningfulNode(message.source) ||
    hasMeaningfulNode(message.timestamp) ||
    getMeaningfulFields(message.metadata).length > 0
  );
}

function valueToSearchText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  if (Array.isArray(value)) return value.map(valueToSearchText).filter(Boolean).join(" ");
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function nodeToSearchText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToSearchText).filter(Boolean).join(" ");
  return "";
}

function getMessageSearchText(message: MessageListItem): string {
  const fieldText = getMeaningfulFields(message.metadata)
    .map((field) => `${field.label} ${valueToSearchText(field.value)}`)
    .join(" ");

  return [
    message.searchText,
    nodeToSearchText(message.title),
    nodeToSearchText(message.body),
    nodeToSearchText(message.source),
    nodeToSearchText(message.timestamp),
    fieldText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function defaultSearchPredicate(message: MessageListItem, query: string): boolean {
  return getMessageSearchText(message).includes(query);
}

function getMessageLabel(message: MessageListItem, index: number): string {
  const title = nodeToSearchText(message.title).trim();
  if (title) return title;

  return `Message ${index + 1}`;
}

export function MessageListView({
  className,
  emptyLabel = "Nothing to show",
  label = "Messages",
  messages = [],
  onAction,
  pageSize = 20,
  readOnly = false,
  searchPredicate = defaultSearchPredicate,
  showEmptyState = false,
}: MessageListViewProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const visibleMessages = useMemo(() => messages.filter(isMeaningfulMessage), [messages]);
  const searchable = shouldUseSearchableList(visibleMessages.length);

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return visibleMessages;

    return visibleMessages.filter((message) => searchPredicate(message, normalizedQuery));
  }, [query, searchable, searchPredicate, visibleMessages]);

  if (visibleMessages.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const safePageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(filteredMessages.length / safePageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * safePageSize : 0;
  const renderedMessages = searchable
    ? filteredMessages.slice(start, start + safePageSize)
    : filteredMessages;

  return (
    <section className={joinClasses("atlas-message-list-view", className)} aria-label={label}>
      {searchable ? (
        <label className="atlas-field">
          <span className="atlas-field__label">{label} search</span>
          <input
            className="atlas-field__control"
            onChange={(event) => {
              setPage(0);
              setQuery(event.target.value);
            }}
            type="search"
            value={query}
          />
        </label>
      ) : null}
      {renderedMessages.length > 0 ? (
        <ul className="atlas-message-list-view__items" aria-label={label}>
          {renderedMessages.map((message, index) => {
            const messageLabel = getMessageLabel(message, index);
            const metadata = getMeaningfulFields(message.metadata);
            const actions = readOnly ? [] : getVisibleActions(message.actions);
            const hasHeader = hasMeaningfulNode(message.source) || hasMeaningfulNode(message.timestamp);

            return (
              <li className="atlas-message-list-view__item" key={message.id}>
                <article className="atlas-message-list-view__message" aria-label={messageLabel}>
                  <div className="atlas-message-list-view__content">
                    {hasHeader ? (
                      <div className="atlas-message-list-view__header">
                        {hasMeaningfulNode(message.source) ? (
                          <span className="atlas-message-list-view__source">{message.source}</span>
                        ) : null}
                        {hasMeaningfulNode(message.timestamp) ? (
                          <span className="atlas-message-list-view__timestamp">{message.timestamp}</span>
                        ) : null}
                      </div>
                    ) : null}
                    {hasMeaningfulNode(message.title) ? (
                      <div className="atlas-message-list-view__title">{message.title}</div>
                    ) : null}
                    {hasMeaningfulNode(message.body) ? (
                      <div className="atlas-message-list-view__body">{message.body}</div>
                    ) : null}
                    {metadata.length > 0 ? (
                      <FieldView
                        className="atlas-message-list-view__fields"
                        fields={metadata}
                        label={`${messageLabel} metadata`}
                      />
                    ) : null}
                  </div>
                  {actions.length > 0 ? (
                    <ActionMenu
                      actions={actions}
                      ariaLabel={`${messageLabel} actions`}
                      onAction={(actionId) => onAction?.(actionId, message)}
                    />
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="atlas-empty" role="status">Nothing matches</div>
      )}
      {searchable && pageCount > 1 ? (
        <div className="atlas-pagination" aria-label={`${label} pagination`}>
          <button
            className="atlas-action-menu__item"
            disabled={safePage === 0}
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
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
