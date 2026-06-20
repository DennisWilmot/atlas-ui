import { useId } from "react";
import type { HTMLAttributes } from "react";
import { Radio, type RadioVariant } from "../Radio";

export type RadioGroupOrientation = "vertical" | "horizontal";

export type RadioGroupItem = {
  id: string;
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  items: RadioGroupItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  orientation?: RadioGroupOrientation;
  variant?: RadioVariant;
  disabled?: boolean;
  required?: boolean;
  name?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function hasMeaningfulText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function RadioGroup({
  items,
  value,
  defaultValue,
  onValueChange,
  label,
  orientation = "vertical",
  variant = "default",
  disabled = false,
  required = false,
  name,
  className,
  ...props
}: RadioGroupProps) {
  const generatedName = useId();
  const labelId = useId();
  const groupName = name ?? generatedName;
  const hasLabel = hasMeaningfulText(label);
  const hasAccessibleName =
    hasLabel || hasMeaningfulText(props["aria-label"]) || hasMeaningfulText(props["aria-labelledby"]);
  const visibleItems = items.filter((item) => hasMeaningfulText(item.label));

  // URA Law 4: no meaningful options or group name, nothing useful to show.
  if (!visibleItems.length || !hasAccessibleName) return null;

  const isControlled = value !== undefined;

  return (
    <div
      className={joinClasses("atlas-radio-group", `atlas-radio-group--${orientation}`, className)}
      role="radiogroup"
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-required={required || undefined}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {hasLabel ? (
        <span id={labelId} className="atlas-radio-group__label">
          {label}
        </span>
      ) : null}
      <div className="atlas-radio-group__options">
        {visibleItems.map((item) => {
          const itemDisabled = disabled || Boolean(item.disabled);
          const selectionProps = isControlled
            ? { checked: item.value === value }
            : { defaultChecked: item.value === defaultValue };

          return (
            <Radio
              key={item.id}
              name={groupName}
              value={item.value}
              label={item.label}
              description={item.description}
              variant={variant}
              disabled={itemDisabled}
              required={required}
              {...selectionProps}
              onChange={() => onValueChange?.(item.value)}
            />
          );
        })}
      </div>
    </div>
  );
}
