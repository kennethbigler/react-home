import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CategoryColorSelect from "./CategoryColorSelect";

describe("resume | finances | budgeting | CategoryColorSelect", () => {
  it("forwards selected palette colors", () => {
    const onChange = vi.fn();

    render(<CategoryColorSelect value="success" onChange={onChange} />);

    fireEvent.mouseDown(screen.getByLabelText("Color (Optional)"));
    fireEvent.click(screen.getByRole("option", { name: "Warning" }));

    expect(onChange).toHaveBeenCalledWith("warning");
  });

  it("clears the color when default is selected", () => {
    const onChange = vi.fn();

    render(<CategoryColorSelect value="success" onChange={onChange} />);

    fireEvent.mouseDown(screen.getByLabelText("Color (Optional)"));
    fireEvent.click(screen.getByRole("option", { name: "Default (None)" }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
