'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Layers, 
  Code2, 
  Box, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ArrowLeft,
  X,
  Filter,
  CheckCircle2,
  FolderDown,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cyberAudio } from '@/utils/cyberAudio';
import { ScrambleText } from '@/components/CyberHUD';

interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  category: '3D & WebGPU' | 'AI & LLM' | 'High-Performance Systems' | 'Storage & Compilers';
  lang: string;
  badge: string;
  metric: string;
  description: string;
  nonCoderGuide: string;
  tags: string[];
  banner: string;
  githubUrl: string;
  zipUrl: string;
  accent: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'auto-rig-web',
    name: 'auto-rig-web',
    tagline: 'Zero-Click 3D Humanoid Auto-Rigging in a Web Worker',
    category: '3D & WebGPU',
    lang: 'TypeScript',
    badge: 'Three.js / ONNX',
    metric: '500ms Rigging // 60 FPS CCDIK',
    description: 'Autonomous client-side skeletal rigging engine. Ingests raw .obj/.gltf meshes, estimates 19-joint Vitruvian anatomical proportions, and generates biharmonic skinning weights inside an isolated Web Worker.',
    nonCoderGuide: 'Unzip the folder, open `examples/basic-usage.html` in your browser. Drop in any 3D humanoid character model to watch it automatically rig and pose!',
    tags: ['threejs', 'webgl', 'webgpu', 'onnx', 'animation', 'ik-solver'],
    banner: '/banners/auto-rig-web.jpg',
    githubUrl: 'https://github.com/nff747/auto-rig-web',
    zipUrl: 'https://github.com/nff747/auto-rig-web/archive/refs/heads/main.zip',
    accent: '#00f0ff'
  },
  {
    id: 'splat-bvh-core',
    name: 'splat-bvh-core',
    tagline: 'Real-Time Karras 2012 GPU LBVH for 3D Gaussian Splats',
    category: '3D & WebGPU',
    lang: 'WebGPU / WGSL',
    badge: 'WebGPU Compute',
    metric: 'Sub-ms Tree Rebuilds // Zero CPU Readbacks',
    description: 'GPU-resident Linear Bounding Volume Hierarchy builder written in pure WebGPU WGSL. Parallel 30-bit Morton coding, in-VRAM Bitonic sort, and Karras split search for fast raycasting and spatial querying.',
    nonCoderGuide: 'Open `demo/index.html` in Chrome/Edge (with WebGPU enabled) to view a real-time point-cloud BVH bounding box visualizer in 3D.',
    tags: ['webgpu', 'wgsl', '3dgs', 'gaussian-splats', 'bvh', 'bitonic-sort'],
    banner: '/banners/splat-bvh-core.jpg',
    githubUrl: 'https://github.com/nff747/splat-bvh-core',
    zipUrl: 'https://github.com/nff747/splat-bvh-core/archive/refs/heads/main.zip',
    accent: '#38bdf8'
  },
  {
    id: 'aerocache',
    name: 'aerocache',
    tagline: '13M ops/sec Zero-GC Off-Heap In-Memory Cache in Java',
    category: 'High-Performance Systems',
    lang: 'Java 21',
    badge: 'Off-Heap / Unsafe',
    metric: '13.4M ops/sec // 0.10µs P99 // 0 GC Pauses',
    description: 'HFT-grade Redis RESP2 cache server running over single-threaded Java NIO event loop. Allocates raw off-heap memory slabs via sun.misc.Unsafe with 13 segregated free lists and lock-striped concurrency.',
    nonCoderGuide: 'If you have Java installed, run `mvn test` or start the cache server to connect with any Redis CLI / GUI at port 6379.',
    tags: ['java21', 'redis', 'off-heap', 'unsafe', 'low-latency', 'zero-gc'],
    banner: '/banners/aerocache.jpg',
    githubUrl: 'https://github.com/nff747/aerocache',
    zipUrl: 'https://github.com/nff747/aerocache/archive/refs/heads/main.zip',
    accent: '#f59e0b'
  },
  {
    id: 'helix-lsm',
    name: 'helix-lsm',
    tagline: 'Distributed Lock-Free LSM-Tree Storage Engine in Rust',
    category: 'Storage & Compilers',
    lang: 'Rust',
    badge: 'Rust 1.80+ / EBR',
    metric: '1.4M+ Write IOPS // Consistent Hashing',
    description: 'Kernel-grade distributed LSM key-value database engine. Lock-free SkipList MemTable with Epoch-Based Reclamation, group-commit WAL with CRC-32, and cascading multi-level compaction cascades across L0-L6.',
    nonCoderGuide: 'Clean Rust library with full documentation. Run `cargo test` to execute the distributed cluster simulation and key-value benchmarks.',
    tags: ['rust', 'lsm-tree', 'lock-free', 'storage-engine', 'database', 'skiplist'],
    banner: '/banners/helix-lsm.jpg',
    githubUrl: 'https://github.com/nff747/helix-lsm',
    zipUrl: 'https://github.com/nff747/helix-lsm/archive/refs/heads/main.zip',
    accent: '#ef4444'
  },
  {
    id: 'swarm-refactor',
    name: 'swarm-refactor',
    tagline: 'Actor-Model Multi-Agent Code Self-Healing Framework',
    category: 'AI & LLM',
    lang: 'Python 3.12',
    badge: 'Actor Concurrency',
    metric: 'AST Security Gate // POSIX Sandbox',
    description: 'Enterprise-grade asynchronous multi-agent orchestrator inspired by Erlang/Akka. Manager, Worker, and Critic actors collaborate in an iterative test-eval loop to fix broken code and self-heal repositories.',
    nonCoderGuide: 'Install with `pip install -e .` and run `swarm-refactor --file your_code.py` to watch autonomous agents analyze and fix bugs automatically.',
    tags: ['python', 'ai-agents', 'actor-model', 'self-healing', 'sandbox', 'llm'],
    banner: '/banners/swarm-refactor.jpg',
    githubUrl: 'https://github.com/nff747/swarm-refactor',
    zipUrl: 'https://github.com/nff747/swarm-refactor/archive/refs/heads/main.zip',
    accent: '#a855f7'
  },
  {
    id: 'neural-texture-engine',
    name: 'neural-texture-engine',
    tagline: 'AI Real-Time Texture Super-Resolution in WebGPU & WebGL2',
    category: '3D & WebGPU',
    lang: 'WebGPU / TS',
    badge: 'Compute Super-Res',
    metric: '4x Dynamic Upscale // 16ms Fallback',
    description: 'Real-time neural and analytical texture upscaler for 3D web engines. Uses quantized weights with Laplacian edge enhancement and automatic capability profiling to fallback gracefully on mobile devices.',
    nonCoderGuide: 'Open `demo/index.html` in your browser to test live texture upscaling with a side-by-side split screen slider!',
    tags: ['webgpu', 'super-resolution', 'threejs', 'textures', 'webgl2', 'shaders'],
    banner: '/banners/neural-texture-engine.jpg',
    githubUrl: 'https://github.com/nff747/neural-texture-engine',
    zipUrl: 'https://github.com/nff747/neural-texture-engine/archive/refs/heads/main.zip',
    accent: '#ec4899'
  },
  {
    id: 'nova-wasm',
    name: 'nova-wasm',
    tagline: 'Sub-Millisecond Systems Language Compiling to WebAssembly',
    category: 'Storage & Compilers',
    lang: 'Rust',
    badge: 'Direct WASM Binary',
    metric: '<250µs Compile Time // No LLVM Overhead',
    description: 'Statically typed systems language bypassing LLVM entirely. Single-pass recursive descent parser, Pratt precedence expression climber, and direct Section 1-11 WASM bytecode emitter with dynamic linear memory.',
    nonCoderGuide: 'Compile `.nova` programs in milliseconds! Run `cargo run -- examples/collatz.nova` to output instantly executable `.wasm` binaries.',
    tags: ['webassembly', 'compiler', 'rust', 'wasm', 'programming-language', 'ast'],
    banner: '/banners/nova-wasm.jpg',
    githubUrl: 'https://github.com/nff747/nova-wasm',
    zipUrl: 'https://github.com/nff747/nova-wasm/archive/refs/heads/main.zip',
    accent: '#10b981'
  },
  {
    id: 'webgpu-vram-pager',
    name: 'webgpu-vram-pager',
    tagline: 'Async Ring Buffer VRAM Paging & Weight Streaming for In-Browser AI',
    category: 'High-Performance Systems',
    lang: 'WebGPU / TS',
    badge: 'VRAM Streaming',
    metric: 'Zero-Copy Ring Buffers // OOM Protection',
    description: 'Memory paging library preventing WebGPU out-of-memory crashes when loading multi-gigabyte LLMs or massive texture atlases. Employs asynchronous ring buffers and LRU page eviction policies.',
    nonCoderGuide: 'Open `demo/index.html` in your browser to see a live visual dashboard monitoring WebGPU GPU memory allocation and active streaming buffers.',
    tags: ['webgpu', 'vram', 'ring-buffer', 'memory-management', 'browser-llm', 'streaming'],
    banner: '/banners/webgpu-vram-pager.jpg',
    githubUrl: 'https://github.com/nff747/webgpu-vram-pager',
    zipUrl: 'https://github.com/nff747/webgpu-vram-pager/archive/refs/heads/main.zip',
    accent: '#6366f1'
  },
  {
    id: 'spatial-glass-ui',
    name: 'spatial-glass-ui',
    tagline: 'Zero-DOM Hardware-Accelerated Spatial Glassmorphism UI',
    category: '3D & WebGPU',
    lang: 'WebGL2 / React',
    badge: 'Phantom DOM a11y',
    metric: 'Physical Refraction // 60 FPS',
    description: 'Hardware-accelerated spatial glassmorphism interface rendered directly in WebGL2 shaders. Simulates true optical refraction, chromatic aberration, sensor-driven gyro parallax, and Phantom DOM screen-reader mirroring.',
    nonCoderGuide: 'Open `demo/index.html` to interact with floating glass holographic UI panels with realistic lighting, blur, and 3D depth.',
    tags: ['webgl2', 'glassmorphism', 'spatial-ui', 'parallax', 'react', 'shaders'],
    banner: '/banners/spatial-glass-ui.jpg',
    githubUrl: 'https://github.com/nff747/spatial-glass-ui',
    zipUrl: 'https://github.com/nff747/spatial-glass-ui/archive/refs/heads/main.zip',
    accent: '#06b6d4'
  },
  {
    id: 'edge-context-router',
    name: 'edge-context-router',
    tagline: 'Quantized Edge Semantic Context Router for LLMs',
    category: 'AI & LLM',
    lang: 'TypeScript',
    badge: 'Local Embeddings',
    metric: '83% API Cost Savings // Sub-5ms Routing',
    description: 'Hybrid edge-cloud context gateway. Evaluates query intent locally using quantized browser embeddings (@xenova/transformers) to resolve cached responses locally or route complex queries to upstream cloud LLMs.',
    nonCoderGuide: 'Run `npx edge-context-router` in your terminal to test interactive intent scoring and see how much cloud API cost you save.',
    tags: ['transformers', 'edge-ai', 'llm-routing', 'cost-optimizer', 'embeddings', 'quantized'],
    banner: '/banners/edge-context-router.jpg',
    githubUrl: 'https://github.com/nff747/edge-context-router',
    zipUrl: 'https://github.com/nff747/edge-context-router/archive/refs/heads/main.zip',
    accent: '#8b5cf6'
  }
];

