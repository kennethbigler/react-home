import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import Header from "./Header";

describe("games | imperial-assault | Header", () => {
  it("opens the campaign change dialog when a new campaign is selected", () => {
    renderWithHydratedAtoms(<Header />);

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Campaign" }));
    fireEvent.click(
      screen.getByRole("option", { name: "Twin Shadows Campaign Log" }),
    );

    expect(
      screen.getByText(/Are you sure you want to switch from:/i),
    ).toBeInTheDocument();
  });

  it("saves the selected campaign from the confirmation dialog", async () => {
    renderWithHydratedAtoms(<Header />);

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Campaign" }));
    fireEvent.click(
      screen.getByRole("option", { name: "Twin Shadows Campaign Log" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "New Campaign" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("combobox", { name: "Campaign" }),
    ).toHaveTextContent("Twin Shadows Campaign Log");
  });

  it("closes the campaign change dialog without saving", async () => {
    renderWithHydratedAtoms(<Header />);

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Campaign" }));
    fireEvent.click(
      screen.getByRole("option", { name: "Twin Shadows Campaign Log" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("combobox", { name: "Campaign" }),
    ).toHaveTextContent("Imperial Assault Campaign Log");
  });
});
