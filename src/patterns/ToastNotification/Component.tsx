import type { ReactNode } from "react";
import type { Toast, ToastTone } from "../../types";
import { getVisibleActions } from "../../headless";
import { ActionMenu } from "../ActionMenu";

export type ToastNotificationProps = {
  toast?: Toast | null;
  ariaLabel?: string;
  className?: string;
  dismissLabel?: string;
  readOnly?: boolean;
  role?: "status" | "alert";
  onAction?: (actionId: string, toast: Toast) => void;
  onDismiss?: (toast: Toast) => void;
};

const attentionTones = new Set<ToastTone>(["danger", "warning"]);

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function isRenderableNode(node: ReactNode): boolean {
  if (node === null || node === undefined || node === false || node === true) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (Array.isArray(node)) return node.some(isRenderableNode);
  return true;
}

export function ToastNotification({
  ariaLabel = "Notification",
  className,
  dismissLabel = "Dismiss notification",
  onAction,
  onDismiss,
  readOnly = false,
  role,
  toast,
}: ToastNotificationProps) {
  if (!toast || toast.hidden) return null;

  const hasTitle = isRenderableNode(toast.title);
  const hasMessage = isRenderableNode(toast.message);

  if (!hasTitle && !hasMessage) return null;

  const tone = toast.tone ?? "neutral";
  const visibleActions = readOnly ? [] : getVisibleActions(toast.actions);
  const resolvedRole = role ?? (attentionTones.has(tone) ? "alert" : "status");

  return (
    <section
      aria-atomic="true"
      aria-label={ariaLabel}
      aria-live={resolvedRole === "alert" ? "assertive" : "polite"}
      className={joinClasses("atlas-toast-notification", `atlas-toast-notification--${tone}`, className)}
      role={resolvedRole}
    >
      <div className="atlas-toast-notification__body">
        {hasTitle ? <div className="atlas-toast-notification__title">{toast.title}</div> : null}
        {hasMessage ? <div className="atlas-toast-notification__message">{toast.message}</div> : null}
      </div>
      {visibleActions.length > 0 || (!readOnly && onDismiss) ? (
        <div className="atlas-toast-notification__actions">
          <ActionMenu
            actions={visibleActions}
            ariaLabel={`${ariaLabel} actions`}
            onAction={(actionId) => onAction?.(actionId, toast)}
          />
          {!readOnly && onDismiss ? (
            <button
              className="atlas-toast-notification__dismiss"
              onClick={() => onDismiss(toast)}
              type="button"
            >
              {dismissLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
