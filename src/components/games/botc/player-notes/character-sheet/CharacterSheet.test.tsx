import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharacterSheet from "./CharacterSheet";
import type { BotCPlayer } from "@/jotai/botc-atom";

const script = { type: "base" as const, index: 1 as const };

const basePlayer: BotCPlayer = {
  name: "Alice",
  roles: [{ name: "Imp", icon: "👹", alignment: "error" }],
  notes: "",
  liar: false,
  used: false,
  exec: false,
  kill: false,
};

const openRolesPopup = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) => {
  await user.click(screen.getByRole("button", { name }));
  await waitFor(() => {
    expect(
      screen.getByRole("dialog", { name: `Roles - ${name}` }),
    ).toBeInTheDocument();
  });
};

describe("CharacterSheet", () => {
  it("opens the roles popup for a player with ordinary roles", async () => {
    const user = userEvent.setup();
    render(
      <CharacterSheet
        isText={true}
        player={basePlayer}
        script={script}
        onNameBlur={vi.fn()}
        onNotesBlur={vi.fn()}
        onRoleClick={vi.fn(() => vi.fn())}
        onStatsToggle={vi.fn(() => vi.fn())}
      />,
    );

    await openRolesPopup(user, "Alice");
    expect(screen.getByLabelText("Player Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
  });

  it("opens the roles popup when the player has no roles", async () => {
    const user = userEvent.setup();
    render(
      <CharacterSheet
        isText={true}
        player={{ ...basePlayer, roles: [] }}
        script={script}
        onNameBlur={vi.fn()}
        onNotesBlur={vi.fn()}
        onRoleClick={vi.fn(() => vi.fn())}
        onStatsToggle={vi.fn(() => vi.fn())}
      />,
    );

    await openRolesPopup(user, "Alice");
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("opens the roles popup when the player is executed", async () => {
    const user = userEvent.setup();
    render(
      <CharacterSheet
        isText={true}
        player={{ ...basePlayer, exec: true }}
        script={script}
        onNameBlur={vi.fn()}
        onNotesBlur={vi.fn()}
        onRoleClick={vi.fn(() => vi.fn())}
        onStatsToggle={vi.fn(() => vi.fn())}
      />,
    );

    await openRolesPopup(user, "Alice");
  });

  it("opens the roles popup when the player is killed", async () => {
    const user = userEvent.setup();
    render(
      <CharacterSheet
        isText={true}
        player={{ ...basePlayer, kill: true }}
        script={script}
        onNameBlur={vi.fn()}
        onNotesBlur={vi.fn()}
        onRoleClick={vi.fn(() => vi.fn())}
        onStatsToggle={vi.fn(() => vi.fn())}
      />,
    );

    await openRolesPopup(user, "Alice");
  });
});
