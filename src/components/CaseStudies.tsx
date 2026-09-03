'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Cpu, Layers, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  techStack: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  link?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'lift-signup',
    title: 'Lift Interactive Signup',
    subtitle: 'High-Converting WebGL Mascot Funnel',
    description:
      'A WebGL-powered, dark-themed interactive conversion funnel featuring real-time 3D mascot customization. Increased user time-on-page and signup conversions through procedural idle animations.',
    metrics: '+42% Signup Lift // 60 FPS Target',
    techStack: ['WebGL', 'Three.js', 'GLSL Shaders', 'Inverse Kinematics', 'TypeScript'],
    icon: Sparkles,
    accentColor: '#00F0FF',
    link: 'https://github.com/nff747',
  },
  {
    id: 'vram-pager',
    title: 'WebGPU VRAM Pager',
    subtitle: 'Kernel-Grade Browser Memory Management',
    description:
      'A dynamic memory management wrapper bypassing browser buffer limits to stream 8B parameter LLM weights client-side.',
    metrics: 'Zero-GC Spike // PCIe Ring-Buffer',
    techStack: ['WebGPU', 'VRAM Paging', 'Ring Buffers', 'mapAsync', 'WASM'],
    icon: Cpu,
    accentColor: '#FF0055',
    link: 'https://github.com/nff747/webgpu-vram-pager',
  },
  {
    id: 'splat-bvh',
    title: 'Splat BVH Core',
    subtitle: 'Real-Time 3D Gaussian Spatial Indexer',
    description:
      'A WebGPU spatial indexer utilizing custom WGSL shaders to make 10-million-point 3D Gaussian Splats instantly interactive in-browser.',
    metrics: '1-Sweep Radix Sort // Sub-ms Indexing',
    techStack: ['WebGPU', 'WGSL Compute', 'Morton Z-Curve', 'Parallel Radix Sort', 'Linear BVH'],
    icon: Layers,
    accentColor: '#39d353',
    link: 'https://github.com/nff747/splat-bvh-core',
  },
];

interface CaseStudiesProps {
  onHoverProject?: (title: string | null) => void;
}

export function CaseStudies({ onHoverProject }: CaseStudiesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono tracking-widest text-neon-crimson uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-crimson animate-pulse" />
            01 // Flagship Productions
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Featured Case Studies
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-sm font-mono text-slate-400 max-w-xs">
          High-yield GPU systems engineered for extreme runtime efficiency.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS.map((project, idx) => {
          const Icon = project.icon;
          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={project.id}
              className="group relative rounded-2xl glass-card p-8 flex flex-col justify-between overflow-hidden cursor-pointer"
              onMouseEnter={() => {
                setHoveredIndex(idx);
                onHoverProject?.(project.title);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                onHoverProject?.(null);
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Radial Hover Glow Accent */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${project.accentColor}25, transparent 70%)`,
                }}
              />

              {/* Card Top / Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]"
                    style={{ color: project.accentColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <span 
                  className="text-xs font-mono font-semibold tracking-wider uppercase"
                  style={{ color: project.accentColor }}
                >
                  {project.subtitle}
                </span>

                <h3 className="text-2xl font-bold text-white mt-1 mb-4 group-hover:text-white transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>

              {/* Card Bottom / Micro-Interactions */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="text-xs font-mono text-slate-500 mb-3 flex items-center justify-between">
                  <span>METRICS</span>
                  <span className="text-slate-300 font-semibold">{project.metrics}</span>
                </div>

                {/* Tech Stack Pills (Revealed & Animated on Hover) */}
                <div className="flex flex-wrap gap-1.5 min-h-[3.5rem] items-end">
                  {project.techStack.map((tech) => (
                    <motion.span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-md border border-white/[0.08] bg-white/[0.02] text-slate-300 group-hover:border-white/[0.2] transition-colors"
                      animate={{
                        scale: isHovered ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
