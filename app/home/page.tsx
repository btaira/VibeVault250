"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { CATEGORIES } from "@/lib/types";
import type { CategoryId, Project } from "@/lib/types";
import { useVibeStore } from "@/lib/store";
import { pickShuffleSequence, pickWeightedProject } from "@/lib/randomizer";
import FilterBar from "@/components/FilterBar";
import ProjectCard from "@/components/ProjectCard";
import SurpriseMeButton from "@/components/SurpriseMeButton";
import SlotMachine from "@/components/SlotMachine";
import DeepDiveModal from "@/components/DeepDiveModal";

const SLOT_FRAMES = 18;

export default function Home() {
  const { scores, hydrated } = useVibeStore();
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [slotSequence, setSlotSequence] = useState<Project[] | null>(null);
  const [slotWinner, setSlotWinner] = useState<Project | null>(null);
  const [spinning, setSpinning] = useState(false);

  // Filtered projects
  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  // Category counts
  const counts = useMemo(() => {
    const c = { all: PROJECTS.length } as Record<CategoryId | "all", number>;
    for (const cat of CATEGORIES) {
      c[cat.id] = PROJECTS.filter((p) => p.category === cat.id).length;
    }
    return c;
  }, []);

  const handleSurprise = useCallback(() => {
    if (spinning) return;
    setSpinning(true);

    const safeScores = hydrated ? scores : { saas: 0, creative: 0, utility: 0, social: 0, deeptech: 0 };
    const sequence = pickShuffleSequence(PROJECTS, safeScores, SLOT_FRAMES);
    const { project: winner } = pickWeightedProject(PROJECTS, { scores: safeScores });

    setSlotSequence(sequence);
    setSlotWinner(winner);
  }, [spinning, hydrated, scores]);

  const handleSlotDone = useCallback(() => {
    setSpinning(false);
    const winner = slotWinner;
    setSlotSequence(null);
    setSlotWinner(null);
    if (winner) setModalProject(winner);
  }, [slotWinner]);

  return (
    <main className="relative z-10 min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 shadow-sm ring-1 ring-white/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Discover the app showcase, deploy notes, and Docker instructions on the
              <Link href="/showcase" className="ml-1 inline font-semibold text-cyan-300 hover:text-white">
                Showcase page
              </Link>.
            </p>
            <Link
              href="/showcase"
              className="inline-flex rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              View Showcase
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <FilterBar
        active={activeCategory}
        onSelect={setActiveCategory}
        counts={counts}
      />

      {/* Bento grid */}
      <section className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6">
        {/* Category hero for non-all views */}
        <AnimatePresence mode="wait">
          {activeCategory !== "all" && (() => {
            const cat = CATEGORIES.find((c) => c.id === activeCategory)!;
            return (
              <div className="mb-8 text-center">
                <div className="text-5xl mb-2">{cat.emoji}</div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${cat.accent} bg-clip-text text-transparent`}>
                  {cat.label}
                </h2>
                <p className="mt-1 text-sm text-fg-muted">{cat.description}</p>
              </div>
            );
          })()}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDeepDive={setModalProject}
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-5xl mb-4">🌌</span>
            <p className="text-fg-muted">No ideas in this category yet.</p>
          </div>
        )}
      </section>

      {/* Floating surprise button */}
      <SurpriseMeButton onClick={handleSurprise} disabled={spinning} />

      {/* Slot machine overlay */}
      <AnimatePresence>
        {slotSequence && slotWinner && (
          <SlotMachine
            sequence={slotSequence}
            winner={slotWinner}
            onDone={handleSlotDone}
          />
        )}
      </AnimatePresence>

      {/* Deep dive modal */}
      <DeepDiveModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </main>
  );
}