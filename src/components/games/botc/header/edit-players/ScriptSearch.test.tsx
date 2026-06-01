import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ScriptSearch from "./ScriptSearch";

// Mock the scripts data to keep tests fast and deterministic
// The JSON is lazy-loaded via dynamic import; Vitest intercepts it the same way
vi.mock("../../../../../data/botc-scripts.json", () => ({
  default: {
    scripts: [
      {
        pk: 6506,
        title: "The Spy Who Pinged Me",
        author: "Community",
        characters: ["chef", "imp"],
      },
      {
        pk: 1002,
        title: "Another Script",
        author: "AnotherAuthor",
        characters: ["washerwoman", "drunk", "poisoner", "imp"],
      },
    ],
  },
}));

describe("ScriptSearch", () => {
  const noopBuiltin = vi.fn();
  const noopCommunity = vi.fn();

  it("renders the script search input", () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows 'Trouble Brewing' as the selected value for script=0", () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Trouble Brewing");
  });

  it("shows 'Sects and Violets' for script=1", () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 1 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Sects and Violets");
  });

  it("shows 'Bad Moon Rising' for script=2", () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 2 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Bad Moon Rising");
  });

  it("shows 'Other (All Roles)' for script=3", () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 3 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Other (All Roles)");
  });

  it("shows community script title when script is community type", () => {
    render(
      <ScriptSearch
        script={{
          type: "community",
          pk: 6506,
          title: "The Spy Who Pinged Me",
          author: "Community",
          characters: ["chef", "imp"],
        }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toContain("The Spy Who Pinged Me");
  });

  it("renders a labeled input", () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    expect(screen.getByLabelText("Script")).toBeInTheDocument();
  });

  it("loads community scripts asynchronously and updates options", async () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    // Flush the async loadAllScriptOptions promise
    await act(async () => {
      await Promise.resolve();
    });

    // Input still shows the correct builtin label after options load
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Trouble Brewing");
  });

  it("calls onBuiltinChange when a builtin option is selected", async () => {
    const onBuiltinChange = vi.fn();

    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={onBuiltinChange}
        onCommunityChange={noopCommunity}
      />,
    );

    // Wait for async options load
    await act(async () => {
      await Promise.resolve();
    });

    // MUI Autocomplete opens via mouseDown on the popup indicator button
    fireEvent.mouseDown(screen.getByTitle("Open"));

    // Wait for the listbox to appear
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    const svOption = screen.getByRole("option", { name: /Sects and Violets/ });
    fireEvent.click(svOption);

    expect(onBuiltinChange).toHaveBeenCalledWith(1);
  });

  it("calls onCommunityChange when a community option is selected", async () => {
    const onCommunityChange = vi.fn();

    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={onCommunityChange}
      />,
    );

    // Wait for async options load
    await act(async () => {
      await Promise.resolve();
    });

    // MUI Autocomplete opens via mouseDown on the popup indicator button
    fireEvent.mouseDown(screen.getByTitle("Open"));

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    // Find the community script option
    const spyOption = screen.getByRole("option", {
      name: /The Spy Who Pinged Me/,
    });
    fireEvent.click(spyOption);

    expect(onCommunityChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: "community", pk: 6506 }),
    );
  });
});
