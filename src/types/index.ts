import type { ReactNode } from "react";

export type Intent = "primary" | "secondary" | "danger";

export type Action = {
  id: string;
  label: string;
  intent?: Intent;
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
};

export type Metric = {
  id?: string;
  label: string;
  value: number | string | null | undefined;
  trend?: number;
  unit?: string;
  hidden?: boolean;
};

export type FieldShape =
  | "text"
  | "number"
  | "date"
  | "badge"
  | "status"
  | "avatar"
  | "currency";

export type Field = {
  key: string;
  label: string;
  value: unknown;
  shape?: FieldShape;
};

export type Row = Record<string, unknown>;

export type OverlayMode = "modal" | "sheet" | "drawer";

export type TableColumn<T extends Row = Row> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export type SelectItem = {
  id: string;
  label: string;
  disabled?: boolean;
};
