import "../../common/highcharts/tests/highchartsMocks";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { green, indigo } from "@mui/material/colors";
import LiePie from "./LiePie";

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

  it("renders demon selection for S&V", async () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <LiePie
          numPlayers={10}
          numTravelers={0}
          script={{ type: "base", index: 1 }}
        />
      </Provider>,
    );

    expect(
      screen.getByRole("group", { name: "Demon in play" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Fang Gu/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Vortox/i })).toBeInTheDocument();

    const fangGuButton = screen.getByRole("button", { name: /Fang Gu/i });
    const vortoxButton = screen.getByRole("button", { name: /Vortox/i });
    expect(fangGuButton).toHaveAttribute("aria-pressed", "true");
    expect(vortoxButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(vortoxButton);
    expect(vortoxButton).toHaveAttribute("aria-pressed", "true");
    expect(fangGuButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(fangGuButton);
    expect(fangGuButton).toHaveAttribute("aria-pressed", "true");
    expect(vortoxButton).toHaveAttribute("aria-pressed", "false");

    const user = userEvent.setup();
    vortoxButton.focus();
    await user.keyboard("{Enter}");
    expect(vortoxButton).toHaveAttribute("aria-pressed", "true");
    expect(fangGuButton).toHaveAttribute("aria-pressed", "false");
  });
});
