"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { playClick, playWin } from "@/lib/sound";

interface Props {
  sequence: Project[];
  winner: Project;
  onDone: () => void;
}

const TOTAL_DURATION = 1500; // ms
const FRAME_COUNT_TARGET = 18;

export default function SlotMachine({ sequence, winner, onDone }: Props) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [phase, setPhase] = useState<"spin" | "winner">("spin");
  const frameRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let elapsed = 0;
    let frame = 0;
    const total = sequence.length;

    const scheduleNext = () => {
      // Ease-out: early frames fast, later frames slow
      const progress = frame / total;
      const delay = TOTAL_DURATION / total * (0.3 + progress * 1.4);
      elapsed += delay;

      timerRef.current = setTimeout(() => {
        frame++;
        frameRef.current = frame;
        if (frame < total) {
          playClick(0.04, 600 + Math.random() * 400);
          setFrameIdx(frame);
          scheduleNext();
        } else {
          // Winner
          playWin();
          setPhase("winner");
          setTimeout(() => onDone(), 1200);
        }
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, [sequence, onDone]);

  const current = phase === "winner" ? winner : (sequence[frameIdx] ?? sequence[0]);
  const category = CATEGORIES.find((c) => c.id === current.category)!;
  const spinning = phase === "spin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
      {/* Slot window */}
      <div className="relative w-full max-w-md mx-4">
        {/* Neon frame */}
        <div
          className={`
            rounded-3xl border-2 p-1
            ${phase === "winner"
              ? "border-neon-amber gold-glow"
              : "border-neon-violet/60 shadow-[0_0_40px_rgba(167,139,250,0.5)]"
            }
          `}
        >
          <div className="rounded-[20px] bg-bg-veil overflow-hidden">
            {/* Header strip */}
            <div className="flex items-center justify-center gap-3 py-3 border-b border-glass-border">
              <span className="text-2xl">🎰</span>
              <span className="text-sm font-bold uppercase tracking-widest text-fg-dim">
                {spinning ? "Shuffling…" : "Winner!"}
              </span>
              <span className="text-2xl">🎰</span>
            </div>

            {/* Card preview */}
            <div
              className="relative p-6 min-h-[260px] flex flex-col gap-3"
              data-spinning={spinning}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current.id + phase}
                  initial={{ y: spinning ? -60 : 0, opacity: 0, filter: spinning ? "blur(4px)" : "blur(0px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: spinning ? 60 : 0, opacity: 0, filter: spinning ? "blur(4px)" : "blur(0px)" }}
                  transition={
                    spinning
                      ? { duration: 0.12, ease: "easeOut" }
                      : { duration: 0.5, type: "spring", stiffness: 260, damping: 22 }
                  }
                  className="flex flex-col gap-3"
                >
                  <div className="text-xs font-semibold uppercase tracking-widest text-fg-dim">
                    {category.emoji} {category.label}
                  </div>

                  <h2
                    className={`text-2xl font-bold leading-tight ${phase === "winner" ? "gold-leaf" : "text-fg-base"}`}
                  >
                    {current.title}
                  </h2>

                  <p className="text-sm text-neon-cyan font-medium">{current.tagline}</p>

                  <p className="text-xs text-fg-muted leading-relaxed line-clamp-3">
                    {current.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {current.stack.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-glass-hi border border-glass-border px-2 py-0.5 text-[10px] font-mono text-fg-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Motion blur overlay when spinning */}
              {spinning && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-veil/40 via-transparent to-bg-veil/40" />
              )}
            </div>

            {/* Winner banner */}
            <AnimatePresence>
              {phase === "winner" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 py-4 border-t border-neon-amber/30 bg-neon-amber/10"
                >
                  <span className="text-xl">🏆</span>
                  <span className="gold-leaf text-sm font-bold uppercase tracking-widest">
                    Your Next Project
                  </span>
                  <span className="text-xl">🏆</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress dots */}
        {spinning && (
          <div className="mt-4 flex justify-center gap-1.5">
            {sequence.slice(0, FRAME_COUNT_TARGET).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-100 ${
                  i <= frameIdx ? "w-3 bg-neon-violet" : "w-1.5 bg-fg-dim/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Dismiss hint */}
        <p className="mt-3 text-center text-xs text-fg-dim opacity-60">
          {phase === "winner" ? "Opening project…" : "Hang tight…"}
        </p>
      </div>
    </div>
  );
}
