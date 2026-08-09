import { describe, it, expect } from "vitest";
import {
  Misinfo,
  countMisinfoTags,
  getMisinfoForSlug,
} from "./botc-role-misinfo";
import { getRoleBySlug } from "./botc-slug-map";

describe("botc-role-misinfo", () => {
  it("tags Poisoner as evil and poison", () => {
    expect(getMisinfoForSlug("poisoner", "minions")).toEqual([
      Misinfo.Evil,
      Misinfo.Poison,
    ]);
  });

  it("tags Fang Gu with two evil (self + converts Outsider)", () => {
    expect(getMisinfoForSlug("fanggu", "demons")).toEqual([
      Misinfo.Evil,
      Misinfo.Evil,
    ]);
  });

  it("tags Drunk as drunk only", () => {
    expect(getMisinfoForSlug("drunk", "outsiders")).toEqual([Misinfo.Drunk]);
  });

  it("defaults minions and demons to evil when not listed", () => {
    expect(getMisinfoForSlug("assassin", "minions")).toEqual([Misinfo.Evil]);
    expect(getMisinfoForSlug("imp", "demons")).toEqual([Misinfo.Evil]);
  });

  it("defaults townsfolk to no misinfo tags", () => {
    expect(getMisinfoForSlug("washerwoman", "townsfolk")).toEqual([]);
  });

  it("counts duplicate tags", () => {
    expect(
      countMisinfoTags([Misinfo.Evil, Misinfo.Evil, Misinfo.Poison]),
    ).toEqual({
      [Misinfo.Drunk]: 0,
      [Misinfo.Poison]: 1,
      [Misinfo.Madness]: 0,
      [Misinfo.Evil]: 2,
    });
  });
});

describe("botc-slug-map misinfo integration", () => {
  it("includes misinfo on catalog lookups", () => {
    expect(getRoleBySlug("poisoner").misinfo).toEqual([
      Misinfo.Evil,
      Misinfo.Poison,
    ]);
    expect(getRoleBySlug("fortune_teller").misinfo).toEqual([]);
    expect(getRoleBySlug("cook").misinfo).toEqual([]);
  });
});
