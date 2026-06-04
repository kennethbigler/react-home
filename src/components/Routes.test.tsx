import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RootRoutes from "./Routes";

vi.mock("./resume/Routes", () => ({
  default: ({ handleNav }: { handleNav: (loc: string) => void }) => (
    <button type="button" onClick={() => handleNav("/education")}>
      Education
    </button>
  ),
}));

vi.mock("./games/Routes", () => ({
  default: () => <div>Games</div>,
}));

describe("components | RootRoutes", () => {
  it("scrolls to the top when navigating between pages", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/"]}>
        <RootRoutes />
      </MemoryRouter>,
    );

    const educationLink = await screen.findByRole("button", {
      name: "Education",
    });

    expect(scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 0,
      behavior: "auto",
    });

    fireEvent.click(educationLink);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledTimes(2);
    });

    scrollTo.mockRestore();
  });
});
