export type CategoryId = "saas" | "creative" | "utility" | "social" | "deeptech";

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  accent: string;
  glow: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: CategoryId;
  tagline: string;
  description: string;
  prompt: string;
  stack: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  vibes: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "saas",
    label: "SaaS",
    emoji: "💼",
    accent: "from-cyan-400 to-blue-500",
    glow: "rgba(34, 211, 238, 0.55)",
    description: "Subscription-ready businesses you can ship this weekend.",
  },
  {
    id: "creative",
    label: "Creative",
    emoji: "🎨",
    accent: "from-fuchsia-400 to-pink-500",
    glow: "rgba(232, 121, 249, 0.55)",
    description: "Generative art, audio toys, and expressive playgrounds.",
  },
  {
    id: "utility",
    label: "Utility",
    emoji: "🛠️",
    accent: "from-emerald-400 to-teal-500",
    glow: "rgba(52, 211, 153, 0.55)",
    description: "Tiny tools that quietly fix everyday friction.",
  },
  {
    id: "social",
    label: "Social",
    emoji: "🌐",
    accent: "from-amber-400 to-orange-500",
    glow: "rgba(251, 191, 36, 0.55)",
    description: "Community, multiplayer, and shared-presence apps.",
  },
  {
    id: "deeptech",
    label: "Deep Tech",
    emoji: "⚛️",
    accent: "from-violet-400 to-indigo-500",
    glow: "rgba(167, 139, 250, 0.55)",
    description: "AI, blockchain, edge compute, and frontier tinkering.",
  },
];
