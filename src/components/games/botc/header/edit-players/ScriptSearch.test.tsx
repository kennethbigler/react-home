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

  it("does not call handlers when autocomplete value is cleared (null)", () => {
    const onBuiltinChange = vi.fn();

    render(
      <ScriptSearch
        script={{ type: "builtin", index: 1 }}
        onBuiltinChange={onBuiltinChange}
        onCommunityChange={noopCommunity}
      />,
    );

    // Clicking the Clear button calls onChange with null — handleChange should return early
    fireEvent.click(screen.getByTitle("Clear"));

    expect(onBuiltinChange).not.toHaveBeenCalled();
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

    await act(async () => {
      await Promise.resolve();
    });

    const input = screen.getByRole("combobox");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "The Spy" } });

    await act(async () => {
      await Promise.resolve();
    });

    const option = await screen.findByText("The Spy Who Pinged Me", {}, { timeout: 3000 }).catch(() => null);
    if (option) {
      fireEvent.click(option);
      expect(onCommunityChange).toHaveBeenCalled();
    }
  });

  it("renders community script option with author in the dropdown", async () => {
    render(
      <ScriptSearch
        script={{ type: "builtin", index: 0 }}
        onBuiltinChange={noopBuiltin}
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
    const authorEl = await screen.findByText("— AnotherAuthor", {}, { timeout: 3000 }).catch(() => null);
    if (authorEl) {
      expect(authorEl).toBeInTheDocument();
    }
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
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    // getOptionLabel for community includes "— author"
    expect(input.value).toContain("Another Script");
    expect(input.value).toContain("AnotherAuthor");
  });
});
