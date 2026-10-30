import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CategoryEntryDialog from "./CategoryEntryDialog";

describe("resume | finances | budgeting | CategoryEntryDialog", () => {
  it("defaults to miscellaneous and saves the title-cased name", () => {
    const onSave = vi.fn();

    render(
      <CategoryEntryDialog
        open
        otherCategoryKeys={[]}
        inUse={false}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    expect(
      screen.getByRole("combobox", { name: "Recommended Category" }),
    ).toHaveTextContent("Miscellaneous (5%)");
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "pet care" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onSave).toHaveBeenCalledWith(
      { name: "Pet Care", recommended: "miscellaneous" },
      undefined,
    );
  });

  it("blocks duplicate category names", () => {
    render(
      <CategoryEntryDialog
        open
        otherCategoryKeys={["food"]}
        inUse={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: " Food " },
    });

    expect(screen.getByText("Category already exists.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("prefills an existing category and explains why delete is disabled", () => {
    const onClose = vi.fn();

    render(
      <CategoryEntryDialog
        open
        category={{ name: "Rent", recommended: "housing" }}
        color="success"
        otherCategoryKeys={[]}
        inUse
        onClose={onClose}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Edit Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Rent");
    expect(
      screen.getByRole("combobox", { name: "Color (Optional)" }),
    ).toHaveTextContent("Success");
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
    expect(screen.getByText("Move its expenses first.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
