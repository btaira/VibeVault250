// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { useVibeStore } from "@/lib/store";

const ZERO_SCORES = {
  saas: 0,
  creative: 0,
  utility: 0,
  social: 0,
  deeptech: 0,
};

beforeEach(() => {
  useVibeStore.setState({
    scores: { ...ZERO_SCORES },
    liked: {},
    totalLikes: 0,
    totalSurprises: 0,
    hydrated: false,
  });
});

describe("toggleLike", () => {
  it("likes a project and increments its category score", () => {
    useVibeStore.getState().toggleLike("saas-001", "saas");
    const s = useVibeStore.getState();
    expect(s.liked["saas-001"]).toBe(true);
    expect(s.scores.saas).toBe(1);
    expect(s.totalLikes).toBe(1);
  });

  it("unlike on a liked project removes it and decrements score", () => {
    useVibeStore.getState().toggleLike("saas-001", "saas");
    useVibeStore.getState().toggleLike("saas-001", "saas");
    const s = useVibeStore.getState();
    expect(s.liked["saas-001"]).toBeUndefined();
    expect(s.scores.saas).toBe(0);
    expect(s.totalLikes).toBe(0);
  });

  it("score never goes below 0 on unlike", () => {
    useVibeStore.getState().toggleLike("saas-001", "saas"); // like → 1
    useVibeStore.getState().toggleLike("saas-001", "saas"); // unlike → 0
    expect(useVibeStore.getState().scores.saas).toBe(0);
  });

  it("tracks multiple projects across different categories independently", () => {
    useVibeStore.getState().toggleLike("saas-001", "saas");
    useVibeStore.getState().toggleLike("creative-001", "creative");
    useVibeStore.getState().toggleLike("deeptech-001", "deeptech");
    const s = useVibeStore.getState();
    expect(s.scores.saas).toBe(1);
    expect(s.scores.creative).toBe(1);
    expect(s.scores.deeptech).toBe(1);
    expect(s.scores.utility).toBe(0);
    expect(s.scores.social).toBe(0);
    expect(s.totalLikes).toBe(3);
  });

  it("liking the same project in the same category only counts once", () => {
    useVibeStore.getState().toggleLike("saas-001", "saas");
    useVibeStore.getState().toggleLike("saas-001", "saas"); // unlike
    useVibeStore.getState().toggleLike("saas-001", "saas"); // like again
    expect(useVibeStore.getState().scores.saas).toBe(1);
    expect(useVibeStore.getState().totalLikes).toBe(1);
  });
});

describe("isLiked", () => {
  it("returns false for an unknown project", () => {
    expect(useVibeStore.getState().isLiked("does-not-exist")).toBe(false);
  });

  it("returns true after liking a project", () => {
    useVibeStore.getState().toggleLike("utility-005", "utility");
    expect(useVibeStore.getState().isLiked("utility-005")).toBe(true);
  });

  it("returns false after unliking a project", () => {
    useVibeStore.getState().toggleLike("utility-005", "utility");
    useVibeStore.getState().toggleLike("utility-005", "utility");
    expect(useVibeStore.getState().isLiked("utility-005")).toBe(false);
  });
});

describe("recordSurprise", () => {
  it("increments totalSurprises on each call", () => {
    useVibeStore.getState().recordSurprise();
    useVibeStore.getState().recordSurprise();
    expect(useVibeStore.getState().totalSurprises).toBe(2);
  });
});

describe("resetVibes", () => {
  it("clears liked map, zeroes scores, zeroes totalLikes", () => {
    useVibeStore.getState().toggleLike("saas-001", "saas");
    useVibeStore.getState().toggleLike("creative-001", "creative");
    useVibeStore.getState().resetVibes();
    const s = useVibeStore.getState();
    expect(s.liked).toEqual({});
    expect(s.scores).toEqual(ZERO_SCORES);
    expect(s.totalLikes).toBe(0);
  });

  it("does NOT reset totalSurprises (known behaviour)", () => {
    useVibeStore.getState().recordSurprise();
    useVibeStore.getState().recordSurprise();
    useVibeStore.getState().resetVibes();
    expect(useVibeStore.getState().totalSurprises).toBe(2);
  });
});
