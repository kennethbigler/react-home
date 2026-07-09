import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StreamExampleV1 from "./StreamExample";

vi.mock("../stream-helpers/starWarsIntros", () => ({
  default: "Hello world. How are you?",
}));

vi.mock("../stream-helpers/mockTokenStream", () => ({
  default: vi.fn(),
}));

import mockTokenStream from "../stream-helpers/mockTokenStream";

const mockedTokenStream = vi.mocked(mockTokenStream);

function streamFromTokens(tokens: string[]): AsyncIterable<string> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const token of tokens) yield token;
    },
  };
}

function delayedStreamFromTokens(
  tokens: string[],
  pauseAfterIndex: number,
  pauseMs: number,
): AsyncIterable<string> {
  return {
    async *[Symbol.asyncIterator]() {
      for (let i = 0; i < tokens.length; i += 1) {
        yield tokens[i];
        if (i === pauseAfterIndex) {
          await new Promise((resolve) => setTimeout(resolve, pauseMs));
        }
      }
    },
  };
}

const clickStartStream = () => {
  fireEvent.click(screen.getByRole("button", { name: /start stream/i }));
};

describe("resume | a11y-practice | v1 StreamExample", () => {
  let requestAnimationFrameSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    requestAnimationFrameSpy = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0);
        return 0;
      });

    mockedTokenStream.mockImplementation((text: string) =>
      streamFromTokens(text.match(/\S+\s*/g) ?? []),
    );
  });

  afterEach(() => {
    requestAnimationFrameSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("renders start button and empty screen-reader status", () => {
    render(<StreamExampleV1 />);

    expect(screen.getByRole("button", { name: /start stream/i })).toBeEnabled();

    const status = screen.getByRole("status");
    expect(status).toHaveClass("sr-only");
    expect(status).toHaveTextContent("");
  });

  it("does not start streaming until the button is clicked", async () => {
    render(<StreamExampleV1 />);

    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(mockedTokenStream).not.toHaveBeenCalled();

    clickStartStream();

    await waitFor(() => {
      expect(mockedTokenStream).toHaveBeenCalled();
    });
  });

  it("disables the button while streaming and re-enables it when complete", async () => {
    render(<StreamExampleV1 />);

    clickStartStream();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /streaming/i })).toBeDisabled();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /start stream/i }),
      ).toBeEnabled();
    });
  });

  it("announcement node receives chunk, not full accumulated text", async () => {
    mockedTokenStream.mockReturnValue(
      delayedStreamFromTokens(
        ["Hello ", "world. ", "How ", "are ", "you?"],
        1,
        500,
      ),
    );

    render(<StreamExampleV1 />);
    clickStartStream();

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Hello world.");
    });

    expect(screen.getByRole("status")).not.toHaveTextContent("How are you?");
    expect(screen.getByRole("status")).not.toHaveTextContent(
      "Response complete",
    );
  });

  it("announces completion signal when stream ends", async () => {
    render(<StreamExampleV1 />);
    clickStartStream();

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Response complete");
    });
  });

  it("visible content and announced content stay in sync", async () => {
    mockedTokenStream.mockReturnValue(
      delayedStreamFromTokens(
        ["Hello ", "world. ", "How ", "are ", "you?"],
        1,
        500,
      ),
    );

    render(<StreamExampleV1 />);
    clickStartStream();

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Hello world.");
    });

    const visibleAtFirstBoundary = screen
      .getAllByText(/Hello world\./)
      .find((node) => !node.classList.contains("sr-only"));
    expect(visibleAtFirstBoundary).toBeInTheDocument();
    expect(screen.getByRole("status")).not.toHaveTextContent("How are you?");

    await waitFor(() => {
      const visibleWhenComplete = screen
        .getAllByText(/Hello world\. How are you\?/)
        .find((node) => !node.classList.contains("sr-only"));
      expect(visibleWhenComplete).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Response complete");
    });
  });

  it("clears prior content when restarting the stream", async () => {
    render(<StreamExampleV1 />);
    clickStartStream();

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Response complete");
    });

    expect(screen.getByText("Hello world. How are you?")).toBeInTheDocument();

    clickStartStream();

    expect(
      screen.queryByText("Hello world. How are you?"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("");

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Response complete");
    });
  });

  it("stops updating when unmounted during an active stream", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockedTokenStream.mockReturnValue(
      delayedStreamFromTokens(["Hello ", "world. "], 0, 5000),
    );

    const { unmount } = render(<StreamExampleV1 />);
    clickStartStream();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /streaming/i })).toBeDisabled();
    });

    unmount();
    await vi.advanceTimersByTimeAsync(5000);
    vi.useRealTimers();
  });
});
