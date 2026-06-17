import type { ChangeEvent, ReactNode, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { getVisibleActions } from "../../headless";
import type { Action } from "../../types";
import { ActionMenu } from "../ActionMenu";

export type TextEditorProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children" | "defaultValue" | "onChange" | "readOnly" | "value"
> & {
  value?: string | null;
  defaultValue?: string;
  label?: ReactNode;
  description?: ReactNode;
  toolbarActions?: Action[];
  readOnly?: boolean;
  hidden?: boolean;
  className?: string;
  controlClassName?: string;
  onChange?: (value: string) => void;
  onToolbarAction?: (actionId: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function isMeaningfulNode(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (Array.isArray(node)) return node.some(isMeaningfulNode);
  return true;
}

function isMeaningfulText(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function getToolbarActions(actions: Action[], options: { disabled: boolean; readOnly: boolean }): Action[] {
  if (options.readOnly) return [];

  const visibleActions = getVisibleActions(actions);
  if (!options.disabled) return visibleActions;

  return visibleActions.map((action) => ({ ...action, disabled: true }));
}

export function TextEditor({
  "aria-label": ariaLabel,
  className,
  controlClassName,
  defaultValue,
  description,
  disabled = false,
  hidden = false,
  id,
  label,
  onChange,
  onToolbarAction,
  placeholder,
  readOnly = false,
  rows = 6,
  toolbarActions = [],
  value,
  ...props
}: TextEditorProps) {
  const generatedId = useId();
  const editorId = id ?? generatedId;
  const descriptionId = `${editorId}-description`;
  const hasLabel = isMeaningfulNode(label);
  const hasDescription = isMeaningfulNode(description);
  const hasAccessibleName = hasLabel || isMeaningfulText(ariaLabel) || isMeaningfulText(placeholder);
  const hasText = isMeaningfulText(value) || isMeaningfulText(defaultValue);
  const visibleToolbarActions = getToolbarActions(toolbarActions, { disabled, readOnly });
  const describedBy = [hasDescription ? descriptionId : undefined, props["aria-describedby"]]
    .filter(Boolean)
    .join(" ") || undefined;

  if (hidden || !hasAccessibleName) return null;

  const canCollectText = !readOnly && !disabled;
  const hasMeaningfulSurface =
    hasText ||
    isMeaningfulText(placeholder) ||
    hasDescription ||
    visibleToolbarActions.length > 0 ||
    canCollectText;

  if (!hasMeaningfulSurface) return null;

  const isControlled = value !== undefined;
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <section className={joinClasses("atlas-text-editor", className)}>
      <div className="atlas-text-editor__header">
        {hasLabel ? (
          <label className="atlas-field__label" htmlFor={editorId}>
            {label}
          </label>
        ) : null}
        {visibleToolbarActions.length > 0 ? (
          <ActionMenu
            actions={visibleToolbarActions}
            ariaLabel={`${ariaLabel ?? "Text editor"} toolbar`}
            onAction={(actionId) => {
              if (!disabled && !readOnly) onToolbarAction?.(actionId);
            }}
          />
        ) : null}
      </div>
      {hasDescription ? (
        <div className="atlas-text-editor__description" id={descriptionId}>
          {description}
        </div>
      ) : null}
      <textarea
        {...props}
        aria-describedby={describedBy}
        aria-label={!hasLabel ? ariaLabel ?? placeholder : undefined}
        className={joinClasses("atlas-text-editor__control", controlClassName)}
        defaultValue={!isControlled ? defaultValue : undefined}
        disabled={disabled}
        id={editorId}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        value={isControlled ? value ?? "" : undefined}
      />
    </section>
  );
}
