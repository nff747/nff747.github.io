'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroCanvas } from '@/components/HeroCanvas';
import { 
  Sparkles, 
  Github, 
  Cpu, 
  Layers, 
  Code2, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  Check, 
  Loader2,
  Box,
  Compass,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  benchmark: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  accent: string;
  category: string;
}

const VAULT_PROJECTS: Project[] = [
  {
    id: 'splat-bvh',
    title: 'Splat BVH Core',
    subtitle: 'WGSL 1-Sweep Radix Sort & BVH Tree',
    benchmark: '10M+ Gaussians // Sub-millisecond Indexing',
    description: 'Kernel-grade WebGPU spatial indexer utilizing custom WGSL compute shaders to make 10-million-point 3D Gaussian Splats instantly interactive in-browser with zero main-thread stall.',
    techStack: ['WebGPU', 'WGSL Compute', 'Morton Z-Curve', '1-Sweep Radix Sort', 'Linear BVH'],
    githubUrl: 'https://github.com/nff747/splat-bvh-core',
    accent: '#00e5ff',
    category: 'COMPUTE',
  },
  {
    id: 'vram-pager',
    title: 'WebGPU VRAM Pager',
    subtitle: 'PCIe Ring Buffers & Asynchronous Staging',
    benchmark: 'Zero-GC Spike // 8B LLM Weight Streaming',
    description: 'Low-level memory management wrapper bypassing browser buffer allocation bottlenecks via mapAsync and ring-buffered staging for client-side local neural network inference.',
    techStack: ['WebGPU', 'VRAM Paging', 'Ring Buffers', 'mapAsync', 'WASM'],
    githubUrl: 'https://github.com/nff747/webgpu-vram-pager',
    accent: '#ff0055',
    category: 'MEMORY',
  },
  {
    id: 'neural-texture',
    title: 'Neural Texture Engine',
    subtitle: 'WebGPU Capability Profiler & Fallback',
    benchmark: 'Adaptive 16ms Frame Budget // Mobile Fallback',
    description: 'Dynamic GPU capability profiler that benchmarks client compute throughput and seamlessly falls back to WebGL2 shaders when frame times exceed 16ms budget.',
    techStack: ['WebGPU', 'WebGL2', 'Profiling', 'Compute Fallback', 'GLSL'],
    githubUrl: 'https://github.com/nff747/neural-texture-engine',
    accent: '#39d353',
    category: 'RUNTIME',
  },
  {
    id: 'auto-rig-web',
    title: 'Auto-Rig Web Worker',
    subtitle: 'Zero-Copy SharedArrayBuffer ONNX Skinning',
    benchmark: 'Zero Main-Thread Blocking // Bi-Harmonic Mesh',
    description: 'Offloads neural skeleton extraction and bi-harmonic mesh skinning to a dedicated background Web Worker, using SharedArrayBuffers for zero-copy memory transfers.',
    techStack: ['Web Workers', 'SharedArrayBuffer', 'ONNX Runtime', 'Skeletal Rigging'],
    githubUrl: 'https://github.com/nff747/auto-rig-web',
    accent: '#e0a82e',
    category: 'SKELETAL',
  },
  {
    id: 'spatial-glass',
    title: 'Spatial Glass UI',
    subtitle: 'Phantom DOM Accessibility Synchronization',
    benchmark: 'WCAG AAA Compliant // 60 FPS WebGL Mirror',
    description: 'Bi-directional synchronization layer that dynamically projects 3D spatial canvas elements into an invisible, fully accessible Phantom DOM hierarchy for screen readers and search crawlers.',
    techStack: ['Phantom DOM', 'Three.js', 'a11y', 'Spatial Transforms', 'Matrix4'],
    githubUrl: 'https://github.com/nff747/spatial-glass-ui',
    accent: '#a855f7',
    category: 'ACCESSIBILITY',
  },
];

