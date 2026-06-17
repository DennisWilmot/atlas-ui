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

export type LineBarChartSeries = {
  id: string;
  label: string;
  type: "line" | "bar";
  points: Metric[];
  hidden?: boolean;
  color?: string;
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

export type ActivityFeedItem = {
  id: string;
  summary?: ReactNode;
  description?: ReactNode;
  source?: ReactNode;
  timestamp?: ReactNode;
  fields?: Field[];
  actions?: Action[];
  hidden?: boolean;
  marker?: ReactNode;
  searchText?: string;
};

export type Row = Record<string, unknown>;

export type RadarChartAxis<T extends Row = Row> = Pick<Field, "key" | "label"> & {
  key: Extract<keyof T, string> | string;
  min?: number;
  max?: number;
  hidden?: boolean;
};

export type PieChartSegment = Metric & {
  id: string;
  color?: string;
};

export type CalendarDateValue = string | number | Date;

export type CalendarEvent = {
  id: string;
  label: string;
  start: CalendarDateValue;
  end?: CalendarDateValue;
  allDay?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  description?: ReactNode;
};

export type SelectItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type FileUploadItem = {
  id: string;
  name: string;
  size?: number;
  type?: string;
  status?: ReactNode;
  description?: ReactNode;
  progress?: number;
  actions?: Action[];
  hidden?: boolean;
};

export type BreadcrumbItem = {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
};

export type SidebarNavigationItem = Action & {
  href?: string;
  current?: boolean;
  description?: ReactNode;
  meta?: ReactNode;
  children?: SidebarNavigationItem[];
  actions?: Action[];
};

export type Filter = {
  id: string;
  label: string;
  items: SelectItem[];
  value?: string;
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
};

export type OverlayMode = "modal" | "sheet" | "drawer";

export type TableColumn<T extends Row = Row> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export type HealthStatus = "healthy" | "degraded" | "pending";

export type HealthItem = {
  id: string;
  label: string;
  status: HealthStatus;
  description?: ReactNode;
  actions?: Action[];
  hidden?: boolean;
};

export type ProgressStepState = "complete" | "current" | "upcoming" | "blocked";

export type ProgressStep = {
  id: string;
  label: string;
  state: ProgressStepState;
  description?: ReactNode;
  actions?: Action[];
  hidden?: boolean;
};

export type ToastTone = "neutral" | "success" | "warning" | "danger" | "info";

export type Toast = {
  id?: string;
  title?: ReactNode;
  message?: ReactNode;
  tone?: ToastTone;
  actions?: Action[];
  hidden?: boolean;
};
