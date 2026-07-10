import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ResumeRoutes from "./Routes";

// Keep route smoke tests focused on routing. Heavy chart pages have dedicated
// tests, and rendering many Highcharts instances makes jsdom cleanup flaky.
vi.mock("./cars/graphs/CarGraphs", () => ({
  default: () => <div data-testid="car-graphs" />,
}));

vi.mock("./f1", () => ({
  default: () => <h1>F1</h1>,
}));

vi.mock("./travel-map", () => ({
  default: () => <h1>Travel</h1>,
}));

const routeCases = [
  { path: "/", heading: "Summary" },
  { path: "/work", heading: "Experience" },
  { path: "/resume", heading: "Resume" },
  { path: "/education", heading: "Education" },
  { path: "/presentations", heading: "Presentations & Hackathons" },
  { path: "/a11y", heading: "A11y Practice" },
  { path: "/comp", heading: "Comp Calculator" },
  { path: "/f1", heading: "F1" },
  { path: "/cars", heading: "Ken's Cars" },
  { path: "/travel", heading: "Travel" },
];

const ROUTE_LOAD_TIMEOUT = 15000;

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
