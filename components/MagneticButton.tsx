"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface Props {
  children: ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

export default function MagneticButton({
  children,
  radius = 30,
  strength = 0.45,
  className = "",
  onClick,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    }
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <button
      ref={ref}
      onClick={(e) => onClick?.(e)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: "transform 200ms cubic-bezier(.2,.7,.2,1.2)" }}
    >
      {children}
    </button>
  );
}
