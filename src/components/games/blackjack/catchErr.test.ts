import { vi, describe, it, expect, afterEach } from "vitest";
import { catchErr } from "./catchErr";

describe("blackjack | catchErr", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

  afterEach(() => {
    consoleError.mockClear();
  });

  it("calls console.error with the provided value", () => {
    const error = new Error("test error");
    catchErr(error);
    expect(consoleError).toHaveBeenCalledWith(error);
  });

  it("handles non-Error values", () => {
    catchErr("string error");
    expect(consoleError).toHaveBeenCalledWith("string error");
  });

  it("handles unknown rejection values", () => {
    catchErr(undefined);
    expect(consoleError).toHaveBeenCalledWith(undefined);
  });
});
