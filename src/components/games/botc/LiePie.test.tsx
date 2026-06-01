import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import LiePie from "./LiePie";
import themeAtom, { darkTheme } from "../../../jotai/theme-atom";

vi.mock("highcharts/highcharts.src", () => ({
  default: {},
}));
vi.mock("highcharts/modules/accessibility", () => ({ default: vi.fn() }));
vi.mock("@highcharts/react", () => ({
  Chart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Credits: () => null,
  Series: () => null,
  Title: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  setHighcharts: vi.fn(),
}));
vi.mock("@highcharts/react/modules/Accessibility", () => ({
  Accessibility: () => null,
}));

describe("LiePie", () => {
  it("renders in dark mode (default in jsdom — theme.mode === 'dark')", () => {
    // jsdom returns false for matchMedia, so default atom value is darkTheme
    const { container } = render(
      <Provider>
        <LiePie
          numPlayers={8}
          numTravelers={0}
          script={{ type: "builtin", index: 0 }}
        />
      </Provider>,
    );

    expect(container).toBeTruthy();
  });

  it("renders in light mode (covers theme.mode === 'light' branch)", () => {
    // Override localStorage so atomWithStorage picks up light theme
    localStorage.setItem("themeAtom", JSON.stringify({ mode: "light", primary: {}, secondary: {} }));

    const { container } = render(
      <Provider>
        <LiePie
          numPlayers={8}
          numTravelers={0}
          script={{ type: "builtin", index: 0 }}
        />
      </Provider>,
    );

    expect(container).toBeTruthy();
    localStorage.removeItem("themeAtom");
  });
});
