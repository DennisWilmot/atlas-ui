import type { HTMLAttributes, Key, ReactNode } from "react";
import { useState } from "react";

export type CarouselSlide = {
  id: Key;
  content: ReactNode;
  label?: string;
  hidden?: boolean;
};

export type CarouselProps = Omit<HTMLAttributes<HTMLElement>, "children" | "onChange"> & {
  slides?: CarouselSlide[];
  label?: string;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  disabled?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  previousLabel?: string;
  nextLabel?: string;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function clampIndex(index: number | undefined, maxIndex: number): number {
  if (index === undefined || !Number.isFinite(index)) return 0;

  return Math.min(Math.max(Math.trunc(index), 0), maxIndex);
}

export function Carousel({
  className,
  defaultIndex = 0,
  disabled = false,
  index,
  label = "Carousel",
  loop = false,
  nextLabel = "Next slide",
  onIndexChange,
  previousLabel = "Previous slide",
  showControls = true,
  showIndicators = true,
  slides = [],
  ...props
}: CarouselProps) {
  const visibleSlides = slides.filter((slide) => !slide.hidden);
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  if (visibleSlides.length === 0) return null;

  const maxIndex = visibleSlides.length - 1;
  const isControlled = index !== undefined;
  const activeIndex = clampIndex(isControlled ? index : internalIndex, maxIndex);
  const activeSlide = visibleSlides[activeIndex];
  const hasMultipleSlides = visibleSlides.length > 1;
  const canGoPrevious = loop || activeIndex > 0;
  const canGoNext = loop || activeIndex < maxIndex;
  const controlsVisible = hasMultipleSlides && showControls;
  const indicatorsVisible = hasMultipleSlides && showIndicators;

  function setActiveIndex(nextIndex: number) {
    const safeIndex = clampIndex(nextIndex, maxIndex);

    if (!isControlled) {
      setInternalIndex(safeIndex);
    }

    if (safeIndex !== activeIndex) {
      onIndexChange?.(safeIndex);
    }
  }

  function goPrevious() {
    if (disabled) return;

    setActiveIndex(activeIndex === 0 && loop ? maxIndex : activeIndex - 1);
  }

  function goNext() {
    if (disabled) return;

    setActiveIndex(activeIndex === maxIndex && loop ? 0 : activeIndex + 1);
  }

  return (
    <section
      className={joinClasses("atlas-carousel", className)}
      aria-label={label}
      aria-roledescription="carousel"
      {...props}
    >
      <div className="atlas-carousel__viewport" aria-live="polite">
        <div
          className="atlas-carousel__slide"
          aria-label={activeSlide.label ?? `${activeIndex + 1} of ${visibleSlides.length}`}
          aria-roledescription="slide"
          role="group"
        >
          {activeSlide.content}
        </div>
      </div>

      {controlsVisible || indicatorsVisible ? (
        <div className="atlas-carousel__navigation">
          {controlsVisible ? (
            <button
              className="atlas-carousel__control"
              disabled={disabled || !canGoPrevious}
              onClick={goPrevious}
              type="button"
              aria-label={previousLabel}
            >
              <span aria-hidden="true">&lt;</span>
            </button>
          ) : null}

          {indicatorsVisible ? (
            <div className="atlas-carousel__indicators" aria-label={`${label} slides`} role="group">
              {visibleSlides.map((slide, slideIndex) => (
                <button
                  className={joinClasses(
                    "atlas-carousel__indicator",
                    slideIndex === activeIndex && "atlas-carousel__indicator--active",
                  )}
                  key={slide.id}
                  disabled={disabled}
                  onClick={() => setActiveIndex(slideIndex)}
                  type="button"
                  aria-current={slideIndex === activeIndex ? "true" : undefined}
                  aria-label={slide.label ? `Show ${slide.label}` : `Show slide ${slideIndex + 1}`}
                />
              ))}
            </div>
          ) : null}

          {controlsVisible ? (
            <button
              className="atlas-carousel__control"
              disabled={disabled || !canGoNext}
              onClick={goNext}
              type="button"
              aria-label={nextLabel}
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
