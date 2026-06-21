import { type ReactNode, useMemo, useState } from "react";
import type { Action, CalendarDateValue, CalendarEvent } from "../../types";
import { getVisibleActions, hasVisibleActions, shouldUseSearchableList } from "../../headless";
import { ActionMenu } from "../ActionMenu";

export type CalendarViewMode = "month" | "week" | "agenda";

export type CalendarViewProps = {
  events?: CalendarEvent[];
  actions?: Action[] | ((event: CalendarEvent) => Action[]);
  className?: string;
  emptyLabel?: ReactNode;
  label?: string;
  locale?: string;
  mode?: CalendarViewMode;
  pageSize?: number;
  readOnly?: boolean;
  showEmptyState?: boolean;
  title?: ReactNode;
  visibleDate?: CalendarDateValue;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onAction?: (actionId: string, event: CalendarEvent) => void;
  onEventSelect?: (eventId: string, event: CalendarEvent) => void;
};

type NormalizedEvent = {
  event: CalendarEvent;
  end: Date;
  searchText: string;
  start: Date;
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function isDateOnlyValue(value: CalendarDateValue | undefined): boolean {
  return typeof value === "string" && DATE_ONLY_PATTERN.test(value);
}

function toDate(value: CalendarDateValue | undefined): Date | null {
  if (value === undefined) return null;

  if (typeof value === "string" && DATE_ONLY_PATTERN.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date, weekStartsOn: NonNullable<CalendarViewProps["weekStartsOn"]>): Date {
  const start = startOfDay(date);
  const diff = (start.getDay() - weekStartsOn + 7) % 7;
  return addDays(start, -diff);
}

function endOfWeek(date: Date, weekStartsOn: NonNullable<CalendarViewProps["weekStartsOn"]>): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function buildDays(start: Date, end: Date): Date[] {
  const days: Date[] = [];

  for (let day = startOfDay(start); day <= end; day = addDays(day, 1)) {
    days.push(day);
  }

  return days;
}

function normalizeEvent(event: CalendarEvent): NormalizedEvent | null {
  if (event.hidden) return null;
  if (event.label.trim().length === 0) return null;

  const start = toDate(event.start);
  if (!start) return null;

  const parsedEnd = toDate(event.end);
  const end = parsedEnd && parsedEnd >= start ? parsedEnd : start;

  return {
    end,
    event,
    searchText: `${event.label} ${start.toDateString()} ${event.description ?? ""}`.toLowerCase(),
    start,
  };
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isInDay(event: NormalizedEvent, day: Date): boolean {
  const start = startOfDay(event.start);
  const end = startOfDay(event.end);
  return day >= start && day <= end;
}

function intersectsRange(event: NormalizedEvent, start: Date, end: Date): boolean {
  return startOfDay(event.end) >= startOfDay(start) && startOfDay(event.start) <= startOfDay(end);
}

function getRange(
  mode: CalendarViewMode,
  visibleDate: Date,
  weekStartsOn: NonNullable<CalendarViewProps["weekStartsOn"]>,
): { days: Date[]; end: Date; start: Date } {
  if (mode === "week") {
    const start = startOfWeek(visibleDate, weekStartsOn);
    const end = endOfWeek(visibleDate, weekStartsOn);
    return { days: buildDays(start, end), end, start };
  }

  if (mode === "agenda") {
    const start = startOfDay(visibleDate);
    const end = addDays(start, 30);
    return { days: buildDays(start, end), end, start };
  }

  const monthStart = startOfMonth(visibleDate);
  const monthEnd = endOfMonth(visibleDate);
  const start = startOfWeek(monthStart, weekStartsOn);
  const end = endOfWeek(monthEnd, weekStartsOn);
  return { days: buildDays(start, end), end, start };
}

function formatRangeTitle(
  mode: CalendarViewMode,
  anchorDate: Date,
  start: Date,
  end: Date,
  locale: string | undefined,
): string {
  if (mode === "month") {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(anchorDate);
  }

  const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function formatDayLabel(day: Date, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", weekday: "short" }).format(day);
}

function formatDayNumber(day: Date, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric" }).format(day);
}

function formatEventTime(event: CalendarEvent, start: Date, end: Date, locale: string | undefined): string {
  if (event.allDay || isDateOnlyValue(event.start)) return "All day";

  const formatter = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" });
  if (!event.end || isSameDay(start, end)) {
    return event.end ? `${formatter.format(start)} - ${formatter.format(end)}` : formatter.format(start);
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

function getEventActions(actions: CalendarViewProps["actions"], event: CalendarEvent): Action[] {
  if (!actions) return [];
  return typeof actions === "function" ? actions(event) : actions;
}

function getInteractiveEventActions(
  actions: CalendarViewProps["actions"],
  event: CalendarEvent,
  readOnly: boolean,
): Action[] {
  if (readOnly) return [];

  const visibleActions = getVisibleActions(getEventActions(actions, event));
  if (!event.disabled) return visibleActions;

  return visibleActions.map((action) => ({ ...action, disabled: true }));
}

export function CalendarView({
  actions,
  className,
  emptyLabel = "Nothing to show",
  events = [],
  label = "Calendar",
  locale,
  mode = "month",
  onAction,
  onEventSelect,
  pageSize = 20,
  readOnly = false,
  showEmptyState = false,
  title,
  visibleDate,
  weekStartsOn = 0,
}: CalendarViewProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const normalizedEvents = useMemo(
    () =>
      events
        .map(normalizeEvent)
        .filter((event): event is NormalizedEvent => Boolean(event))
        .sort((left, right) => left.start.getTime() - right.start.getTime()),
    [events],
  );
  const searchable = shouldUseSearchableList(normalizedEvents.length);
  const anchorDate = toDate(visibleDate) ?? normalizedEvents[0]?.start ?? null;

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return normalizedEvents;
    return normalizedEvents.filter((event) => event.searchText.includes(normalizedQuery));
  }, [normalizedEvents, query, searchable]);

  if (normalizedEvents.length === 0 || !anchorDate) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const range = getRange(mode, anchorDate, weekStartsOn);
  const rangedEvents = filteredEvents.filter((event) => intersectsRange(event, range.start, range.end));
  const hasNoRangeEvents = rangedEvents.length === 0 && (!searchable || query.trim().length === 0);

  if (hasNoRangeEvents) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const pageCount = Math.max(1, Math.ceil(rangedEvents.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * pageSize : 0;
  const visibleEvents = searchable ? rangedEvents.slice(start, start + pageSize) : rangedEvents;
  const visibleTitle = title ?? formatRangeTitle(mode, anchorDate, range.start, range.end, locale);
  const gridMode = mode === "month" || mode === "week";

  const renderEvent = (normalizedEvent: NormalizedEvent) => {
    const eventActions = getInteractiveEventActions(actions, normalizedEvent.event, readOnly);
    const hasActions = hasVisibleActions(eventActions);
    const eventContent = (
      <>
        <span className="atlas-calendar-view__event-time">
          {formatEventTime(normalizedEvent.event, normalizedEvent.start, normalizedEvent.end, locale)}
        </span>
        <span className="atlas-calendar-view__event-label">{normalizedEvent.event.label}</span>
      </>
    );

    return (
      <li className="atlas-calendar-view__event" key={normalizedEvent.event.id}>
        {onEventSelect && !readOnly ? (
          <button
            className="atlas-calendar-view__event-trigger"
            disabled={normalizedEvent.event.disabled}
            onClick={() => onEventSelect(normalizedEvent.event.id, normalizedEvent.event)}
            type="button"
          >
            {eventContent}
          </button>
        ) : (
          <span className="atlas-calendar-view__event-trigger">{eventContent}</span>
        )}
        {hasActions ? (
          <ActionMenu
            actions={eventActions}
            ariaLabel={`${normalizedEvent.event.label} actions`}
            onAction={(actionId) => onAction?.(actionId, normalizedEvent.event)}
          />
        ) : null}
      </li>
    );
  };

  return (
    <section className={joinClasses("atlas-calendar-view", className)} aria-label={label}>
      <header className="atlas-calendar-view__header">
        <h2 className="atlas-calendar-view__title">{visibleTitle}</h2>
      </header>
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
      {visibleEvents.length > 0 && gridMode ? (
        <div className={joinClasses("atlas-calendar-view__grid", `atlas-calendar-view__grid--${mode}`)}>
          {range.days.map((day) => {
            const dayEvents = visibleEvents.filter((event) => isInDay(event, day));

            return (
              <section className="atlas-calendar-view__day" key={day.toISOString()} aria-label={formatDayLabel(day, locale)}>
                <time className="atlas-calendar-view__day-label" dateTime={day.toISOString()}>
                  {formatDayNumber(day, locale)}
                </time>
                {dayEvents.length > 0 ? (
                  <ul className="atlas-calendar-view__events">{dayEvents.map(renderEvent)}</ul>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : null}
      {visibleEvents.length > 0 && mode === "agenda" ? (
        <ul className="atlas-calendar-view__agenda" aria-label={`${label} agenda`}>
          {visibleEvents.map(renderEvent)}
        </ul>
      ) : null}
      {visibleEvents.length === 0 ? <div className="atlas-empty" role="status">Nothing matches</div> : null}
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
