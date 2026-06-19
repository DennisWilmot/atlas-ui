import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders the trigger", () => {
    render(
      <Tooltip content="Supporting detail">
        <Button>Item A</Button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Item A" })).toBeInTheDocument();
  });

  it("shows content on interaction", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Supporting detail" delay={0}>
        <Button>Item A</Button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Item A" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Supporting detail");
  });

  it("reveals the tooltip on keyboard focus and describes the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Supporting detail" delay={0}>
        <span>Trigger</span>
      </Tooltip>,
    );

    await user.tab();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Supporting detail");
    expect(tooltip).toHaveAttribute("id");
    expect(screen.getByText("Trigger")).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("does not add an extra tab stop around an already-focusable trigger", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Supporting detail" delay={0}>
        <Button>Item A</Button>
      </Tooltip>,
    );

    await user.tab();

    const button = screen.getByRole("button", { name: "Item A" });
    expect(button).toHaveFocus();

    const tooltip = await screen.findByRole("tooltip");
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("returns only children when content is empty", () => {
    render(
      <Tooltip content="">
        <Button>Item A</Button>
      </Tooltip>,
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Item A" })).toBeInTheDocument();
  });
});
