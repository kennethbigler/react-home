import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_PREVIEW_ORIGIN,
  PREVIEW_PATHS,
  main,
  previewUrls,
  waitForSpa,
} from "./wait-for-spa.mjs";

describe("scripts | wait-for-spa", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("builds preview URLs from origin and paths", () => {
    expect(previewUrls("http://127.0.0.1:4173", ["/", "/work"])).toEqual([
      "http://127.0.0.1:4173/",
      "http://127.0.0.1:4173/work",
    ]);
  });

  it("includes every scanner path against the default origin", () => {
    const urls = previewUrls();
    expect(urls).toHaveLength(PREVIEW_PATHS.length);
    expect(urls[0]).toBe(`${DEFAULT_PREVIEW_ORIGIN}/`);
    expect(urls).toContain(`${DEFAULT_PREVIEW_ORIGIN}/work`);
    expect(urls).toContain(`${DEFAULT_PREVIEW_ORIGIN}/games/tictactoe`);
  });

  it("uses PREVIEW_ORIGIN when set", () => {
    vi.stubEnv("PREVIEW_ORIGIN", "http://localhost:9999");
    expect(previewUrls()[1]).toBe("http://localhost:9999/work");
  });

  it("prints URLs when --print-urls is passed", async () => {
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    await main(["--print-urls"]);
    expect(write).toHaveBeenCalledWith(
      expect.stringContaining("http://127.0.0.1:4173/work"),
    );
  });

  it("waits for a visible h1 on each URL", async () => {
    const waitFor = vi.fn().mockResolvedValue(undefined);
    const goto = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn().mockResolvedValue(undefined);
    const launchBrowser = vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto,
        locator: vi.fn(() => ({ first: () => ({ waitFor }) })),
      }),
      close,
    });

    await waitForSpa(["http://127.0.0.1:4173/work"], {
      launchBrowser,
      timeout: 1000,
    });

    expect(goto).toHaveBeenCalledWith("http://127.0.0.1:4173/work", {
      waitUntil: "domcontentloaded",
    });
    expect(waitFor).toHaveBeenCalledWith({
      state: "visible",
      timeout: 1000,
    });
    expect(close).toHaveBeenCalled();
  });

  it("closes the browser if waiting for h1 fails", async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const launchBrowser = vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto: vi.fn().mockResolvedValue(undefined),
        locator: vi.fn(() => ({
          first: () => ({
            waitFor: vi.fn().mockRejectedValue(new Error("Timeout")),
          }),
        })),
      }),
      close,
    });

    await expect(
      waitForSpa(["http://127.0.0.1:4173/work"], { launchBrowser }),
    ).rejects.toThrow("Timeout");
    expect(close).toHaveBeenCalled();
  });
});
