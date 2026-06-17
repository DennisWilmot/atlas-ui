import { useRef, useState } from "react";
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
      onBlur={hide}
      onFocus={show}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {open ? (
        <span className="atlas-tooltip__content" role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  );
}
