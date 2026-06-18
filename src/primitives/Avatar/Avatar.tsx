import { useEffect, useState, type HTMLAttributes } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarStatus = "online" | "offline" | "busy" | "away";

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  src?: string;
  alt: string;
  initials?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  /**
   * Accessible text announced for the status, since the colored status dot is
   * decorative (aria-hidden). Optional — defaults to the raw status value
   * (e.g. "online"). Set it to customize or localize, e.g. "Active now".
   */
  statusLabel?: string;
  /**
   * Render a neutral placeholder when there is no image and no resolvable
   * initials. Off by default so the avatar hides itself (URA Law 4); opt in
   * when the app needs a stable slot, e.g. for row alignment.
   */
  showPlaceholder?: boolean;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function resolveInitials(initials: string | undefined, alt: string): string {
  if (initials) return initials.trim().slice(0, 3).toUpperCase();

  const words = alt.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  alt,
  initials,
  size = "md",
  status,
  statusLabel,
  showPlaceholder = false,
  className,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  // Reset the failed flag when a new source is supplied by the app.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;
  const fallbackInitials = resolveInitials(initials, alt);

  // URA Law 4: nothing meaningful to show, and no explicit opt-in, renders nothing.
  if (!showImage && !fallbackInitials && !showPlaceholder) return null;

  // An empty alt marks the avatar as decorative (HTML img alt="" convention),
  // so the fallback is hidden from assistive tech instead of an unnamed img.
  const accessibleLabel = alt.trim() ? alt : undefined;

  return (
    <span className={joinClasses("atlas-avatar", `atlas-avatar--${size}`, className)} {...props}>
      {showImage ? (
        <img
          className="atlas-avatar__image"
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="atlas-avatar__fallback"
          {...(accessibleLabel ? { role: "img", "aria-label": accessibleLabel } : { "aria-hidden": true })}
        >
          {fallbackInitials ? (
            <span className="atlas-avatar__initials" aria-hidden="true">
              {fallbackInitials}
            </span>
          ) : (
            <span className="atlas-avatar__placeholder" aria-hidden="true" />
          )}
        </span>
      )}
      {status ? (
        <>
          <span
            className={joinClasses("atlas-avatar__status", `atlas-avatar__status--${status}`)}
            data-status={status}
            aria-hidden="true"
          />
          {/* The dot is decorative; this carries the status to assistive tech. */}
          <span className="atlas-visually-hidden">{statusLabel ?? status}</span>
        </>
      ) : null}
    </span>
  );
}
