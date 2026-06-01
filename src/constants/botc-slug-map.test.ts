import { describe, it, expect } from "vitest";
import {
  normalizeSlug,
  getRoleBySlug,
  isKnownSlug,
  unknownRoleEntry,
} from "./botc-slug-map";

describe("botc-slug-map", () => {
  describe("normalizeSlug", () => {
    it("lowercases input", () => {
      expect(normalizeSlug("Washerwoman")).toBe("washerwoman");
    });

    it("strips underscores", () => {
      expect(normalizeSlug("fortune_teller")).toBe("fortuneteller");
      expect(normalizeSlug("snake_charmer")).toBe("snakecharmer");
      expect(normalizeSlug("tea_lady")).toBe("tealady");
      expect(normalizeSlug("town_crier")).toBe("towncrier");
      expect(normalizeSlug("high_priestess")).toBe("highpriestess");
      expect(normalizeSlug("scarlet_woman")).toBe("scarletwoman");
      expect(normalizeSlug("evil_twin")).toBe("eviltwin");
      expect(normalizeSlug("fang_gu")).toBe("fanggu");
      expect(normalizeSlug("no_dashii")).toBe("nodashii");
      expect(normalizeSlug("lil_monsta")).toBe("lilmonsta");
    });

    it("strips hyphens", () => {
      expect(normalizeSlug("pit-hag")).toBe("pithag");
      expect(normalizeSlug("al-hadikhia")).toBe("alhadikhia");
    });

    it("handles mixed separators", () => {
      expect(normalizeSlug("village_idiot")).toBe("villageidiot");
    });

    it("leaves already-normalized slugs unchanged", () => {
      expect(normalizeSlug("imp")).toBe("imp");
      expect(normalizeSlug("chef")).toBe("chef");
    });
  });

  describe("getRoleBySlug", () => {
    it("resolves a simple slug", () => {
      const entry = getRoleBySlug("washerwoman");
      expect(entry.role.name).toBe("Washerwoman");
      expect(entry.roleType).toBe("townsfolk");
    });

    it("resolves underscore-separated slugs (fortune_teller)", () => {
      const entry = getRoleBySlug("fortune_teller");
      expect(entry.role.name).toBe("Fortune Teller");
      expect(entry.roleType).toBe("townsfolk");
    });

    it("resolves concatenated slug (fortuneteller)", () => {
      const entry = getRoleBySlug("fortuneteller");
      expect(entry.role.name).toBe("Fortune Teller");
      expect(entry.roleType).toBe("townsfolk");
    });

    it("resolves hyphen slug (pit-hag)", () => {
      const entry = getRoleBySlug("pit-hag");
      expect(entry.role.name).toBe("Pit-Hag");
      expect(entry.roleType).toBe("minions");
    });

    it("resolves al-hadikhia demon", () => {
      const entry = getRoleBySlug("al-hadikhia");
      expect(entry.role.name).toBe("Al-Hadikhia");
      expect(entry.roleType).toBe("demons");
    });

    it("resolves fang_gu demon", () => {
      const entry = getRoleBySlug("fang_gu");
      expect(entry.role.name).toBe("Fang Gu");
      expect(entry.roleType).toBe("demons");
    });

    it("resolves a traveler (bone_collector)", () => {
      const entry = getRoleBySlug("bone_collector");
      expect(entry.role.name).toBe("Bone Collector");
      expect(entry.roleType).toBe("travelers");
    });

    it("resolves an outsider (plague_doctor)", () => {
      const entry = getRoleBySlug("plague_doctor");
      expect(entry.role.name).toBe("Plague Doctor");
      expect(entry.roleType).toBe("outsiders");
    });

    it("resolves scarlet_woman and scarletwoman to the same role", () => {
      const a = getRoleBySlug("scarlet_woman");
      const b = getRoleBySlug("scarletwoman");
      expect(a.role.name).toBe(b.role.name);
    });

    it("returns a placeholder for unknown slugs", () => {
      const entry = getRoleBySlug("cook");
      expect(entry.role.name).toContain("Unknown");
      expect(entry.role.icon).toBe("❓");
      expect(entry.roleType).toBe("townsfolk");
    });

    it("returns a placeholder for homebrew slugs", () => {
      const entry = getRoleBySlug("devilsavocado_smr");
      expect(entry.role.name).toContain("Unknown");
    });
  });

  describe("isKnownSlug", () => {
    it("returns true for known slugs", () => {
      expect(isKnownSlug("washerwoman")).toBe(true);
      expect(isKnownSlug("fortune_teller")).toBe(true);
      expect(isKnownSlug("pit-hag")).toBe(true);
      expect(isKnownSlug("al-hadikhia")).toBe(true);
    });

    it("returns false for unknown slugs", () => {
      expect(isKnownSlug("cook")).toBe(false);
      expect(isKnownSlug("alice_duchess")).toBe(false);
      expect(isKnownSlug("devilsavocado_smr")).toBe(false);
    });
  });

  describe("unknownRoleEntry", () => {
    it("creates a placeholder with the original slug in the name", () => {
      const entry = unknownRoleEntry("my_homebrew_role");
      expect(entry.role.name).toBe("Unknown: my_homebrew_role");
      expect(entry.role.icon).toBe("❓");
      expect(entry.roleType).toBe("townsfolk");
    });
  });
});
