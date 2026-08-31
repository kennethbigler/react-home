import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerNotes from "./PlayerNotes";
import type { BotCPlayer, BotCRole } from "@/jotai/botc-atom";

const mockGetRandomPlayer = vi.fn();
const mockUpdateRoles =
  vi.fn<(i: number) => (role: BotCRole, selected: boolean) => () => void>();

const mockPlayers: BotCPlayer[] = [
  {
    name: "Alice",
    roles: [
      { name: "Imp", icon: "👹", alignment: "error" },
      { name: "Monk", icon: "✝️", alignment: "info" },
    ],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
  {
    name: "Bob",
    roles: [{ name: "Washerwoman", icon: "🧺", alignment: "info" }],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  },
];

vi.mock("../useBotC", () => ({
  usePlayerNotes: vi.fn(),
}));

import { usePlayerNotes } from "../useBotC";

const mockedUsePlayerNotes = vi.mocked(usePlayerNotes);

describe("PlayerNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateRoles.mockImplementation(() => (_role, _selected) => vi.fn());

    mockedUsePlayerNotes.mockReturnValue({
      botcPlayers: mockPlayers,
      getRandomPlayer: mockGetRandomPlayer,
      randomPlayer: null,
      updateNames: vi.fn(() => vi.fn()),
      updateNotes: vi.fn(() => vi.fn()),
      updateRoles: mockUpdateRoles,
      updateStats: vi.fn(() => vi.fn()),
    });
  });

  it("activates Random via keyboard and calls getRandomPlayer", async () => {
    const user = userEvent.setup();
    render(
      <PlayerNotes
        isText={true}
        playerCount={2}
        script={{ type: "base", index: 0 }}
      />,
    );

    const randomButton = screen.getByRole("button", { name: /Random/i });
    randomButton.focus();
    await user.keyboard("{Enter}");

    expect(mockGetRandomPlayer).toHaveBeenCalledTimes(1);
  });

  it("deletes a role chip when multiple roles are present", async () => {
    const user = userEvent.setup();
    const removeRole = vi.fn();
    mockUpdateRoles.mockImplementation(
      () => (_role, selected) => (selected ? removeRole : vi.fn()),
    );

    render(
      <PlayerNotes
        isText={true}
        playerCount={1}
        script={{ type: "base", index: 0 }}
      />,
    );

    const impChip = screen.getByRole("button", { name: "Imp" });
    await user.click(impChip);
    await user.keyboard("{Backspace}");

    expect(mockUpdateRoles).toHaveBeenCalledWith(0);
    expect(removeRole).toHaveBeenCalledTimes(1);
  });

  it("exposes accessible names for role chips in text and icon modes", () => {
    mockUpdateRoles.mockImplementation(() => (_role, _selected) => vi.fn());
    const { rerender } = render(
      <PlayerNotes
        isText={true}
        playerCount={1}
        script={{ type: "base", index: 0 }}
      />,
    );

    expect(screen.getByRole("button", { name: "Imp" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Monk" })).toBeInTheDocument();

    rerender(
      <PlayerNotes
        isText={false}
        playerCount={1}
        script={{ type: "base", index: 0 }}
      />,
    );

    expect(screen.getByRole("button", { name: "Imp" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Monk" })).toBeInTheDocument();
  });
});
