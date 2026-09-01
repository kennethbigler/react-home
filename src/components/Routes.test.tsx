import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RootRoutes from "./Routes";

// Keep route smoke tests focused on routing. Heavy chart pages have dedicated
// tests, and rendering many Highcharts instances makes jsdom cleanup flaky.
vi.mock("./resume/cars/graphs/CarGraphs", () => ({
  default: () => <div data-testid="car-graphs" />,
}));

vi.mock("./resume/f1", () => ({
  default: () => <h1>F1</h1>,
}));

vi.mock("./resume/travel-map", () => ({
  default: () => <h1>Travel</h1>,
}));

const routeCases = [
  { path: "/", heading: "Summary" },
  { path: "/work", heading: "Experience" },
  { path: "/resume", heading: "Resume" },
  { path: "/presentations", heading: "Presentations & Hackathons" },
  { path: "/finances", heading: "Finances" },
  { path: "/f1", heading: "F1" },
  { path: "/cars", heading: "Ken's Cars" },
  { path: "/travel", heading: "Travel" },
  { path: "/games", heading: "Games" },
  // catch-all routes redirect to the section home
  { path: "/no-such-page", heading: "Summary" },
  { path: "/games/no-such-game", heading: "Games" },
];

const ROUTE_LOAD_TIMEOUT = 15000;

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <RootRoutes />
    </MemoryRouter>,
  );

describe("components | RootRoutes", () => {
  it.each(routeCases)(
    "loads the $path route",
    async ({ path, heading }) => {
      renderAt(path);

      expect(
        await screen.findByRole(
          "heading",
          { level: 1, name: heading },
          { timeout: ROUTE_LOAD_TIMEOUT },
        ),
      ).toBeInTheDocument();
    },
    ROUTE_LOAD_TIMEOUT,
  );

  it(
    "scrolls to the top when navigating between pages",
    async () => {
      const scrollTo = vi
        .spyOn(window, "scrollTo")
        .mockImplementation(() => {});

      renderAt("/");

      await screen.findByRole(
        "heading",
        { level: 1, name: "Summary" },
        { timeout: ROUTE_LOAD_TIMEOUT },
      );

      expect(scrollTo).toHaveBeenCalledWith({
        left: 0,
        top: 0,
        behavior: "auto",
      });

      // navigate via the drawer menu
      fireEvent.click(screen.getByTitle("Icon Menu Button"));
      fireEvent.click(await screen.findByRole("menuitem", { name: "Work" }));

      await waitFor(() => {
        expect(scrollTo).toHaveBeenCalledTimes(2);
      });

      scrollTo.mockRestore();
    },
    ROUTE_LOAD_TIMEOUT,
  );
});
