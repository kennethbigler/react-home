import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Info from "../Info";

describe("resume | summary | Info", () => {
  it("take you to LinkedIn on Photo Click", () => {
    window.open = vi.fn();
    render(<Info />);

    fireEvent.click(screen.getByAltText("Kenneth Bigler"));
    expect(window.open).toHaveBeenCalled();
  });
});
