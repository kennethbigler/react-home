import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { green, indigo } from "@mui/material/colors";
import LiePie from "./LiePie";

vi.mock("highcharts/highcharts.src", () => ({
  default: {},
}));
vi.mock("highcharts/modules/accessibility", () => ({ default: vi.fn() }));
vi.mock("@highcharts/react", () => ({
  Chart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Credits: () => null,
  Series: () => null,
  Title: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  setHighcharts: vi.fn(),
}));
vi.mock("@highcharts/react/modules/Accessibility", () => ({
  Accessibility: () => null,
}));

// Use a plain writable atom so tests can control theme.mode deterministically.
// atomWithStorage caches at module level and ignores per-store overrides.
// The atom must be created inside the factory (hoisted) using require.
vi.mock("../../../jotai/theme-atom", async () => {
  const { atom: jotaiAtom } = await import("jotai");
  const { teal, green } = await import("@mui/material/colors");
  return {
    default: jotaiAtom({ mode: "dark", primary: teal, secondary: green }),
    lightTheme: {
      mode: "light",
      primary: {},
      secondary: {},
    },
  };
});

// Import themeAtom AFTER the mock so we get the mocked atom instance
import themeAtom from "../../../jotai/theme-atom";

describe("LiePie", () => {
  it("renders in dark mode (theme.mode === 'dark')", () => {
    const store = createStore();
    // Store reads the default value (dark) from the atom
    render(
      <Provider store={store}>
        <LiePie
          numPlayers={8}
          numTravelers={0}
          script={{ type: "base", index: 0 }}
        />
      </Provider>,
    );

    expect(screen.getByText("Who is lying?")).toBeInTheDocument();
  });

  it("renders in light mode (covers theme.mode === 'light' branch at line 50)", () => {
    // Override to lightTheme — LiePie reads this and evaluates
    // `theme.mode === "light" ? "black" : "white"` → "black"
    const store = createStore();
    store.set(themeAtom, { mode: "light", primary: indigo, secondary: green });

    render(
      <Provider store={store}>
        <LiePie
          numPlayers={8}
          numTravelers={0}
          script={{ type: "base", index: 0 }}
        />
      </Provider>,
    );

    expect(screen.getByText("Who is lying?")).toBeInTheDocument();
  });
});