export default function Home() {
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [terminalEmail, setTerminalEmail] = useState('');
  const [terminalStatus, setTerminalStatus] = useState<'idle' | 'transmitting' | 'connected' | 'error'>('idle');
  const [terminalLog, setTerminalLog] = useState<string | null>(null);

  const lastScrollTime = useRef<number>(0);

  // 3D Animated Scroll Navigator (Wheel event debounced for chapter gliding)
  const handleWheel = useCallback((e: WheelEvent) => {
    // Only intercept wheel on desktop devices
    if (window.innerWidth < 768) return;

    const now = Date.now();
    if (now - lastScrollTime.current < 650) return; // Debounce window for smooth 3D camera transition

    if (e.deltaY > 30) {
      // Scroll Down -> Next Chapter
      setActiveChapter((prev) => {
        const next = Math.min(prev + 1, 2);
        if (next !== prev) lastScrollTime.current = now;
        return next;
      });
    } else if (e.deltaY < -30) {
      // Scroll Up -> Previous Chapter
      setActiveChapter((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next !== prev) lastScrollTime.current = now;
        return next;
      });
    }
  }, []);

  // Keyboard navigation (1, 2, 3 or Up/Down arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '1') setActiveChapter(0);
      else if (e.key === '2') setActiveChapter(1);
      else if (e.key === '3') setActiveChapter(2);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setActiveChapter((prev) => Math.min(prev + 1, 2));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActiveChapter((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel]);

  // Terminal contact submission
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalEmail || !terminalEmail.includes('@')) {
      setTerminalStatus('error');
      setTerminalLog('ERR: INVALID_SIGNATURE // RFC_EMAIL_REQUIRED');
      return;
    }

    setTerminalStatus('transmitting');
    setTerminalLog('SOCKET_OPEN // ENCRYPTING PAYLOAD // TRANSMITTING...');

    setTimeout(() => {
      setTerminalStatus('connected');
      setTerminalLog('HANDSHAKE COMPLETE [200 OK] // UPLINK ESTABLISHED');
    }, 1200);
  };

  const activeProject = VAULT_PROJECTS[selectedProjectIndex];

  return (
    <main className="relative min-h-screen md:h-screen w-full bg-void text-slate-100 overflow-x-hidden md:overflow-hidden selection:bg-neon-crimson selection:text-white flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer with Spatial Camera Controller */}
      <HeroCanvas activeChapter={activeChapter} />

      {/* ═══════════════════════════════════════════════════════════════
          TOP HUD NAVIGATION BAR
          ═══════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full px-6 lg:px-12 pt-5 pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Identity & Status Beacon */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00e5ff]" />
            <span className="font-mono font-bold tracking-widest text-sm text-white uppercase">
              iKi // <span className="text-slate-400 font-normal">SYSTEM ONLINE</span>
            </span>
          </div>

          {/* Interactive Chapter Timeline Selector */}
          <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-slate-950/70 border border-white/[0.08] backdrop-blur-xl font-mono text-xs">
            <button
              onClick={() => setActiveChapter(0)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeChapter === 0
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>01 // OVERVIEW</span>
            </button>

            <button
              onClick={() => setActiveChapter(1)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeChapter === 1
                  ? 'bg-neon-crimson/20 text-neon-crimson border border-neon-crimson/30 shadow-[0_0_12px_rgba(255,0,85,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>02 // VAULT</span>
            </button>

            <button
              onClick={() => setActiveChapter(2)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeChapter === 2
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_12px_rgba(57,211,83,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>03 // UPLINK</span>
            </button>
          </nav>

          {/* GitHub Action */}
          <a
            href="https://github.com/nff747"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-950/70 hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-xl"
          >
            <Github className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden sm:inline">GITHUB</span>
          </a>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP SIDE DECKS WORKSPACE (UNCLUTTERED 3D SPATIAL UI)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-4 flex-1 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 pointer-events-none">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT GLASS DECK: ARCHITECT SPECS & CORE VALUE PROPOSITION
            ───────────────────────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[380px] lg:w-[420px] pointer-events-auto"
        >
          <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl flex flex-col gap-6">
            
            {/* Domain Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/25 text-xs font-mono tracking-wider text-neon-cyan w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GPU ARCHITECTURE // SPATIAL UI</span>
            </div>

            {/* Architect Identity */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                High-Yield <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-slate-100 to-slate-400">
                  GPU Pipelines
                </span>
              </h1>
              <p className="mt-2 text-xs font-mono text-slate-400">
                iKi // WebGL & WebGPU Systems Architect
              </p>
            </div>

            {/* Core Value Proposition */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bridging complex GPU architecture with high-converting web experiences. Specializing in WebGL rendering pipelines, browser-native AI memory management, and spatial UI.
            </p>

            {/* Locked Runtime Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08] font-mono text-center">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-neon-cyan font-bold text-sm">60 FPS</div>
                <div className="text-[10px] text-slate-400 mt-0.5">LOCKED</div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-neon-crimson font-bold text-sm">10M+</div>
                <div className="text-[10px] text-slate-400 mt-0.5">SPLAT BVH</div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-green-400 font-bold text-sm">8B+</div>
                <div className="text-[10px] text-slate-400 mt-0.5">VRAM PAGING</div>
              </div>
            </div>

            {/* 3D Spatial Stepper Indicator */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                CHAPTER {activeChapter + 1} OF 3
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                SCROLL WHEEL TO GLIDE
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT GLASS DECK: DYNAMIC INTERACTIVE MODULE
            Swaps smoothly between Chapter 0 (Overview), Chapter 1 (Vault),
            and Chapter 2 (Uplink) without scrolling!
            ───────────────────────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[420px] lg:w-[460px] pointer-events-auto"
        >
          <AnimatePresence mode="wait">
            
            {/* ── CHAPTER 0: SYSTEM SPECIFICATIONS & CORE ENGINES ── */}
            {activeChapter === 0 && (
              <motion.div
                key="chapter-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl flex flex-col gap-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-300 uppercase">
                    <Cpu className="w-4 h-4 text-neon-cyan" />
                    <span>SYSTEM CAPABILITIES</span>
                  </div>
                  <span className="text-[11px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                    5 ACTIVE ENGINES
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-neon-cyan/30 transition-colors">
                    <div className="text-white font-semibold flex items-center justify-between">
                      <span>01 // ONE-SWEEP RADIX SORT</span>
                      <span className="text-neon-cyan text-[10px]">WGSL</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px] font-sans">
                      10M+ point spatial indexing keeping Morton keys entirely in VRAM.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-neon-crimson/30 transition-colors">
                    <div className="text-white font-semibold flex items-center justify-between">
                      <span>02 // KERNEL VRAM PAGER</span>
                      <span className="text-neon-crimson text-[10px]">WEBGPU</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px] font-sans">
                      PCIe asynchronous ring-buffers streaming 8B LLM weights zero-GC.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-green-400/30 transition-colors">
                    <div className="text-white font-semibold flex items-center justify-between">
                      <span>03 // ZERO-COPY AUTO-RIG</span>
                      <span className="text-green-400 text-[10px]">WORKERS</span>
                    </div>
                    <p className="text-slate-400 mt-1 text-[11px] font-sans">
                      SharedArrayBuffer multi-threaded skeletal rigging & ONNX mesh skinning.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setActiveChapter(1)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-neon-cyan hover:text-slate-950 text-white font-mono text-xs font-semibold border border-white/[0.1] hover:border-neon-cyan transition-all flex items-center justify-center gap-2"
                  >
                    <span>EXPLORE VAULT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveChapter(2)}
                    className="py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs border border-white/[0.08] transition-all"
                  >
                    UPLINK
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── CHAPTER 1: THE VAULT (INTERACTIVE REPOSITORY CAROUSEL) ── */}
            {activeChapter === 1 && (
              <motion.div
                key="chapter-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl flex flex-col gap-5"
              >
                {/* Vault Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-300 uppercase">
                    <Box className="w-4 h-4 text-neon-crimson" />
                    <span>THE VAULT // 5 PRODUCTIONS</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedProjectIndex + 1} / {VAULT_PROJECTS.length}
                  </span>
                </div>

                {/* Project Selector Mini-Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[11px]">
                  {VAULT_PROJECTS.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProjectIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                        selectedProjectIndex === idx
                          ? 'bg-neon-crimson/20 text-neon-crimson border border-neon-crimson/40 font-semibold'
                          : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.05]'
                      }`}
                    >
                      {p.id.split('-')[0].toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Selected Project Card */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {activeProject.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                        {activeProject.category}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-neon-cyan mt-0.5">
                      {activeProject.benchmark}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {activeProject.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Controls & GitHub Link */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSelectedProjectIndex((prev) =>
                          prev === 0 ? VAULT_PROJECTS.length - 1 : prev - 1
                        )
                      }
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                      title="Previous System"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedProjectIndex((prev) =>
                          (prev + 1) % VAULT_PROJECTS.length
                        )
                      }
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                      title="Next System"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-xl bg-neon-crimson hover:bg-neon-crimson/90 text-white font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                  >
                    <span>INSPECT REPO</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* ── CHAPTER 2: CLIENT UPLINK (INTERACTIVE GLASS TERMINAL) ── */}
            {activeChapter === 2 && (
              <motion.div
                key="chapter-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl overflow-hidden"
              >
                {/* Terminal Window Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-950/80 border-b border-white/[0.08] text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-slate-300 font-semibold tracking-wider">
                      UPLINK // TERMINAL_v3.2
                    </span>
                  </div>
                  <span className="text-[11px] text-green-400">TLS 1.3</span>
                </div>

                <div className="p-6 font-mono text-xs flex flex-col gap-4">
                  <p className="text-slate-400 leading-relaxed font-sans text-xs">
                    Deploying WebGPU compute shaders, browser AI pipelines, or high-converting 3D funnels? Establish an immediate direct socket connection:
                  </p>

                  <form onSubmit={handleTerminalSubmit} className="flex flex-col gap-3">
                    <div className="flex items-center bg-slate-950/60 p-3 rounded-xl border border-white/[0.08] focus-within:border-neon-cyan transition-colors">
                      <span className="text-neon-cyan font-bold select-none mr-2">
                        user@guest:~$
                      </span>
                      <input
                        type="email"
                        value={terminalEmail}
                        onChange={(e) => {
                          setTerminalEmail(e.target.value);
                          if (terminalStatus !== 'idle') setTerminalStatus('idle');
                        }}
                        placeholder="founder@studio.com"
                        disabled={terminalStatus === 'transmitting' || terminalStatus === 'connected'}
                        className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none text-xs font-mono"
                      />
                      <button
                        type="submit"
                        disabled={terminalStatus === 'transmitting' || terminalStatus === 'connected'}
                        className="ml-2 px-3 py-1 rounded-lg bg-neon-cyan hover:bg-neon-cyan/90 text-slate-950 font-bold text-xs transition-all disabled:opacity-50"
                      >
                        {terminalStatus === 'transmitting' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : terminalStatus === 'connected' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          'SEND'
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Terminal Execution Feedback */}
                  {terminalLog && (
                    <div
                      className={`text-[11px] p-2.5 rounded-lg border font-mono ${
                        terminalStatus === 'connected'
                          ? 'bg-green-500/10 border-green-500/30 text-green-300'
                          : terminalStatus === 'error'
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
                      }`}
                    >
                      {terminalLog}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/[0.06]">
                    <span>DISCORD // @iki.gpu</span>
                    <a 
                      href="https://github.com/nff747" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:underline"
                    >
                      GITHUB: nff747
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MINIMALIST STATUS FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 w-full px-6 lg:px-12 pb-4 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span>RUNTIME: OPTIMAL // ACES FILMIC // ZERO DOM WASTE</span>
        </div>
        <div>
          <span>© 2026 iKi // WebGL Performance Architecture</span>
        </div>
      </footer>
    </main>
  );
}
