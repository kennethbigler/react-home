import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import generationAtom from "@/jotai/type-checker-atom";
import TypeChecker from ".";

const renderLatest = () =>
  renderWithHydratedAtoms(<TypeChecker />, [[generationAtom, 9]]);

const chooseGeneration = (label: string) => {
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Generation" }));
  fireEvent.click(
    within(screen.getByRole("listbox")).getByRole("option", { name: label }),
  );
};

describe("resume | type-checker", () => {
  it("renders as expected", () => {
    renderWithHydratedAtoms(<TypeChecker />);

    expect(screen.getByText("Type Checker")).toBeInTheDocument();
  });

  it("defaults to Generation III", () => {
    renderWithHydratedAtoms(<TypeChecker />);

    expect(
      screen.getByRole("combobox", { name: "Generation" }),
    ).toHaveTextContent("Generation III");
    expect(screen.getAllByText("steel")).toHaveLength(2);
    expect(screen.getAllByText("dark")).toHaveLength(2);
    expect(screen.queryByText("fairy")).not.toBeInTheDocument();
  });

  it("switches the grid by generation", () => {
    const { store } = renderWithHydratedAtoms(<TypeChecker />);

    chooseGeneration("Generation I");
    expect(store.get(generationAtom)).toBe(1);
    expect(screen.queryByText("steel")).not.toBeInTheDocument();
    expect(screen.queryByText("dark")).not.toBeInTheDocument();
    expect(screen.getAllByText("ghost")).toHaveLength(2);

    chooseGeneration("Generation VI");
    expect(store.get(generationAtom)).toBe(6);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
  });

  it("resets filters when the generation changes", () => {
    renderWithHydratedAtoms(<TypeChecker />);

    fireEvent.click(screen.getAllByText("dragon")[0]);
    expect(
      screen.getByRole("combobox", { name: "Secondary Type" }),
    ).toBeInTheDocument();

    chooseGeneration("Generation II");
    expect(
      screen.queryByRole("combobox", { name: "Secondary Type" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("fire")).toHaveLength(2);
  });

  it("sorts by row", () => {
    renderLatest();

    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("steel")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
    // filter by dragon by clicking the side button
    fireEvent.click(screen.getAllByText("dragon")[1]);
    // dragon should show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    // while other buttons only appear once
    expect(screen.getByText("steel")).toBeInTheDocument();
    expect(screen.getByText("fairy")).toBeInTheDocument();
    // reset filters by clicking side button again
    fireEvent.click(screen.getAllByText("dragon")[1]);
    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("steel")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
  });

  it("sorts by column", () => {
    renderLatest();

    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("fire")).toHaveLength(2);
    expect(screen.getAllByText("water")).toHaveLength(2);
    expect(screen.getAllByText("grass")).toHaveLength(2);
    expect(screen.getAllByText("electric")).toHaveLength(2);
    expect(screen.getAllByText("ice")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
    // filter by dragon by clicking the side button
    fireEvent.click(screen.getAllByText("dragon")[0]);
    // dragon should show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    // while other buttons only appear once
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
    expect(screen.getByText("ice")).toBeInTheDocument();
    expect(screen.getByText("fairy")).toBeInTheDocument();

    // reset filters by clicking side button again
    fireEvent.click(screen.getAllByText("dragon")[0]);
    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("fire")).toHaveLength(2);
    expect(screen.getAllByText("water")).toHaveLength(2);
    expect(screen.getAllByText("grass")).toHaveLength(2);
    expect(screen.getAllByText("electric")).toHaveLength(2);
    expect(screen.getAllByText("ice")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
  });
});
