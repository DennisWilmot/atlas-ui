import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { OverlayMode } from "../../types";

export type OverlayProps = {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  dismissable?: boolean;
  footer?: ReactNode;
  mode: OverlayMode;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  title?: ReactNode;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}

export function Overlay({
  children,
  className,
  description,
  dismissable = true,
  footer,
  mode,
  onOpenChange,
  open,
  title,
}: OverlayProps) {
  const generatedId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = title ? `${generatedId}-title` : undefined;
  const descriptionId = description ? `${generatedId}-description` : undefined;

  function close() {
    onOpenChange?.(false);
  }

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const panel = panelRef.current;
    if (!panel) return;

    const [firstFocusable] = getFocusableElements(panel);
    (firstFocusable ?? panel).focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    const panel = panelRef.current;
    if (!panel) return;

    if (event.key === "Escape" && dismissable) {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements(panel);
    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  return (
    <div
      className="atlas-overlay"
      data-testid="atlas-overlay-backdrop"
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (dismissable && event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={joinClasses("atlas-overlay__panel", `atlas-overlay__panel--${mode}`, className)}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {title || description || dismissable ? (
          <header className="atlas-overlay__header">
            <span className="atlas-overlay__heading">
              {title ? <span className="atlas-overlay__title" id={titleId}>{title}</span> : null}
              {description ? (
                <span className="atlas-field__hint" id={descriptionId}>
                  {description}
                </span>
              ) : null}
            </span>
            {dismissable ? (
              <button className="atlas-overlay__close" onClick={close} type="button">
                Close
              </button>
            ) : null}
          </header>
        ) : null}
        <div className="atlas-overlay__body">{children}</div>
        {footer ? <footer className="atlas-overlay__footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
