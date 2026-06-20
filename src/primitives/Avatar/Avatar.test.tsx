import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

const sampleImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGM4ffUhSYhhVMOohuGrAQCui4EfaoABDwAAAABJRU5ErkJggg==";

describe("Avatar", () => {
  it("renders the initials fallback when no image source is supplied", () => {
    render(<Avatar alt="Record A" initials="RA" />);

    expect(screen.getByText("RA")).toBeInTheDocument();
  });

  it("derives initials from the alt text when none are supplied", () => {
    render(<Avatar alt="Account Beta" />);

    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar src={sampleImage} alt="Record A" initials="RA" />);

    fireEvent.error(screen.getByAltText("Record A"));

    expect(screen.getByText("RA")).toBeInTheDocument();
  });

  it("exposes alt text on the rendered image", () => {
    render(<Avatar src={sampleImage} alt="Record A" />);

    expect(screen.getByAltText("Record A")).toBeInTheDocument();
  });

  it("labels the fallback with the alt text for assistive tech", () => {
    render(<Avatar alt="Record A" initials="RA" />);

    expect(screen.getByRole("img", { name: "Record A" })).toBeInTheDocument();
  });

  it("renders nothing when there is no image, no initials, and no alt", () => {
    const { container } = render(<Avatar alt="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a placeholder only when explicitly opted in", () => {
    const { container } = render(<Avatar alt="" showPlaceholder />);

    expect(container.querySelector(".atlas-avatar__placeholder")).toBeInTheDocument();
  });

  it("renders the requested status affordance", () => {
    const { container } = render(<Avatar alt="Record A" initials="RA" status="online" />);

    expect(container.querySelector('[data-status="online"]')).toBeInTheDocument();
  });

  it("exposes the status to assistive tech, defaulting to the status value", () => {
    render(<Avatar alt="Record A" initials="RA" status="online" />);

    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("uses statusLabel for the announced status when provided", () => {
    render(<Avatar alt="Record A" initials="RA" status="busy" statusLabel="In a meeting" />);

    expect(screen.getByText("In a meeting")).toBeInTheDocument();
  });
});
