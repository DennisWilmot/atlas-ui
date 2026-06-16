import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  className,
  disabled,
  leftIcon,
  loading = false,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={joinClasses(
        "atlas-button",
        `atlas-button--${variant}`,
        `atlas-button--${size}`,
        className,
      )}
      disabled={disabled || loading}
      type={type}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="atlas-button__spinner" aria-hidden="true" /> : null}
      {!loading && leftIcon ? <span className="atlas-button__icon">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="atlas-button__icon">{rightIcon}</span> : null}
    </button>
  );
}
