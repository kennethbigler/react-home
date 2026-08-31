import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RootRoutes from "./Routes";

vi.mock("./resume/Routes", async () => {
  const { Link } = await import("react-router");
  return {
    default: () => <Link to="/work">Work</Link>,
  };
});

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

    const workLink = await screen.findByRole("link", {
      name: "Work",
    });

    expect(scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 0,
      behavior: "auto",
    });

    fireEvent.click(workLink);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledTimes(2);
    });

    scrollTo.mockRestore();
  });
});
