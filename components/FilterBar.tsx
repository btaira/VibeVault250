"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/types";
import type { CategoryId } from "@/lib/types";

interface Props {
  active: CategoryId | "all";
  onSelect: (id: CategoryId | "all") => void;
  counts: Record<CategoryId | "all", number>;
}

export default function FilterBar({ active, onSelect, counts }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabs = [
    { id: "all" as const, label: "All", emoji: "✨" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji })),
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={scrolled ? undefined : undefined}
    >
      <div className={`w-full transition-all duration-300 ${scrolled ? "scrolled-blur" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          {/* Title row */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎰</span>
              <div>
                <h1 className="glow-text text-xl font-bold tracking-tight text-fg-base sm:text-2xl">
                  VibeVault <span className="text-neon-magenta">250</span>
                </h1>
                <p className="hidden text-xs text-fg-dim sm:block">
                  250 AI project ideas · curated from Reddit's vibe coding community
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-fg-dim">
              <span className="hidden sm:inline">
                {counts[active]} idea{counts[active] !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Category pills */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onSelect(tab.id)}
                  whileTap={{ scale: 0.93 }}
                  className={`
                    relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5
                    text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-neon-violet/20 text-neon-violet border border-neon-violet/50 shadow-[0_0_12px_rgba(167,139,250,0.4)]"
                      : "glass text-fg-muted hover:text-fg-base hover:border-glass-border"
                    }
                  `}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`
                      rounded-full px-1.5 py-0.5 text-xs
                      ${isActive ? "bg-neon-violet/30 text-neon-violet" : "bg-white/5 text-fg-dim"}
                    `}
                  >
                    {counts[tab.id]}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-neon-violet/10"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
