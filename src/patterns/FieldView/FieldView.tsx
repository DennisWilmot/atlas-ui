import type { ReactNode } from "react";
import { Badge } from "../../primitives";
import type { Field } from "../../types";

export type FieldViewProps = {
  fields?: Field[];
  className?: string;
  emptyLabel?: ReactNode;
  label?: string;
  showEmptyState?: boolean;
};

type FieldShape = NonNullable<Field["shape"]>;

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  style: "currency",
});

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

function isMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.some(isMeaningfulValue);
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function normalizeValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleDateString(undefined, DATE_OPTIONS);
  if (Array.isArray(value)) return value.filter(isMeaningfulValue).map(normalizeValue).join(", ");
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") return JSON.stringify(value);
  return "";
}

function isMeaningfulField(field: Field): boolean {
  if (field.shape !== "avatar") return isMeaningfulValue(field.value);

  if (typeof field.value === "string") return field.value.trim().length > 0;
  if (
    field.value &&
    typeof field.value === "object" &&
    "src" in field.value &&
    typeof field.value.src === "string"
  ) {
    return field.value.src.trim().length > 0;
  }

  return false;
}

function inferStatusVariant(value: string): "success" | "warning" | "danger" | "info" | "neutral" {
  const normalized = value.trim().toLowerCase();

  if (["active", "ok", "success", "ready", "online", "connected", "done"].includes(normalized)) {
    return "success";
  }

  if (["warn", "warning", "pending", "queued", "blocked", "caution", "attention"].includes(normalized)) {
    return "warning";
  }

  if (["bad", "danger", "error", "failed", "offline", "disconnected", "stalled", "invalid"].includes(normalized)) {
    return "danger";
  }

  if (["info", "note", "draft", "upcoming"].includes(normalized)) {
    return "info";
  }

  return "neutral";
}

function renderFieldValue(field: Field): ReactNode {
  const shape: FieldShape = field.shape ?? "text";
  const rawValue = field.value;

  if (shape === "avatar") {
    if (typeof rawValue === "string") {
      return <img alt={field.label} className="atlas-field-view__avatar" src={rawValue} />;
    }
    if (
      rawValue &&
      typeof rawValue === "object" &&
      "src" in rawValue &&
      typeof rawValue.src === "string"
    ) {
      const avatarLabel = normalizeValue((rawValue as { label?: string }).label ?? field.label);
      return <img alt={avatarLabel} className="atlas-field-view__avatar" src={rawValue.src} />;
    }

    return <span className="atlas-field-view__avatar" aria-hidden="true" />;
  }

  if (shape === "badge") {
    const label = normalizeValue(rawValue);
    return <Badge variant="info">{label}</Badge>;
  }

  if (shape === "status") {
    const status = normalizeValue(rawValue);
    return <Badge variant={inferStatusVariant(status)}>{status}</Badge>;
  }

  if (shape === "currency") {
    if (typeof rawValue === "number" || typeof rawValue === "string") {
      const amount = Number(rawValue);
      if (Number.isFinite(amount)) {
        return CURRENCY_FORMATTER.format(amount);
      }
    }
    return normalizeValue(rawValue);
  }

  if (shape === "number") {
    if (typeof rawValue === "number") {
      return rawValue.toLocaleString();
    }
    if (typeof rawValue === "string") {
      const asNumber = Number(rawValue);
      return Number.isFinite(asNumber) ? asNumber.toLocaleString() : rawValue;
    }
  }

  if (shape === "date") {
    if (typeof rawValue === "string" || rawValue instanceof Date || typeof rawValue === "number") {
      const date = new Date(rawValue);
      return Number.isNaN(date.getTime()) ? normalizeValue(rawValue) : date.toLocaleDateString(undefined, DATE_OPTIONS);
    }
  }

  return normalizeValue(rawValue);
}

export function FieldView({
  className,
  emptyLabel = "Nothing to show",
  fields = [],
  label = "Field list",
  showEmptyState = false,
}: FieldViewProps) {
  const visibleFields = fields.filter(isMeaningfulField);

  if (visibleFields.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  return (
    <section className={className ? `atlas-field-view ${className}` : "atlas-field-view"} aria-label={label}>
      <dl className="atlas-field-view__list">
        {visibleFields.map((field) => (
          <div className="atlas-field-view__item" key={field.key}>
            <dt className="atlas-field-view__label">{field.label}</dt>
            <dd className="atlas-field-view__value">{renderFieldValue(field)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
