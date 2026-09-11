"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { Download, Github, Terminal } from "lucide-react";

export function TiltCard({ project, onClick }: { project: any; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-[4/3] rounded-xl cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-white/30 transition-colors duration-500"
        style={{
          backgroundImage: `url(/banners/${project.id}.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateZ(-20px)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div
        className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] text-white font-mono uppercase tracking-widest border border-white/20">
            {project.lang}
          </div>
          <div className="px-2 py-1 bg-cyan-500/20 backdrop-blur-md rounded text-[10px] text-cyan-300 font-mono uppercase tracking-widest border border-cyan-500/30">
            {project.badge}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white font-mono tracking-tight drop-shadow-md mb-2">
          {project.name}
        </h2>
        <p className="text-slate-300 text-sm line-clamp-2 drop-shadow-md mb-4">
          {project.description}
        </p>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <a
            href={project.zipUrl}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-white text-black py-2.5 rounded flex justify-center items-center gap-2 hover:bg-cyan-400 transition-colors font-bold text-xs shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            DOWNLOAD .ZIP
          </a>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)",
          transform: "translateZ(10px)",
        }}
      />
    </motion.div>
  );
}
