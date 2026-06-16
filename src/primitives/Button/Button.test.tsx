import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with children", () => {
    render(<Button>Action</Button>);

    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("supports disabled behavior", () => {
    render(<Button disabled>Action</Button>);

    expect(screen.getByRole("button", { name: "Action" })).toBeDisabled();
  });

  it("disables interaction while loading", () => {
    render(<Button loading>Action</Button>);

    expect(screen.getByRole("button", { name: "Action" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Action" })).toHaveAttribute("aria-busy", "true");
  });
});
