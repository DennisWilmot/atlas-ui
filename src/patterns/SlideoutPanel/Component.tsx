import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import type { Action, OverlayMode } from "../../types";
import { getVisibleActions } from "../../headless";
import { ActionMenu } from "../ActionMenu";

export type SlideoutPanelPlacement = "left" | "right" | "top" | "bottom";

export type SlideoutPanelSection = {
  id: string;
  title?: ReactNode;
  content?: ReactNode;
  actions?: Action[];
  hidden?: boolean;
};

export type SlideoutPanelProps = {
  open?: boolean;
  mode?: OverlayMode;
  placement?: SlideoutPanelPlacement;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  sections?: SlideoutPanelSection[];
  actions?: Action[];
  footer?: ReactNode;
  label?: string;
  className?: string;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  readOnly?: boolean;
  showBackdrop?: boolean;
  onAction?: (actionId: string) => void;
  onClose?: () => void;
  onSectionAction?: (actionId: string, sectionId: string) => void;
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

function getVisibleSectionActions(section: SlideoutPanelSection, readOnly: boolean): Action[] {
  if (readOnly) return [];
  return getVisibleActions(section.actions);
}

function getVisibleSections(
  sections: SlideoutPanelSection[],
  readOnly: boolean,
): SlideoutPanelSection[] {
  return sections.filter((section) => {
    if (section.hidden) return false;

    return (
      isMeaningfulNode(section.title) ||
      isMeaningfulNode(section.content) ||
      getVisibleSectionActions(section, readOnly).length > 0
    );
  });
}

function getResolvedPlacement(
  mode: OverlayMode,
  placement: SlideoutPanelPlacement | undefined,
): SlideoutPanelPlacement {
  if (placement) return placement;
  return mode === "sheet" ? "bottom" : "right";
}

export function SlideoutPanel({
  actions = [],
  children,
  className,
  closeLabel = "Close panel",
  closeOnBackdrop = true,
  closeOnEscape = true,
  description,
  footer,
  label = "Panel",
  mode = "drawer",
  onAction,
  onClose,
  onSectionAction,
  open = false,
  placement,
  readOnly = false,
  sections = [],
  showBackdrop = true,
  title,
}: SlideoutPanelProps) {
  const panelId = useId();
  const titleId = `${panelId}-title`;
  const visibleActions = readOnly ? [] : getVisibleActions(actions);
  const visibleSections = getVisibleSections(sections, readOnly);
  const hasTitle = isMeaningfulNode(title);
  const hasDescription = isMeaningfulNode(description);
  const hasChildren = isMeaningfulNode(children);
  const hasFooter = isMeaningfulNode(footer);
  const hasMeaning =
    hasTitle ||
    hasDescription ||
    hasChildren ||
    hasFooter ||
    visibleActions.length > 0 ||
    visibleSections.length > 0;

  useEffect(() => {
    if (!open || !closeOnEscape || !onClose) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, onClose, open]);

  if (!open || !hasMeaning) return null;

  const resolvedPlacement = getResolvedPlacement(mode, placement);

  return (
    <div
      className={joinClasses(
        "atlas-slideout-panel",
        `atlas-slideout-panel--${mode}`,
        `atlas-slideout-panel--${resolvedPlacement}`,
        className,
      )}
      data-mode={mode}
      data-placement={resolvedPlacement}
    >
      {showBackdrop ? (
        closeOnBackdrop && onClose ? (
          <button
            aria-hidden="true"
            className="atlas-slideout-panel__backdrop"
            onClick={onClose}
            tabIndex={-1}
            type="button"
          />
        ) : (
          <div aria-hidden="true" className="atlas-slideout-panel__backdrop" />
        )
      ) : null}
      <section
        aria-label={hasTitle ? undefined : label}
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-modal="true"
        className="atlas-slideout-panel__surface"
        role="dialog"
      >
        {hasTitle || hasDescription || onClose ? (
          <header className="atlas-slideout-panel__header">
            <div className="atlas-slideout-panel__heading-group">
              {hasTitle ? (
                <h2 className="atlas-slideout-panel__title" id={titleId}>
                  {title}
                </h2>
              ) : null}
              {hasDescription ? (
                <div className="atlas-slideout-panel__description">{description}</div>
              ) : null}
            </div>
            {onClose ? (
              <button
                className="atlas-slideout-panel__close"
                onClick={onClose}
                type="button"
              >
                {closeLabel}
              </button>
            ) : null}
          </header>
        ) : null}
        <div className="atlas-slideout-panel__main">
          {visibleActions.length > 0 ? (
            <ActionMenu
              actions={visibleActions}
              ariaLabel={`${label} actions`}
              onAction={onAction}
            />
          ) : null}
          {hasChildren ? <div className="atlas-slideout-panel__body">{children}</div> : null}
          {visibleSections.length > 0 ? (
            <div className="atlas-slideout-panel__sections">
              {visibleSections.map((section) => {
                const sectionActions = getVisibleSectionActions(section, readOnly);

                return (
                  <section className="atlas-slideout-panel__section" key={section.id}>
                    {isMeaningfulNode(section.title) ? (
                      <h3 className="atlas-slideout-panel__section-title">{section.title}</h3>
                    ) : null}
                    {isMeaningfulNode(section.content) ? (
                      <div className="atlas-slideout-panel__section-content">
                        {section.content}
                      </div>
                    ) : null}
                    {sectionActions.length > 0 ? (
                      <ActionMenu
                        actions={sectionActions}
                        ariaLabel={`${label} ${section.id} actions`}
                        className="atlas-slideout-panel__section-actions"
                        onAction={(actionId) => onSectionAction?.(actionId, section.id)}
                      />
                    ) : null}
                  </section>
                );
              })}
            </div>
          ) : null}
        </div>
        {hasFooter ? <footer className="atlas-slideout-panel__footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
