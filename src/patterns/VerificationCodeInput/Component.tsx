import type {
  ClipboardEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
} from "react";
import { useId, useRef, useState } from "react";

export type VerificationCodeInputProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> & {
  length: number;
  value?: string;
  defaultValue?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  placeholder?: string;
  mask?: boolean;
  name?: string;
  isCharacterAllowed?: (character: string) => boolean;
  transformCharacter?: (character: string) => string;
  getSlotLabel?: (index: number) => string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getSlotCount(length: number): number {
  if (!Number.isFinite(length)) return 0;
  return Math.max(0, Math.trunc(length));
}

function defaultCharacterAllowed(character: string): boolean {
  return character.trim().length > 0;
}

function defaultTransformCharacter(character: string): string {
  return character;
}

function getCharacters(
  value: string,
  isCharacterAllowed: (character: string) => boolean,
  transformCharacter: (character: string) => string,
): string[] {
  return Array.from(value).flatMap((character) =>
    Array.from(transformCharacter(character)).filter(isCharacterAllowed),
  );
}

function getSlots(value: string, slotCount: number): string[] {
  const characters = Array.from(value).slice(0, slotCount);

  return Array.from({ length: slotCount }, (_, index) => characters[index] ?? "");
}

export function VerificationCodeInput({
  "aria-label": ariaLabel,
  autoComplete = "one-time-code",
  autoFocus = false,
  className,
  defaultValue = "",
  disabled = false,
  getSlotLabel,
  id,
  inputMode = "text",
  isCharacterAllowed = defaultCharacterAllowed,
  label = "Verification code",
  length,
  mask = false,
  name,
  onChange,
  onComplete,
  pattern,
  placeholder,
  readOnly = false,
  transformCharacter = defaultTransformCharacter,
  value,
  ...props
}: VerificationCodeInputProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelId = `${groupId}-label`;
  const slotCount = getSlotCount(length);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    getCharacters(defaultValue, isCharacterAllowed, transformCharacter).slice(0, slotCount).join(""),
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const slots = getSlots(
    getCharacters(currentValue, isCharacterAllowed, transformCharacter).join(""),
    slotCount,
  );
  const hasVisibleLabel = label.trim().length > 0;
  const accessibleLabel = ariaLabel ?? "Verification code";

  if (slotCount === 0) return null;

  const commitSlots = (nextSlots: string[]) => {
    const nextValue = nextSlots.join("").slice(0, slotCount);

    if (!isControlled) setUncontrolledValue(nextValue);

    onChange?.(nextValue);

    if (nextSlots.every(Boolean) && nextValue.length === slotCount) {
      onComplete?.(nextValue);
    }
  };

  const focusSlot = (index: number) => {
    inputRefs.current[Math.min(Math.max(index, 0), slotCount - 1)]?.focus();
  };

  const setCharactersFromIndex = (index: number, characters: string[]) => {
    if (disabled || readOnly || characters.length === 0) return;

    const nextSlots = [...slots];
    const availableCharacters = characters.slice(0, slotCount - index);

    availableCharacters.forEach((character, offset) => {
      nextSlots[index + offset] = character;
    });

    commitSlots(nextSlots);
    focusSlot(index + availableCharacters.length);
  };

  const clearSlot = (index: number) => {
    if (disabled || readOnly) return;

    const nextSlots = [...slots];
    nextSlots[index] = "";
    commitSlots(nextSlots);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusSlot(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < slotCount - 1) {
      event.preventDefault();
      focusSlot(index + 1);
      return;
    }

    if (event.key === "Backspace" && !slots[index] && index > 0 && !disabled && !readOnly) {
      event.preventDefault();
      clearSlot(index - 1);
      focusSlot(index - 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    const characters = getCharacters(
      event.clipboardData.getData("text"),
      isCharacterAllowed,
      transformCharacter,
    );

    if (characters.length === 0) return;

    event.preventDefault();
    setCharactersFromIndex(index, characters);
  };

  return (
    <div
      {...props}
      className={joinClasses("atlas-verification-code-input", className)}
      id={id}
      role="group"
      aria-labelledby={hasVisibleLabel ? labelId : undefined}
      aria-label={hasVisibleLabel ? undefined : accessibleLabel}
    >
      {hasVisibleLabel ? (
        <span className="atlas-field__label" id={labelId}>
          {label}
        </span>
      ) : null}
      <div className="atlas-verification-code-input__slots">
        {slots.map((slot, index) => (
          <input
            autoComplete={index === 0 ? autoComplete : undefined}
            autoFocus={autoFocus && index === 0}
            className="atlas-field__control atlas-verification-code-input__slot"
            disabled={disabled}
            id={`${groupId}-slot-${index + 1}`}
            inputMode={inputMode}
            key={index}
            maxLength={1}
            onChange={(event) => {
              const characters = getCharacters(
                event.target.value,
                isCharacterAllowed,
                transformCharacter,
              );

              if (characters.length === 0) {
                clearSlot(index);
                return;
              }

              setCharactersFromIndex(index, characters);
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={(event) => handlePaste(event, index)}
            pattern={pattern}
            placeholder={placeholder}
            readOnly={readOnly}
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            type={mask ? "password" : "text"}
            value={slot}
            aria-label={
              getSlotLabel?.(index) ??
              `${hasVisibleLabel ? label : accessibleLabel} character ${index + 1}`
            }
          />
        ))}
      </div>
      {name ? <input name={name} type="hidden" value={slots.join("")} /> : null}
    </div>
  );
}
