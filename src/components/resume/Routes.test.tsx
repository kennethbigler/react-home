import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ResumeRoutes from "./Routes";

// Keep this route smoke test focused on routing. The Cars page has dedicated
// tests, and rendering several Highcharts instances makes jsdom cleanup flaky.
vi.mock("./cars/graphs/CarGraphs", () => ({
  default: () => <div data-testid="car-graphs" />,
}));

const routeCases = [
  { path: "/", heading: "Summary" },
  { path: "/work", heading: "Experience" },
  { path: "/resume", heading: "Resume" },
  { path: "/education", heading: "Education" },
  { path: "/presentations", heading: "Presentations & Hackathons" },
  { path: "/comp", heading: "Comp Calculator" },
  { path: "/f1", heading: "F1" },
  { path: "/cars", heading: "Ken's Cars" },
  { path: "/travel", heading: "Travel" },
];

const ROUTE_LOAD_TIMEOUT = 90000;

describe("resume | Routes", () => {
  it.each(routeCases)(
    "loads the $path route",
    async ({ path, heading }) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <ResumeRoutes handleNav={vi.fn()} />
        </MemoryRouter>,
      );

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
});
