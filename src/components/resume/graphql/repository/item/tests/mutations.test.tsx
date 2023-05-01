import { vi } from "vitest";
import { updateWatch } from "../WatchRepository";
import { updateAddStar } from "../StarRepository";
import { updateRemoveStar } from "../UnstarRepository";

describe("resume | graphql | mutations", () => {
  test("updateWatch", () => {
    const readFragment = vi
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ watchers: { totalCount: 68 } });
    const writeFragment = vi.fn();
    const cache = {
      readFragment,
      writeFragment,
    };
    // @ts-expect-error: mocking for tests
    expect(updateWatch(cache, { data: undefined })).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(0);
    expect(writeFragment).toHaveBeenCalledTimes(0);
    expect(
      // @ts-expect-error: mocking for tests
      updateWatch(cache, {
        data: {
          updateSubscription: {
            subscribable: { id: 42, viewerSubscription: 69 },
          },
        },
      })
    ).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(1);
    expect(writeFragment).toHaveBeenCalledTimes(0);
    expect(
      // @ts-expect-error: mocking for tests
      updateWatch(cache, {
        data: {
          updateSubscription: {
            subscribable: { id: 42, viewerSubscription: 69 },
          },
        },
      })
    ).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(2);
    expect(writeFragment).toHaveBeenCalledTimes(1);
  });

  test("updateAddStar", () => {
    const readFragment = vi
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ stargazers: { totalCount: 68 } });
    const writeFragment = vi.fn();
    const cache = {
      readFragment,
      writeFragment,
    };
    // @ts-expect-error: mocking for tests
    expect(updateAddStar(cache, { data: undefined })).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(0);
    expect(writeFragment).toHaveBeenCalledTimes(0);
    expect(
      // @ts-expect-error: mocking for tests
      updateAddStar(cache, { data: { addStar: { starrable: { id: 42 } } } })
    ).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(1);
    expect(writeFragment).toHaveBeenCalledTimes(0);
    expect(
      // @ts-expect-error: mocking for tests
      updateAddStar(cache, { data: { addStar: { starrable: { id: 42 } } } })
    ).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(2);
    expect(writeFragment).toHaveBeenCalledTimes(1);
  });

  test("updateRemoveStar", () => {
    const readFragment = vi
      .fn()
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ stargazers: { totalCount: 68 } });
    const writeFragment = vi.fn();
    const cache = {
      readFragment,
      writeFragment,
    };
    // @ts-expect-error: mocking for tests
    expect(updateRemoveStar(cache, { data: undefined })).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(0);
    expect(writeFragment).toHaveBeenCalledTimes(0);
    expect(
      // @ts-expect-error: mocking for tests
      updateRemoveStar(cache, {
        data: { removeStar: { starrable: { id: 42 } } },
      })
    ).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(1);
    expect(writeFragment).toHaveBeenCalledTimes(0);
    expect(
      // @ts-expect-error: mocking for tests
      updateRemoveStar(cache, {
        data: { removeStar: { starrable: { id: 42 } } },
      })
    ).toBeUndefined();
    expect(readFragment).toHaveBeenCalledTimes(2);
    expect(writeFragment).toHaveBeenCalledTimes(1);
  });
});
