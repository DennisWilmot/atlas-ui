import { useMemo, useState } from "react";
import type { Action } from "../../types";
import { getVisibleActions } from "../../headless";

export type CommandSurfaceProps = {
  commands?: Action[];
  inputValue?: string;
  defaultInputValue?: string;
  inputLabel?: string;
  discoveryLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onInputChange?: (value: string) => void;
  onSelect?: (commandId: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function CommandSurface({
  className,
  commands = [],
  defaultInputValue = "",
  disabled = false,
  discoveryLabel = "Available commands",
  inputLabel = "Command input",
  inputValue,
  onInputChange,
  onSelect,
  placeholder = "Search commands",
}: CommandSurfaceProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultInputValue);
  const currentInputValue = inputValue ?? uncontrolledValue;
  const visibleCommands = useMemo(() => getVisibleActions(commands), [commands]);
  const query = normalize(currentInputValue);

  const discoveredCommands = useMemo(() => {
    if (!query) return visibleCommands;
    return visibleCommands.filter((command) => command.label.toLowerCase().includes(query));
  }, [query, visibleCommands]);

  if (visibleCommands.length === 0) return null;

  const setInputValue = (value: string) => {
    if (inputValue === undefined) setUncontrolledValue(value);
    onInputChange?.(value);
  };

  return (
    <section className={joinClasses("atlas-command-surface", className)} aria-label={discoveryLabel}>
      <label className="atlas-field">
        <span className="atlas-field__label">{inputLabel}</span>
        <input
          className="atlas-field__control"
          disabled={disabled}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={currentInputValue}
        />
      </label>
      {discoveredCommands.length > 0 ? (
        <div className="atlas-command-surface__discovery" role="listbox" aria-label={discoveryLabel}>
          {discoveredCommands.map((command) => (
            <button
              aria-disabled={disabled || command.disabled}
              className={joinClasses(
                "atlas-command-surface__item",
                command.intent ? `atlas-command-surface__item--${command.intent}` : undefined,
              )}
              disabled={disabled || command.disabled}
              key={command.id}
              onClick={() => {
                if (!disabled && !command.disabled) onSelect?.(command.id);
              }}
              role="option"
              type="button"
            >
              {command.icon ? <span className="atlas-button__icon">{command.icon}</span> : null}
              {command.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
