import { useId } from "react";
import type { ReactNode } from "react";
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
  const titleId = title ? `${generatedId}-title` : undefined;
  const descriptionId = description ? `${generatedId}-description` : undefined;

  if (!open) return null;

  function close() {
    onOpenChange?.(false);
  }

  return (
    <div
      className="atlas-overlay"
      data-testid="atlas-overlay-backdrop"
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
        role="dialog"
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
