import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ScriptSearch from "./ScriptSearch";

// Mock the scripts data to keep tests fast and deterministic
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
        script={0}
        customScript={null}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows 'Trouble Brewing' as the selected value for script=0", () => {
    render(
      <ScriptSearch
        script={0}
        customScript={null}
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
        script={1}
        customScript={null}
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
        script={2}
        customScript={null}
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
        script={3}
        customScript={null}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Other (All Roles)");
  });

  it("shows community script title when script=5 and customScript is set", () => {
    const customScript = {
      pk: 6506,
      title: "The Spy Who Pinged Me",
      author: "Community",
      characters: ["chef", "imp"],
    };

    render(
      <ScriptSearch
        script={5}
        customScript={customScript}
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
        script={0}
        customScript={null}
        onBuiltinChange={noopBuiltin}
        onCommunityChange={noopCommunity}
      />,
    );

    expect(screen.getByLabelText("Script")).toBeInTheDocument();
  });
});