const CATEGORIES = ['All Projects', '3D & WebGPU', 'AI & LLM', 'High-Performance Systems', 'Storage & Compilers'] as const;

export default function DownloadHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCLI, setCopiedCLI] = useState<'sh' | 'py' | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Background 3D canvas animation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ',
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(6, 9, 15, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopyClone = (project: ProjectItem) => {
    cyberAudio.playHoverBlip(880);
    const cmd = `git clone ${project.githubUrl}.git`;
    navigator.clipboard.writeText(cmd);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCLI = (type: 'sh' | 'py') => {
    cyberAudio.playHoverBlip(1050);
    const cmd = type === 'sh' 
      ? 'curl -sSL https://nff747.github.io/download.sh | bash'
      : 'python3 -c "$(curl -fsSL https://nff747.github.io/download.py)"';
    navigator.clipboard.writeText(cmd);
    setCopiedCLI(type);
    setTimeout(() => setCopiedCLI(null), 2500);
  };

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((item) => {
      const matchesCategory = selectedCategory === 'All Projects' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.lang.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-[#06090f] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Dynamic Particle Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Cyber Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-black/60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Top Navigation */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-6 mb-10 backdrop-blur-md bg-black/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-950/20">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors group"
            onClick={() => cyberAudio.playHoverBlip(600)}
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 group-hover:scale-105 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-400 font-mono">Return To</div>
              <div className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                iKi Portfolio & Neural HUD
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/nff747" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400/60 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all shadow-lg hover:shadow-cyan-500/10"
              onClick={() => cyberAudio.playHoverBlip(750)}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>github.com/nff747</span>
            </a>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>MIT Commercial License</span>
            </div>
          </div>
        </header>

        {/* Hero Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-4 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Open Source Download Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              Download Flagship Systems
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Instant 1-click downloads for all 10 deep-tech repositories. Completely free for personal and commercial applications under the open MIT license.
          </p>
        </div>

        {/* Universal One-Liner Quick Download Box */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-black/80 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
                <Terminal className="w-4 h-4" />
                <span>One-Command Automated Ecosystem Downloader</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                Download All 10 Projects in 1 Terminal Command
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
                Works on Linux, macOS, and Windows. Automatically downloads, unzips, and organizes every project into a clean local directory ready to explore.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => handleCopyCLI('sh')}
                className="flex items-center justify-between sm:justify-start gap-3 px-4 py-3 rounded-xl bg-cyan-950/70 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white text-xs font-mono transition-all group/btn shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="text-cyan-400 font-bold">$</span>
                  <span className="truncate">curl -sSL .../download.sh | bash</span>
                </div>
                <div className="flex items-center gap-1.5 pl-2 border-l border-cyan-500/30 text-cyan-400 font-sans font-medium shrink-0">
                  {copiedCLI === 'sh' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                      <span>Copy Bash</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleCopyCLI('py')}
                className="flex items-center justify-between sm:justify-start gap-3 px-4 py-3 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-mono transition-all group/btn shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="text-purple-400 font-bold">$</span>
                  <span className="truncate">python3 download.py</span>
                </div>
                <div className="flex items-center gap-1.5 pl-2 border-l border-purple-500/30 text-purple-400 font-sans font-medium shrink-0">
                  {copiedCLI === 'py' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                      <span>Copy Python</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search Engine & Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, technology (WebGPU, Rust, Three.js, Python), or feature... (Press '/' to focus)"
              className="w-full pl-12 pr-12 py-3.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-md shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Pills & Result Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      cyberAudio.playHoverBlip(650);
                      setSelectedCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-slate-400">
              Showing <span className="text-cyan-400 font-bold">{filteredProjects.length}</span> of {PROJECTS.length} projects
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No matching projects found</h3>
            <p className="text-slate-500 text-sm mt-1">Try refining your search keyword or clearing the filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Projects');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono hover:bg-cyan-900/40 transition-all"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project, idx) => {
              const isCopied = copiedId === project.id;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-black/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-cyan-950/30 group"
                >
                  <div>
                    {/* Banner Image Preview with Scanline FX */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                      <img
                        src={project.banner}
                        alt={project.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 font-semibold shadow-md">
                          {project.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-emerald-400 font-semibold shadow-md">
                          {project.lang}
                        </span>
                      </div>

                      {/* Metric Tag on Bottom of Banner */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{project.metric}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {project.name}
                        </h3>
                        <button
                          onClick={() => setActiveModalProject(project)}
                          className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 border border-slate-700/60 hover:border-cyan-500/40 transition-all shrink-0"
                          title="View Setup & Non-Coder Guide"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Guide</span>
                        </button>
                      </div>

                      <p className="text-slate-300 text-xs sm:text-sm mb-4 line-clamp-2">
                        {project.tagline}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-black/40 flex flex-wrap items-center justify-between gap-2">
                    {/* Primary Action: Direct ZIP Download */}
                    <a
                      href={project.zipUrl}
                      download
                      onClick={() => cyberAudio.playHoverBlip(1000)}
                      className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Download .ZIP</span>
                    </a>

                    {/* Secondary Action: Copy Git Clone */}
                    <button
                      onClick={() => handleCopyClone(project)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-all"
                      title="Copy git clone command"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Clone</span>
                        </>
                      )}
                    </button>

                    {/* Tertiary Action: View GitHub */}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => cyberAudio.playHoverBlip(700)}
                      className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all"
                      title="View source on GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Non-Coder Step-by-Step Guide Section */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Beginner & Non-Coder Quick Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            How to Use and Run These Projects in 3 Simple Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-black/40 border border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-white text-base mb-1">Click &quot;Download .ZIP&quot;</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Choose any project card above and click the cyan Download button. Your browser will download the complete source code archive immediately with no logins or subscriptions needed.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center font-mono font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-white text-base mb-1">Extract the Folder</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Right-click the downloaded `.zip` file on your computer and select &quot;Extract All&quot; (Windows) or double-click to unzip (macOS/Linux).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-white text-base mb-1">Open Demos or README</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Most web projects include a `demo/index.html` or `examples/` that you can double-click to run in your browser immediately, or inspect the step-by-step `README.md`.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guide Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
                <span>{activeModalProject.category}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {activeModalProject.name}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-6">
                {activeModalProject.description}
              </p>

              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 mb-6">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  <span>How to Open & Run (Non-Coder Friendly)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {activeModalProject.nonCoderGuide}
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={activeModalProject.zipUrl}
                  download
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download .ZIP Now</span>
                </a>
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
