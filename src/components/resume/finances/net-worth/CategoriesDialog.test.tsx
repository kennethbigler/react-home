import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CategoriesDialog from "./CategoriesDialog";
import { resolveCategoryMerges } from "./resolveCategoryMerges";

describe("resume | finances | net-worth | CategoriesDialog", () => {
  describe("resolveCategoryMerges", () => {
    it("maps merges onto destination names and skips missing rows", () => {
      expect(
        resolveCategoryMerges(
          [
            { from: "Cash", intoRowId: "keep" },
            { from: "Old", intoRowId: "gone" },
          ],
          [
            { id: "keep", name: "Investments", previousName: "Investments" },
            { id: "new", name: "Home" },
          ],
        ),
      ).toEqual([{ from: "Cash", into: "Investments" }]);
    });

    it("uses the current name when previousName is absent", () => {
      expect(
        resolveCategoryMerges(
          [{ from: "Cash", intoRowId: "dest" }],
          [{ id: "dest", name: "Home" }],
        ),
      ).toEqual([{ from: "Cash", into: "Home" }]);
    });
  });
  it("saves trimmed unique category names with previous-name mappings", () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash", "Investments"]}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    fireEvent.change(screen.getByLabelText("Category 1"), {
      target: { value: "Liquid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));
    fireEvent.change(screen.getByLabelText("Category 3"), {
      target: { value: "Home" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      ["Liquid", "Investments", "Home"],
      [
        { name: "Liquid", previousName: "Cash" },
        { name: "Investments", previousName: "Investments" },
        { name: "Home", previousName: undefined },
      ],
      [],
    );
  });

  it("removes a category without merging when No is chosen", async () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash", "Investments"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[0],
    );
    expect(
      screen.getByRole("dialog", { name: "Apply removed category values?" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "No" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Apply removed category values?",
        }),
      ).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      ["Investments"],
      [{ name: "Investments", previousName: "Investments" }],
      [],
    );
  });

  it("merges removed category values into the selected category when Yes is chosen", async () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash", "Investments", "Home"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[2],
    );
    expect(
      screen.getByText(
        /Would you like to apply Home's values to another category/,
      ),
    ).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Category" }));
    fireEvent.click(screen.getByRole("option", { name: "Investments" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Apply removed category values?",
        }),
      ).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      ["Cash", "Investments"],
      [
        { name: "Cash", previousName: "Cash" },
        { name: "Investments", previousName: "Investments" },
      ],
      [{ from: "Home", into: "Investments" }],
    );
  });

  it("shows validation errors for empty and duplicate names", () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.change(screen.getByLabelText("Category 1"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      screen.getByText("Category names cannot be empty."),
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Category 1"), {
      target: { value: "Cash" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));
    fireEvent.change(screen.getByLabelText("Category 2"), {
      target: { value: "Cash" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      screen.getByText("Category names must be unique."),
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={[]}
        onClose={onClose}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("saves an empty category list after removing the last row", () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "remove category" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith([], [], []);
  });

  it("removes a newly added category without a merge prompt", () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));
    fireEvent.change(screen.getByLabelText("Category 2"), {
      target: { value: "Home" },
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[1],
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Apply removed category values?",
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith(
      ["Cash"],
      [{ name: "Cash", previousName: "Cash" }],
      [],
    );
  });

  it("closes the merge prompt without removing when dismissed", async () => {
    render(
      <CategoriesDialog
        open
        categories={["Cash", "Investments"]}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[0],
    );
    expect(
      screen.getByRole("dialog", { name: "Apply removed category values?" }),
    ).toBeInTheDocument();

    fireEvent.keyDown(
      screen.getByRole("dialog", { name: "Apply removed category values?" }),
      { key: "Escape", code: "Escape" },
    );

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Apply removed category values?",
        }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByLabelText("Category 1")).toHaveValue("Cash");
    expect(screen.getByLabelText("Category 2")).toHaveValue("Investments");
  });

  it("updates the merge target and labels blank destination rows", async () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash", "Investments"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));
    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[0],
    );

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Category" }));
    // Blank destination row is labeled by its position among remaining options.
    fireEvent.click(screen.getByRole("option", { name: "Category 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Apply removed category values?",
        }),
      ).not.toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText("Category 2"), {
      target: { value: "Home" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      ["Investments", "Home"],
      [
        { name: "Investments", previousName: "Investments" },
        { name: "Home", previousName: undefined },
      ],
      [{ from: "Cash", into: "Home" }],
    );
  });

  it("drops orphaned merges when the destination row is later removed", async () => {
    const onSave = vi.fn();

    render(
      <CategoriesDialog
        open
        categories={["Cash", "Investments", "Home"]}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[0],
    );
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Apply removed category values?",
        }),
      ).not.toBeInTheDocument(),
    );

    // Remove the default merge target (Investments) without merging again.
    fireEvent.click(
      screen.getAllByRole("button", { name: "remove category" })[0],
    );
    fireEvent.click(screen.getByRole("button", { name: "No" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Apply removed category values?",
        }),
      ).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      ["Home"],
      [{ name: "Home", previousName: "Home" }],
      [],
    );
  });
});
