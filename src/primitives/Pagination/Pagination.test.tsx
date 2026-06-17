import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("returns null when only one page exists", () => {
    const { container } = render(<Pagination page={1} pageSize={10} totalItems={10} />);

    expect(container.firstChild).toBeNull();
  });

  it("executes next and previous page changes", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination onPageChange={onPageChange} page={2} pageSize={10} totalItems={40} />);

    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("blocks execution when disabled", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination disabled onPageChange={onPageChange} page={2} pageSize={10} totalItems={40} />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
