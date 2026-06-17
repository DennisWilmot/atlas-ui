import { Badge, Button, Input } from "../../../src/primitives";
import { useId } from "react";

type VerificationAction = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
};

export type VerificationExampleProps = {
  actions?: VerificationAction[];
  codeField?: {
    error?: string;
    hint?: string;
    label: string;
    placeholder?: string;
  };
  description?: string;
  status?: {
    label: string;
    variant: "neutral" | "success" | "warning" | "danger" | "info";
  };
  title?: string;
};

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function hasCodeField(codeField: VerificationExampleProps["codeField"]): boolean {
  return Boolean(codeField && hasText(codeField.label));
}

export function VerificationExample({
  actions = [],
  codeField,
  description,
  status,
  title,
}: VerificationExampleProps) {
  const titleId = useId();
  const visibleActions = actions.filter((action) => hasText(action.label));
  const hasContent =
    hasText(title) ||
    hasText(description) ||
    hasText(status?.label) ||
    hasCodeField(codeField) ||
    visibleActions.length > 0;

  if (!hasContent) return null;

  return (
    <main className="verification-example" aria-labelledby={hasText(title) ? titleId : undefined}>
      <section className="verification-example__panel">
        {hasText(status?.label) ? (
          <Badge dot variant={status.variant}>
            {status.label}
          </Badge>
        ) : null}

        <div className="verification-example__copy">
          {hasText(title) ? (
            <h1 className="verification-example__title" id={titleId}>
              {title}
            </h1>
          ) : null}
          {hasText(description) ? <p className="verification-example__description">{description}</p> : null}
        </div>

        {hasCodeField(codeField) ? (
          <Input
            autoComplete="one-time-code"
            error={codeField.error}
            hint={codeField.hint}
            inputMode="numeric"
            label={codeField.label}
            maxLength={6}
            placeholder={codeField.placeholder}
          />
        ) : null}

        {visibleActions.length > 0 ? (
          <div className="verification-example__actions" aria-label="Verification actions">
            {visibleActions.map((action) => (
              <Button disabled={action.disabled} key={action.id} variant={action.variant ?? "secondary"}>
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
