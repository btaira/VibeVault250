import type { CategoryId, Project } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

const DISCOVERY_CHANCE = 0.2;

export interface PickContext {
  scores: Record<CategoryId, number>;
  excludeId?: string;
}

export function pickWeightedCategory(
  scores: Record<CategoryId, number>,
  rng: () => number = Math.random,
): { categoryId: CategoryId; mode: "weighted" | "discovery" } {
  if (rng() < DISCOVERY_CHANCE) {
    const minScore = Math.min(...Object.values(scores));
    const cold = CATEGORIES.filter((c) => scores[c.id] === minScore);
    const pick = cold[Math.floor(rng() * cold.length)] ?? CATEGORIES[0];
    return { categoryId: pick.id, mode: "discovery" };
  }

  const total = CATEGORIES.reduce((acc, c) => acc + 1 + scores[c.id], 0);
  let r = rng() * total;
  for (const c of CATEGORIES) {
    const weight = 1 + scores[c.id];
    if (r < weight) return { categoryId: c.id, mode: "weighted" };
    r -= weight;
  }
  return { categoryId: CATEGORIES[0].id, mode: "weighted" };
}

export function pickWeightedProject(
  projects: Project[],
  ctx: PickContext,
  rng: () => number = Math.random,
): { project: Project; mode: "weighted" | "discovery" } {
  const { categoryId, mode } = pickWeightedCategory(ctx.scores, rng);
  const pool = projects.filter(
    (p) => p.category === categoryId && p.id !== ctx.excludeId,
  );
  const project = pool[Math.floor(rng() * pool.length)];
  return { project, mode };
}

export function pickShuffleSequence(
  projects: Project[],
  scores: Record<CategoryId, number>,
  count: number,
  rng: () => number = Math.random,
): Project[] {
  const out: Project[] = [];
  let lastId: string | undefined;
  for (let i = 0; i < count; i++) {
    const { project } = pickWeightedProject(projects, { scores, excludeId: lastId }, rng);
    out.push(project);
    lastId = project.id;
  }
  return out;
}
