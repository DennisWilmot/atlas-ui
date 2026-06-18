import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export type TooltipProps = {
  children: ReactNode;
  className?: string;
  content?: ReactNode;
  delay?: number;
  disabled?: boolean;
  placement?: TooltipPlacement;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function hasContent(content: ReactNode): boolean {
  return content !== null && content !== undefined && content !== "";
}

export function Tooltip({
  children,
  className,
  content,
  delay = 250,
  disabled = false,
  placement = "top",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentId = useId();

  if (disabled || !hasContent(content)) {
    return <>{children}</>;
  }

  function show() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setOpen(false);
  }

  return (
    <span
      className={joinClasses("atlas-tooltip", `atlas-tooltip--${placement}`, className)}
      // Focusable so keyboard users can reveal the tooltip; describes the
      // trigger with the tooltip content while it is open.
      // TODO: this wrapper is always a tab stop, which is correct for
      // non-focusable triggers (e.g. BadgeGroup's overflow badge) but adds a
      // redundant tab stop when wrapping an already-focusable element like a
      // Button. If that becomes a real usage, clone the child as the trigger
      // (cloneElement with tabIndex/aria-describedby) instead of wrapping.
      tabIndex={0}
      aria-describedby={open ? contentId : undefined}
      onBlur={hide}
      onFocus={show}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {open ? (
        <span className="atlas-tooltip__content" role="tooltip" id={contentId}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
