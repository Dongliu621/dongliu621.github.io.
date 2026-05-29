import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Aperture, Activity, MousePointerClick, RefreshCcw } from 'lucide-react';

export const SpotlightButton = ({ children }: { children: React.ReactNode }) => {
  const divRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <button
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="group relative overflow-hidden rounded-xl bg-neutral-900 px-8 py-4 font-semibold text-white shadow-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(150px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.2), transparent 40%)`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        <Aperture className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
        {children}
      </span>
    </button>
  );
};

export const ShinyButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="group relative overflow-hidden rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.8)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-neutral-900">
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
        <div className="relative h-full w-8 bg-white/20" />
      </div>
      <span className="relative z-10 flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        {children}
      </span>
    </button>
  );
};

export const NeonButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="group relative rounded-xl border border-purple-500 bg-purple-500/10 px-8 py-4 font-semibold text-purple-400 transition-all duration-300 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_2rem_-0.5rem_#a855f7] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-neutral-900">
      <span className="relative z-10 flex items-center gap-2">
        <Zap className="h-5 w-5 group-hover:animate-pulse" />
        {children}
      </span>
    </button>
  );
};

export const BorderGlowButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="relative overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-neutral-900 group">
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute inset-[-1000%] bg-neutral-800 transition-opacity duration-300 group-hover:opacity-0" />
      <div className="relative inline-flex h-full w-full items-center justify-center rounded-xl bg-neutral-950 px-8 py-4 font-semibold text-white transition-colors hover:bg-neutral-900/80">
        <span className="relative z-10 flex items-center gap-2">
          <RefreshCcw className="h-5 w-5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
          {children}
        </span>
      </div>
    </button>
  );
};

export const PulseButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-xl bg-emerald-500 opacity-20 blur-md animate-pulse"></div>
      <button className="relative flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/50 px-8 py-4 font-semibold text-emerald-400 transition-transform hover:scale-105 hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-neutral-900">
        <Activity className="h-5 w-5" />
        {children}
      </button>
    </div>
  );
};

export const AnimatedPressButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:shadow-[0_0_30px_rgba(243,115,22,0.6)] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
    >
      <MousePointerClick className="h-5 w-5" />
      {children}
    </motion.button>
  );
};
