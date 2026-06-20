import { cloneElement, isValidElement, useId, useRef, useState } from "react";
import type { FocusEvent, HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";

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

type TriggerElementProps = HTMLAttributes<HTMLElement>;

function composeHandler<Event>(
  existing: ((event: Event) => void) | undefined,
  next: (event: Event) => void,
) {
  return (event: Event) => {
    existing?.(event);
    next(event);
  };
}

function isNaturallyFocusable(element: ReactElement<TriggerElementProps>): boolean {
  const props = element.props as TriggerElementProps & { href?: string };

  if (typeof element.type !== "string") return false;

  if (element.type === "button" || element.type === "input" || element.type === "select") return true;
  if (element.type === "textarea" || element.type === "summary") return true;
  if ((element.type === "a" || element.type === "area") && props.href) return true;

  return false;
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

  const descriptionProps = open ? { "aria-describedby": contentId } : {};
  const trigger = isValidElement(children)
    ? (() => {
        const child = children as ReactElement<TriggerElementProps>;
        const tabIndex = child.props.tabIndex ?? (isNaturallyFocusable(child) ? undefined : 0);

        return cloneElement(child, {
          ...descriptionProps,
          onBlur: composeHandler(
            child.props.onBlur,
            hide as (event: FocusEvent<HTMLElement>) => void,
          ),
          onFocus: composeHandler(
            child.props.onFocus,
            show as (event: FocusEvent<HTMLElement>) => void,
          ),
          tabIndex,
        });
      })()
    : children;

  return (
    <span
      className={joinClasses("atlas-tooltip", `atlas-tooltip--${placement}`, className)}
      {...(!isValidElement(children)
        ? {
            ...descriptionProps,
            onBlur: hide,
            onFocus: show,
            tabIndex: 0,
          }
        : {})}
      onMouseEnter={show as (event: MouseEvent<HTMLSpanElement>) => void}
      onMouseLeave={hide as (event: MouseEvent<HTMLSpanElement>) => void}
    >
      {trigger}
      {open ? (
        <span className="atlas-tooltip__content" role="tooltip" id={contentId}>
          {content}
        </span>
      ) : null}
    </span>
  );
}
