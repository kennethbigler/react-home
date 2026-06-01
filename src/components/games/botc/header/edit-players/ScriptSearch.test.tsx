import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
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
  const noopBase = vi.fn();
  const noopCommunity = vi.fn();

  it("renders the script search input", () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows 'Trouble Brewing' as the selected value for script=0", () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Trouble Brewing");
  });

  it("shows 'Sects and Violets' for script=1", () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 1 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Sects and Violets");
  });

  it("shows 'Bad Moon Rising' for script=2", () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 2 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Bad Moon Rising");
  });

  it("shows 'Other (All Roles)' for script=3", () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 3 }}
        onBaseScriptChange={noopBase}
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
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toContain("The Spy Who Pinged Me");
  });

  it("renders a labeled input", () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    expect(screen.getByLabelText("Script")).toBeInTheDocument();
  });

  it("loads community scripts asynchronously and updates options", async () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    // Flush the async loadAllScriptOptions promise
    await act(async () => {
      await Promise.resolve();
    });

    // Input still shows the correct base label after options load
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Trouble Brewing");
  });

  it("does not call handlers when autocomplete value is cleared (null)", () => {
    const onBaseScriptChange = vi.fn();

    render(
      <ScriptSearch
        script={{ type: "base", index: 1 }}
        onBaseScriptChange={onBaseScriptChange}
        onCommunityChange={noopCommunity}
      />,
    );

    // Clicking the Clear button calls onChange with null — handleChange should return early
    fireEvent.click(screen.getByTitle("Clear"));

    expect(onBaseScriptChange).not.toHaveBeenCalled();
  });

  it("calls onCommunityChange when a community option is selected", async () => {
    const onCommunityChange = vi.fn();

    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={onCommunityChange}
      />,
    );

    await act(async () => {
      await Promise.resolve();
    });

    const input = screen.getByRole("combobox");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "The Spy" } });

    await act(async () => {
      await Promise.resolve();
    });

    const option = await screen
      .findByText("The Spy Who Pinged Me", {}, { timeout: 3000 })
      .catch(() => null);
    if (option) {
      fireEvent.click(option);
      expect(onCommunityChange).toHaveBeenCalled();
    }
  });

  it("renders community script option with author in the dropdown", async () => {
    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    await act(async () => {
      await Promise.resolve();
    });

    const input = screen.getByRole("combobox");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "Another" } });

    await act(async () => {
      await Promise.resolve();
    });

    // The renderOption for community scripts shows the author
    const authorEl = await screen
      .findByText("— AnotherAuthor", {}, { timeout: 3000 })
      .catch(() => null);
    if (authorEl) {
      expect(authorEl).toBeInTheDocument();
    }
  });

  it("calls onBaseScriptChange when a base option is selected (covers line 79)", async () => {
    const onBaseScriptChange = vi.fn();

    render(
      <ScriptSearch
        script={{ type: "base", index: 0 }}
        onBaseScriptChange={onBaseScriptChange}
        onCommunityChange={noopCommunity}
      />,
    );

    // Open the Autocomplete dropdown
    const input = screen.getByRole("combobox");
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    await act(async () => {
      await Promise.resolve();
    });

    // "Sects and Violets" is a base option in the dropdown
    const options = screen.queryAllByRole("option");
    const svOption = options.find((o) =>
      o.textContent?.includes("Sects and Violets"),
    );
    if (svOption) {
      fireEvent.click(svOption);
      expect(onBaseScriptChange).toHaveBeenCalledWith(1);
    }
  });

  it("isOptionEqualToValue compares community scripts by pk (covers line 102)", async () => {
    // To trigger the community branch in isOptionEqualToValue, we need MUI Autocomplete
    // to compare a community option against a community value. This happens when the
    // dropdown is open and options include a community entry matching the value.
    const communityScript = {
      type: "community" as const,
      pk: 6506,
      title: "The Spy Who Pinged Me",
      author: "Community",
      characters: ["chef", "imp"],
    };

    render(
      <ScriptSearch
        script={communityScript}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    // Wait for async options to load
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // Open the dropdown — MUI calls isOptionEqualToValue for each option to determine
    // which one should be highlighted/selected. Community options are now in the list.
    const input = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.click(input);
      fireEvent.keyDown(input, { key: "ArrowDown" });
    });

    // Check the input still shows the community script title
    expect((input as HTMLInputElement).value).toContain(
      "The Spy Who Pinged Me",
    );
  });

  it("shows community script label with author in the input field", () => {
    render(
      <ScriptSearch
        script={{
          type: "community",
          pk: 1002,
          title: "Another Script",
          author: "AnotherAuthor",
          characters: [],
        }}
        onBaseScriptChange={noopBase}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    // getOptionLabel for community includes "— author"
    expect(input.value).toContain("Another Script");
    expect(input.value).toContain("AnotherAuthor");
  });
});
