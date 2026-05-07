"use client";

import { motion } from "framer-motion";

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export default function SurpriseMeButton({ onClick, disabled }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="
        fixed bottom-6 right-6 z-30
        flex items-center gap-2
        rounded-full px-5 py-3.5
        bg-gradient-to-br from-neon-magenta/80 to-neon-violet/80
        border border-neon-magenta/50
        text-white text-sm font-bold
        shadow-[0_0_30px_rgba(232,121,249,0.55),0_0_60px_rgba(167,139,250,0.3)]
        surprise-pulse
        disabled:opacity-50 disabled:cursor-not-allowed
        backdrop-blur-sm
      "
      aria-label="Surprise Me"
    >
      <span className="text-xl leading-none">🎰</span>
      <span className="hidden sm:inline">Surprise Me</span>
    </motion.button>
  );
}
