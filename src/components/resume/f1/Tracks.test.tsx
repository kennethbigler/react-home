import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

describe("resume | f1 | Tracks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Freeze "today" so next-race selection (computed at module load) is stable.
    // After Spa (2026-07-19), before Hungaroring (2026-07-26).
    vi.setSystemTime(new Date(2026, 6, 20));
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderTracks = async () => {
    const { default: Tracks } = await import("./Tracks");
    return render(<Tracks />);
  };

  it("renders the current and past track sections", async () => {
    await renderTracks();

    expect(screen.getByText("2026 Tracks")).toBeInTheDocument();
    expect(screen.getByText("Past Tracks")).toBeInTheDocument();
  });

  it("renders a track marked as next with its circuit name visible", async () => {
    await renderTracks();

    expect(
      screen.getByRole("button", {
        name: /Hungaroring, Budapest, Hungary circuit details, next race/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Circuit de Spa-Francorchamps, Belgium"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Circuit de Spa-Francorchamps, Belgium circuit details, next race/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps Hungaroring as next on race day and out of Past Tracks", async () => {
    vi.setSystemTime(new Date(2026, 6, 26));
    vi.resetModules();
    await renderTracks();

    expect(
      screen.getByRole("button", {
        name: /Hungaroring, Budapest, Hungary circuit details, next race/i,
      }),
    ).toBeInTheDocument();
    // Appears once under 2026 Tracks — never in the static Past Tracks list.
    expect(screen.getAllByText("Hungaroring, Budapest, Hungary")).toHaveLength(
      1,
    );
  });

  it("renders a track marked as skipped with its circuit name visible", async () => {
    await renderTracks();

    expect(
      screen.getByRole("button", {
        name: /Bahrain International Circuit, Sakhir circuit details, skipped/i,
      }),
    ).toBeInTheDocument();
  });
});
