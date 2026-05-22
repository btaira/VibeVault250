import { describe, it, expect } from "vitest";
import {
  pickWeightedCategory,
  pickShuffleSequence,
  pickWeightedProject,
} from "@/lib/randomizer";
import { PROJECTS } from "@/data/projects";
import type { CategoryId } from "@/lib/types";

const VALID_CATEGORIES: CategoryId[] = [
  "saas",
  "creative",
  "utility",
  "social",
  "deeptech",
];

const zeroScores: Record<CategoryId, number> = {
  saas: 0,
  creative: 0,
  utility: 0,
  social: 0,
  deeptech: 0,
};

// Deterministic RNG helpers
const always = (n: number) => () => n;
const seq = (...vals: number[]) => {
  let i = 0;
  return () => vals[i++] ?? 0.5;
};

describe("pickWeightedCategory", () => {
  it("returns a valid CategoryId", () => {
    const { categoryId } = pickWeightedCategory(zeroScores);
    expect(VALID_CATEGORIES).toContain(categoryId);
  });

  it('returns "weighted" or "discovery" mode', () => {
    const { mode } = pickWeightedCategory(zeroScores);
    expect(["weighted", "discovery"]).toContain(mode);
  });

  it("does not throw with all-zero scores", () => {
    expect(() => pickWeightedCategory(zeroScores)).not.toThrow();
  });

  it("returns discovery mode when rng < 0.2", () => {
    const { mode } = pickWeightedCategory(zeroScores, always(0.1));
    expect(mode).toBe("discovery");
  });

  it("returns weighted mode when rng >= 0.2", () => {
    // First call decides discovery vs weighted; subsequent calls pick the category
    const { mode } = pickWeightedCategory(zeroScores, seq(0.5, 0.1));
    expect(mode).toBe("weighted");
  });

  it("heavily biased scores favour the dominant category", () => {
    const biased: Record<CategoryId, number> = {
      saas: 1000,
      creative: 0,
      utility: 0,
      social: 0,
      deeptech: 0,
    };
    // Force weighted mode, then pick near-zero → first (highest-weight) category wins
    const { categoryId } = pickWeightedCategory(biased, seq(0.9, 0.0001));
    expect(categoryId).toBe("saas");
  });

  it("discovery mode with all-zero scores returns a valid category", () => {
    // rng = 0.1 forces discovery; subsequent call picks from tied-minimum bucket
    const { categoryId, mode } = pickWeightedCategory(zeroScores, always(0.1));
    expect(mode).toBe("discovery");
    expect(VALID_CATEGORIES).toContain(categoryId);
  });
});

describe("pickWeightedProject", () => {
  it("returns a project that exists in the supplied list", () => {
    const ids = new Set(PROJECTS.map((p) => p.id));
    const { project } = pickWeightedProject(PROJECTS, { scores: zeroScores });
    expect(ids.has(project.id)).toBe(true);
  });

  it("respects excludeId — never returns the excluded project", () => {
    const exclude = PROJECTS[0].id;
    for (let i = 0; i < 20; i++) {
      const { project } = pickWeightedProject(PROJECTS, {
        scores: zeroScores,
        excludeId: exclude,
      });
      expect(project.id).not.toBe(exclude);
    }
  });
});

describe("pickShuffleSequence", () => {
  it("returns exactly count projects", () => {
    expect(pickShuffleSequence(PROJECTS, zeroScores, 18)).toHaveLength(18);
  });

  it("never places the same project on consecutive frames", () => {
    for (let trial = 0; trial < 10; trial++) {
      const seq = pickShuffleSequence(PROJECTS, zeroScores, 18);
      for (let i = 1; i < seq.length; i++) {
        expect(seq[i].id).not.toBe(seq[i - 1].id);
      }
    }
  });

  it("all returned projects exist in PROJECTS", () => {
    const ids = new Set(PROJECTS.map((p) => p.id));
    pickShuffleSequence(PROJECTS, zeroScores, 18).forEach((p) => {
      expect(ids.has(p.id)).toBe(true);
    });
  });

  it("works with count = 1", () => {
    expect(pickShuffleSequence(PROJECTS, zeroScores, 1)).toHaveLength(1);
  });
});
