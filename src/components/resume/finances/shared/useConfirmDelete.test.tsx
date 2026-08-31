import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useConfirmDelete from "./useConfirmDelete";

describe("resume | finances | shared | useConfirmDelete", () => {
  it("starts closed and opens on request", () => {
    const { result } = renderHook(() => useConfirmDelete(vi.fn()));

    expect(result.current.open).toBe(false);

    act(() => result.current.request());
    expect(result.current.open).toBe(true);
  });

  it("closes on cancel without deleting", () => {
    const onDelete = vi.fn();
    const { result } = renderHook(() => useConfirmDelete(onDelete));

    act(() => result.current.request());
    act(() => result.current.cancel());

    expect(result.current.open).toBe(false);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes and closes on confirm", () => {
    const onDelete = vi.fn();
    const { result } = renderHook(() => useConfirmDelete(onDelete));

    act(() => result.current.request());
    act(() => result.current.confirm());

    expect(result.current.open).toBe(false);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
