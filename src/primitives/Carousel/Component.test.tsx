import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Carousel, type CarouselSlide } from "./Component";

const slides: CarouselSlide[] = [
  {
    id: "item-a",
    label: "Item A",
    content: <span>Content A</span>,
  },
  {
    id: "item-b",
    label: "Item B",
    content: <span>Content B</span>,
  },
  {
    id: "item-c",
    label: "Item C",
    content: <span>Content C</span>,
  },
];

describe("Carousel", () => {
  it("returns null when no visible slides exist", () => {
    const { container } = render(<Carousel slides={[{ ...slides[0], hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the active slide in an accessible region", () => {
    render(<Carousel label="Items" slides={slides} />);

    expect(screen.getByRole("region", { name: "Items" })).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
    expect(screen.getByRole("group", { name: "Item A" })).toHaveAttribute(
      "aria-roledescription",
      "slide",
    );
    expect(screen.getByRole("group", { name: "Items slides" })).toBeInTheDocument();
    expect(screen.getByText("Content A")).toBeInTheDocument();
  });

  it("navigates between slides", async () => {
    const user = userEvent.setup();
    render(<Carousel label="Items" slides={slides} />);

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(screen.getByText("Content B")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));

    expect(screen.getByText("Content A")).toBeInTheDocument();
  });

  it("hides navigation chrome for a single slide", () => {
    render(<Carousel slides={slides.slice(0, 1)} />);

    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous slide" })).not.toBeInTheDocument();
  });

  it("respects hidden navigation props", () => {
    render(<Carousel showControls={false} showIndicators={false} slides={slides} />);

    expect(screen.queryByRole("button", { name: "Next slide" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show Item A" })).not.toBeInTheDocument();
  });

  it("loops when loop is enabled", async () => {
    const user = userEvent.setup();
    render(<Carousel loop slides={slides} />);

    await user.click(screen.getByRole("button", { name: "Previous slide" }));

    expect(screen.getByText("Content C")).toBeInTheDocument();
  });

  it("disables navigation controls when disabled", () => {
    render(<Carousel disabled defaultIndex={1} slides={slides} />);

    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Show Item A" })).toBeDisabled();
  });

  it("requests controlled index changes without changing visible content", async () => {
    const user = userEvent.setup();
    const handleIndexChange = vi.fn();

    render(<Carousel index={1} onIndexChange={handleIndexChange} slides={slides} />);

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(handleIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("clamps invalid indexes to a visible slide", () => {
    render(<Carousel defaultIndex={99} slides={slides} />);

    expect(screen.getByText("Content C")).toBeInTheDocument();
  });
});
