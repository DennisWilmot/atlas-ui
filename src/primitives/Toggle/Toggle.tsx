import { useId, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ToggleSize = "sm" | "md";
export type ToggleLabelPosition = "start" | "end";

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  description?: ReactNode;
  label?: ReactNode;
  labelPosition?: ToggleLabelPosition;
  onCheckedChange?: (checked: boolean) => void;
  size?: ToggleSize;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Toggle({
  checked,
  className,
  defaultChecked = false,
  description,
  disabled,
  label,
  labelPosition = "end",
  onCheckedChange,
  onClick,
  size = "md",
  type = "button",
  ...props
}: ToggleProps) {
  const generatedId = useId();
  const labelId = label ? `${generatedId}-label` : undefined;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const currentChecked = isControlled ? checked : internalChecked;

  function setChecked(nextChecked: boolean) {
    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  }

  const control = (
    <button
      aria-checked={currentChecked}
      aria-describedby={descriptionId}
      aria-label={label ? undefined : props["aria-label"] ?? "Toggle"}
      aria-labelledby={labelId}
      className={joinClasses(
        "atlas-toggle__control",
        `atlas-toggle__control--${size}`,
        currentChecked && "atlas-toggle__control--checked",
      )}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          setChecked(!currentChecked);
        }
      }}
      role="switch"
      type={type}
      {...props}
    >
      <span className="atlas-toggle__thumb" />
    </button>
  );

  const copy = label || description ? (
    <span className="atlas-toggle__copy">
      {label ? <span className="atlas-toggle__label" id={labelId}>{label}</span> : null}
      {description ? (
        <span className="atlas-field__hint" id={descriptionId}>
          {description}
        </span>
      ) : null}
    </span>
  ) : null;

  return (
    <span className={joinClasses("atlas-toggle", `atlas-toggle--label-${labelPosition}`, className)}>
      {labelPosition === "start" ? copy : null}
      {control}
      {labelPosition === "end" ? copy : null}
    </span>
  );
}
