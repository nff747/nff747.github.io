"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Download, FolderArchive, CheckCircle2, Terminal, 
  ExternalLink, X, ShieldCheck, HardDrive, 
  Lock, Copy, Check, Sparkles, ChevronLeft, ChevronRight, LayoutGrid, Monitor
} from 'lucide-react';
import { HolographicPod } from '../../components/HolographicPod';

// ── TYPES ──
type ProjectItem = {
  id: string;
  sysId: string;
  name: string;
  tagline: string;
  category: string;
  lang: string;
  badge: string;
  metric: string;
  description: string;
  nonCoderGuide: string[];
  cliQuickstart: string;
  fileTree: string[];
  tags: string[];
  githubUrl: string;
  zipUrl: string;
  accent: string;
};

// ── DATA ──
const PROJECTS: ProjectItem[] = [
  {
    id: 'lumina-wgsl',
    sysId: 'SYS_11',
    name: 'lumina-wgsl',
    tagline: 'Real-Time WebGPU Volumetric Light Scattering & Eulerian Fluid Solver in WGSL',
    category: '3D & WebGPU',
    lang: 'WGSL / TS',
    badge: 'WebGPU Compute',
    metric: 'Zero-Copy VRAM // Henyey-Greenstein Mie Scattering',
    description: 'High-throughput 3D Eulerian Navier-Stokes fluid dynamics and ray-marched volumetric light scattering executing 100% in VRAM via WebGPU compute passes.',
    nonCoderGuide: [
      'Extract the zip archive to any folder on your computer.',
      'Double-click `examples/index.html` to open the interactive simulation in any modern browser (Chrome, Brave, Edge).',
      'Click and drag on the screen to inject fluid smoke and watch real-time volumetric light scattering interact with the vortex.'
    ],
    cliQuickstart: 'npm install && npm test',
    fileTree: ['src/core/LuminaSimulator.ts', 'src/core/VolumetricRenderer.ts', 'src/shaders/advect.wgsl.ts', 'examples/index.html'],
    tags: ['webgpu', 'wgsl', 'fluid-dynamics', 'navier-stokes', 'volumetric-lighting', 'ray-marching'],
    githubUrl: 'https://github.com/nff747/lumina-wgsl',
    zipUrl: 'https://github.com/nff747/lumina-wgsl/archive/refs/heads/main.zip',
    accent: '#06b6d4'
  },

  {
    id: 'auto-rig-web',
    sysId: 'SYS_01',
    name: 'auto-rig-web',
    tagline: 'Zero-Click 3D Humanoid Auto-Rigging in Web Worker',
    category: '3D & WebGPU',
    lang: 'TypeScript',
    badge: 'Three.js / ONNX',
    metric: '500ms Rigging // 60 FPS CCDIK',
    description: 'Autonomous zero-click 3D humanoid skeleton generation, ONNX landmark prediction, and bi-harmonic weight painting inside a zero-copy Web Worker.',
    nonCoderGuide: [
      'Extract the zip archive to any folder on your computer.',
      'Open the `demo/index.html` file in any modern web browser (Chrome, Edge, Safari, Firefox).',
      'Drag and drop any standard 3D humanoid mesh (.obj or .gltf) to instantly rig and animate.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/AutoRigger.ts', 'src/worker/rigWorker.ts', 'src/solvers/CCDIKSolver.ts', 'demo/index.html'],
    tags: ['threejs', 'onnx', 'webgl', 'web-worker', 'ik-solver', 'auto-rigging', 'animation'],
    githubUrl: 'https://github.com/nff747/auto-rig-web',
    zipUrl: 'https://github.com/nff747/auto-rig-web/archive/refs/heads/main.zip',
    accent: '#06b6d4'
  },
  {
    id: 'splat-bvh-core',
    sysId: 'SYS_02',
    name: 'splat-bvh-core',
    tagline: 'Real-Time Karras 2012 GPU LBVH for 3D Gaussian Splats',
    category: '3D & WebGPU',
    lang: 'WGSL / TS',
    badge: 'WebGPU Compute',
    metric: '1.2M+ Splat Traversal // 60 FPS',
    description: 'Hardware-accelerated Linear Bounding Volume Hierarchy (LBVH) compute pipeline in WGSL for 3D Gaussian Splatting with 64-bit Morton codes.',
    nonCoderGuide: [
      'Download and decompress the archive folder.',
      'Launch `demo/index.html` inside a WebGPU-enabled browser (Google Chrome, Microsoft Edge, Brave).',
      'Interact with the 3D Gaussian Splat scene with ray-casted spatial selection.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/BVHBuilder.ts', 'src/shaders/bvhBuild.wgsl.ts', 'src/shaders/radixSort.wgsl.ts', 'demo/index.html'],
    tags: ['webgpu', 'wgsl', 'gaussian-splatting', 'bvh', 'compute-shader', 'radix-sort'],
    githubUrl: 'https://github.com/nff747/splat-bvh-core',
    zipUrl: 'https://github.com/nff747/splat-bvh-core/archive/refs/heads/main.zip',
    accent: '#ec4899'
  },
  {
    id: 'aerocache',
    sysId: 'SYS_03',
    name: 'aerocache',
    tagline: '13M+ ops/sec Zero-GC Off-Heap In-Memory Cache in Java 21',
    category: 'High-Performance Systems',
    lang: 'Java 21',
    badge: 'Java Foreign Memory',
    metric: '13.4M Ops/sec // 0.10µs P99 Latency',
    description: 'Zero-GC, off-heap in-memory key-value cache built on Java 21 Panama Foreign Function & Memory API with RESP protocol wire server.',
    nonCoderGuide: [
      'Extract the downloaded folder.',
      'Ensure Java 21+ and Maven are installed on your machine.',
      'Run `mvn test` to execute the full benchmark and verification suite, or start the server on port 6379.'
    ],
    cliQuickstart: 'mvn clean test',
    fileTree: ['src/main/java/cache/AeroCache.java', 'src/main/java/memory/OffHeapArena.java', 'src/main/java/net/RespServer.java'],
    tags: ['java21', 'redis', 'off-heap', 'unsafe', 'low-latency', 'zero-gc'],
    githubUrl: 'https://github.com/nff747/aerocache',
    zipUrl: 'https://github.com/nff747/aerocache/archive/refs/heads/main.zip',
    accent: '#f59e0b'
  },
  {
    id: 'helix-lsm',
    sysId: 'SYS_04',
    name: 'helix-lsm',
    tagline: 'Distributed Lock-Free LSM-Tree Storage Engine in Rust',
    category: 'Storage & Compilers',
    lang: 'Rust',
    badge: 'Rust 1.80+ / EBR',
    metric: '1.4M+ Write IOPS // Consistent Hashing',
    description: 'Kernel-grade distributed LSM key-value database engine. Features a lock-free SkipList MemTable with Epoch-Based Reclamation (EBR) and multi-level compaction.',
    nonCoderGuide: [
      'Unzip the source archive.',
      'Open a terminal inside the directory and run `cargo test`.',
      'The automated test suite will spin up an in-memory 3-node distributed cluster and benchmark write throughput.'
    ],
    cliQuickstart: 'cargo test --release',
    fileTree: ['src/memtable/skiplist.rs', 'src/wal/log_writer.rs', 'src/sstable/builder.rs', 'src/cluster/hash_ring.rs'],
    tags: ['rust', 'lsm-tree', 'lock-free', 'storage-engine', 'database', 'skiplist'],
    githubUrl: 'https://github.com/nff747/helix-lsm',
    zipUrl: 'https://github.com/nff747/helix-lsm/archive/refs/heads/main.zip',
    accent: '#ef4444'
  },
  {
    id: 'swarm-refactor',
    sysId: 'SYS_05',
    name: 'swarm-refactor',
    tagline: 'Actor-Model Multi-Agent Code Self-Healing Framework',
    category: 'AI & LLM',
    lang: 'Python 3.12',
    badge: 'Actor Concurrency',
    metric: 'AST Security Gate // POSIX Sandbox',
    description: 'Asynchronous multi-agent orchestrator. Manager, Worker, and Critic actors collaborate in an iterative test-eval loop to repair and verify codebases.',
    nonCoderGuide: [
      'Extract the project files.',
      'Install with `pip install -e .` in your Python 3.11+ environment.',
      'Run `swarm-refactor --file broken_code.py` to watch autonomous agents inspect, patch, and verify the file.'
    ],
    cliQuickstart: 'pytest tests/',
    fileTree: ['swarm/manager.py', 'swarm/worker.py', 'swarm/critic.py', 'swarm/sandbox.py'],
    tags: ['python', 'ai-agents', 'actor-model', 'self-healing', 'sandbox', 'llm'],
    githubUrl: 'https://github.com/nff747/swarm-refactor',
    zipUrl: 'https://github.com/nff747/swarm-refactor/archive/refs/heads/main.zip',
    accent: '#a855f7'
  },
  {
    id: 'neural-texture-engine',
    sysId: 'SYS_06',
    name: 'neural-texture-engine',
    tagline: 'AI Real-Time Texture Super-Resolution in WebGPU & WebGL2',
    category: '3D & WebGPU',
    lang: 'WebGPU / TS',
    badge: 'Compute Super-Res',
    metric: '4x Dynamic Upscale // 16ms Fallback',
    description: 'Real-time neural texture upscaler for 3D web runtimes. Uses quantized tensor weights with Laplacian edge enhancement and hardware capability profiling.',
    nonCoderGuide: [
      'Extract the zip archive.',
      'Open `demo/index.html` in your browser.',
      'Use the split-screen slider to compare low-resolution source textures against the live 4x neural upscaled result.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/NeuralTextureEngine.ts', 'src/core/WebGPUCapabilityProfiler.ts', 'src/ai/QuantizedModel.ts', 'demo/index.html'],
    tags: ['webgpu', 'super-resolution', 'threejs', 'textures', 'webgl2', 'shaders'],
    githubUrl: 'https://github.com/nff747/neural-texture-engine',
    zipUrl: 'https://github.com/nff747/neural-texture-engine/archive/refs/heads/main.zip',
    accent: '#ec4899'
  },
  {
    id: 'nova-wasm',
    sysId: 'SYS_07',
    name: 'nova-wasm',
    tagline: 'Sub-Millisecond Systems Language Compiling to WebAssembly',
    category: 'Storage & Compilers',
    lang: 'Rust',
    badge: 'Direct WASM Binary',
    metric: '<250µs Compile Time // Zero LLVM',
    description: 'Statically typed systems programming language bypassing LLVM entirely with direct Section 1-11 WASM binary byte emitter.',
    nonCoderGuide: [
      'Extract the folder and open a terminal inside.',
      'Run `cargo run -- examples/collatz.nova`.',
      'The compiler will instantly output an optimized `.wasm` binary that runs directly in Node.js or browsers.'
    ],
    cliQuickstart: 'cargo test && cargo run -- examples/collatz.nova',
    fileTree: ['src/lexer/mod.rs', 'src/parser/pratt.rs', 'src/emitter/wasm_encoder.rs', 'examples/collatz.nova'],
    tags: ['webassembly', 'compiler', 'rust', 'wasm', 'programming-language', 'ast'],
    githubUrl: 'https://github.com/nff747/nova-wasm',
    zipUrl: 'https://github.com/nff747/nova-wasm/archive/refs/heads/main.zip',
    accent: '#10b981'
  },
  {
    id: 'webgpu-vram-pager',
    sysId: 'SYS_08',
    name: 'webgpu-vram-pager',
    tagline: 'Async Ring Buffer VRAM Paging & Streaming for Browser AI',
    category: 'High-Performance Systems',
    lang: 'WebGPU / TS',
    badge: 'VRAM Streaming',
    metric: 'Zero-Copy Ring Buffers // OOM Guard',
    description: 'Memory paging system preventing WebGPU out-of-memory crashes when loading multi-gigabyte LLMs or massive textures in browser.',
    nonCoderGuide: [
      'Extract the zip archive to your machine.',
      'Open `demo/index.html` in Chrome or Brave.',
      'Watch the live telemetry dashboard stream simulated multi-gigabyte AI tensor weights into bounded VRAM chunks.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/VRAMPager.ts', 'src/core/RingBuffer.ts', 'src/core/MemoryBudget.ts', 'demo/index.html'],
    tags: ['webgpu', 'vram', 'ring-buffer', 'memory-management', 'browser-llm', 'streaming'],
    githubUrl: 'https://github.com/nff747/webgpu-vram-pager',
    zipUrl: 'https://github.com/nff747/webgpu-vram-pager/archive/refs/heads/main.zip',
    accent: '#6366f1'
  },
  {
    id: 'spatial-glass-ui',
    sysId: 'SYS_09',
    name: 'spatial-glass-ui',
    tagline: 'Zero-DOM Hardware-Accelerated Spatial Glassmorphism UI',
    category: '3D & WebGPU',
    lang: 'WebGL2 / React',
    badge: 'Phantom DOM a11y',
    metric: 'Physical Refraction // 60 FPS',
    description: 'Hardware-accelerated spatial glassmorphism UI rendered in WebGL2 shaders with optical refraction, chromatic dispersion, and Phantom DOM a11y.',
    nonCoderGuide: [
      'Unzip the package.',
      'Open `demo/index.html` in any modern web browser.',
      'Move your cursor over the floating holographic frosted glass cards to experience optical refraction and light dispersion.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/SpatialEngine.ts', 'src/components/GlassPanel.tsx', 'src/a11y/PhantomDOM.ts', 'demo/index.html'],
    tags: ['webgl2', 'glassmorphism', 'spatial-ui', 'parallax', 'react', 'shaders'],
    githubUrl: 'https://github.com/nff747/spatial-glass-ui',
    zipUrl: 'https://github.com/nff747/spatial-glass-ui/archive/refs/heads/main.zip',
    accent: '#06b6d4'
  },
  {
    id: 'edge-context-router',
    sysId: 'SYS_10',
    name: 'edge-context-router',
    tagline: 'Quantized Vector Semantic Router for Low-Cost LLM Edge Inference',
    category: 'AI & LLM',
    lang: 'TypeScript / Node',
    badge: 'ONNX Embeddings',
    metric: '72% Cloud LLM Token Cost Reduction',
    description: 'Smart context router using quantized local embeddings to route simple user prompts to cheap edge models while cascading complex prompts to cloud LLMs.',
    nonCoderGuide: [
      'Extract the zip archive.',
      'Install dependencies with `npm install`.',
      'Run `npm start` to see live semantic routing decisions categorized in real time.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/EdgeRouter.ts', 'src/models/EmbeddingPipeline.ts', 'src/cache/VectorCache.ts', 'examples/cli.ts'],
    tags: ['transformers', 'edge-ai', 'llm-routing', 'cost-optimizer', 'embeddings', 'quantized'],
    githubUrl: 'https://github.com/nff747/edge-context-router',
    zipUrl: 'https://github.com/nff747/edge-context-router/archive/refs/heads/main.zip',
    accent: '#8b5cf6'
  }
];

const CATEGORIES = ['All Repositories', '3D & WebGPU', 'AI & LLM', 'High Performance', 'Storage & Compilers'] as const;

// ── AUDIO SYSTEM ──
const useCyberAudio = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  const playHoverBlip = (freq = 800) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  };

  return { playHoverBlip };
};

export default function DownloadHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Repositories');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [activeTab, setActiveTab] = useState<'bash' | 'python' | 'batch'>('bash');
  const [copied, setCopied] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'console' | 'grid'>('console');

  const cyberAudio = useCyberAudio();

  const commands = {
    bash: 'curl -sSL https://nff747.github.io/download.sh | bash',
    python: 'curl -sSL https://nff747.github.io/download.py | python3',
    batch: 'powershell -Command "irm https://nff747.github.io/download.ps1 | iex"'
  };

  const handleCopy = () => {
    cyberAudio.playHoverBlip(1100);
    navigator.clipboard.writeText(commands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── FILTER PROJECTS ──
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || 
                            p.description.toLowerCase().includes(q) ||
                            p.tagline.toLowerCase().includes(q) ||
                            p.tags.some(t => t.toLowerCase().includes(q));
      
      let matchesCategory = true;
      if (selectedCategory === '3D & WebGPU') matchesCategory = p.category === '3D & WebGPU';
      else if (selectedCategory === 'AI & LLM') matchesCategory = p.category === 'AI & LLM';
      else if (selectedCategory === 'High Performance') matchesCategory = p.category === 'High-Performance Systems';
      else if (selectedCategory === 'Storage & Compilers') matchesCategory = p.category === 'Storage & Compilers';

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const maxPage = Math.max(0, Math.ceil(filteredProjects.length / 2) - 1);
  const visibleProjects = viewMode === 'console' 
    ? filteredProjects.slice(pageIndex * 2, pageIndex * 2 + 2)
    : filteredProjects;

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden p-2 md:p-6 lg:p-8 flex flex-col items-center justify-center">
      
      {/* ── CYBERDECK OUTER CHASSIS FRAME ── */}
      <div className="relative w-full max-w-[1580px] rounded-3xl bg-[#0b1019] border-2 border-slate-700/60 shadow-[0_0_120px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        
        {/* TOP INDUSTRIAL HINGE & COOLING CYLINDER BAR */}
        <div className="h-10 bg-gradient-to-b from-[#1c2434] to-[#0d131f] border-b-2 border-slate-700/80 px-8 flex items-center justify-between select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600/80 border border-red-400/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="w-3 h-3 rounded-full bg-amber-600/80 border border-amber-400/50 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="w-3 h-3 rounded-full bg-emerald-600/80 border border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-16 h-2 rounded-full bg-slate-800 border border-slate-600/60 shadow-inner" />
              <div className="w-6 h-3 rounded bg-slate-700 border border-slate-500/80" />
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              MAINFRAME TERMINAL // CHASSIS-RIG 2400-X
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="hidden md:inline text-slate-500">HOST: GITHUB PAGES CDN</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              PORT: 443 HTTPS
            </div>
          </div>
        </div>

        {/* MAIN TERMINAL SCREEN ENCLOSURE */}
        <div className="relative flex-1 bg-[#02050b] flex flex-col">
          
          {/* LEFT & RIGHT SERVER BLADE RACKS WITH GLOWING CABLES */}
          <div className="absolute left-0 top-0 bottom-0 w-12 hidden 2xl:flex flex-col items-center justify-between py-8 bg-[#080d17] border-r-2 border-slate-800/80 z-20 select-none">
            <div className="space-y-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-ping" />
              <div className="w-1.5 h-32 rounded bg-gradient-to-b from-cyan-500 via-emerald-500 to-yellow-500 opacity-80" />
              <div className="w-1.5 h-32 rounded bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 opacity-80" />
            </div>
            <div className="rotate-90 font-mono text-[9px] text-slate-500 tracking-widest">
              BLADE_RACK_01 // 64Gb/s
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-12 hidden 2xl:flex flex-col items-center justify-between py-8 bg-[#080d17] border-l-2 border-slate-800/80 z-20 select-none">
            <div className="space-y-4">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-pulse" />
              <div className="w-1.5 h-32 rounded bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 opacity-80" />
              <div className="w-1.5 h-32 rounded bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 opacity-80" />
            </div>
            <div className="-rotate-90 font-mono text-[9px] text-slate-500 tracking-widest">
              BLADE_RACK_02 // 64Gb/s
            </div>
          </div>

          {/* SCREEN INNER CONTENT */}
          <div className="p-4 sm:p-8 lg:p-12 2xl:px-24 flex-1 flex flex-col space-y-8">
            
            {/* ── TOP BROWSER & HUD STATUS BAR ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-[#090f1d] border border-cyan-500/20 shadow-md font-mono text-xs">
              
              <div className="flex-1 min-w-[280px] max-w-xl flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[#04070f] border border-white/10 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-bold tracking-wide">nff747.github.io/download/</span>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>REPOSITORY: 10 / 10 ACTIVE</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DUAL USE LICENSE (MIT)</span>
                </div>

                <a
                  href="https://github.com/nff747"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => cyberAudio.playHoverBlip(1000)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* ── HERO TITLE BANNER ── */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                OBJECT ARTIFACT GITHUB COMPILER ARCHITECTURES
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 tracking-tight drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                FLAGSHIP SYSTEMS REGISTRY
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-4xl font-light leading-relaxed">
                Zero-dependency, high-throughput client/server libraries, GPU LBVH trees, and LLVM-bypassing binary emitters. Unrestricted open-source distribution under MIT.
              </p>
            </div>

            {/* ── AUTOMATED COMPILATION DOWNLOADER DOCK ── */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-[#091122] to-[#040813] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>AUTOMATED COMPILATION DOWNLD LOADER</span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/60 border border-white/10 text-xs">
                  {(['bash', 'python', 'batch'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        cyberAudio.playHoverBlip(950);
                        setActiveTab(tab);
                      }}
                      className={`px-3 py-1 rounded font-bold uppercase transition-all ${
                        activeTab === tab
                          ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab === 'bash' ? 'bash (curl | raw)' : tab === 'python' ? 'Python 3 (Cross-Platform)' : 'Batch / Windows'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command Box */}
              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-black/80 border border-cyan-500/40 font-mono">
                <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-sm text-cyan-300">
                  <span className="text-purple-400 font-bold select-none">$</span>
                  <span className="selection:bg-cyan-500 selection:text-black">{commands[activeTab]}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  <span>{copied ? 'COPIED!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* ── SEARCH & CATEGORY FILTER REGISTRY BAR ── */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search registry by identifier, tech stack (Rust, WGSL, WebGPU, High-Performance), or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => cyberAudio.playHoverBlip(1200)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#080e1b] border border-cyan-500/30 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        cyberAudio.playHoverBlip(900);
                        setSelectedCategory(cat);
                        setPageIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg border font-bold uppercase tracking-wider transition-all ${
                        selectedCategory === cat
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* View Switcher & Counter */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => {
                        cyberAudio.playHoverBlip(850);
                        setViewMode('console');
                      }}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 text-[11px] font-bold ${
                        viewMode === 'console' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>DUAL POD CONSOLE</span>
                    </button>
                    <button
                      onClick={() => {
                        cyberAudio.playHoverBlip(850);
                        setViewMode('grid');
                      }}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 text-[11px] font-bold ${
                        viewMode === 'grid' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>ALL GRID</span>
                    </button>
                  </div>

                  <div className="text-slate-400 font-mono text-[11px] hidden sm:flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>TRACKING: {filteredProjects.length} / 10 REPOSITORIES // READY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3D HOLOGRAPHIC PODS REGISTRY DISPLAY ── */}
            {viewMode === 'console' ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {visibleProjects.map((project) => (
                    <HolographicPod
                      key={project.id}
                      project={project}
                      onOpenDetails={(p) => setActiveModalProject(p)}
                      onAudioBlip={(freq) => cyberAudio.playHoverBlip(freq)}
                    />
                  ))}
                </div>

                {/* Console Navigation Bar */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#070c17] border border-cyan-500/30 font-mono text-xs">
                  <button
                    disabled={pageIndex === 0}
                    onClick={() => {
                      cyberAudio.playHoverBlip(700);
                      setPageIndex((p) => Math.max(0, p - 1));
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold border border-white/10 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>PREV PODS</span>
                  </button>

                  <div className="text-cyan-400 font-bold tracking-widest">
                    CONSOLE TRAY // PAGE {pageIndex + 1} OF {maxPage + 1}
                  </div>

                  <button
                    disabled={pageIndex >= maxPage}
                    onClick={() => {
                      cyberAudio.playHoverBlip(700);
                      setPageIndex((p) => Math.min(maxPage, p + 1));
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
                  >
                    <span>NEXT PODS</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pt-2">
                {filteredProjects.map((project) => (
                  <HolographicPod
                    key={project.id}
                    project={project}
                    onOpenDetails={(p) => setActiveModalProject(p)}
                    onAudioBlip={(freq) => cyberAudio.playHoverBlip(freq)}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

        {/* ── BOTTOM INDUSTRIAL HARDWARE CONTROL BEZEL WITH PORTS ── */}
        <div className="h-16 bg-gradient-to-t from-[#090d16] to-[#141b2b] border-t-2 border-slate-700/80 px-8 flex items-center justify-between select-none">
          <div className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>nff747 MAINFRAME V2.4 // HARDWARE BUS 100% OPERATIONAL</span>
          </div>

          {/* Realistic High-Tech Hardware Ports Bay */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-[9px] text-slate-400">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>HDMI / DP</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>USB-C 4.0</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>OPTICAL</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span>S/PDIF</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>10GbE LAN</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>AUDIO 3.5mm</span>
            </div>
          </div>

          <div className="font-mono text-[10px] text-slate-500">
            SYS-ID: NFF747-CORE
          </div>
        </div>

      </div>

      {/* ── HOLOGRAPHIC SPECIFICATION MODAL ── */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#090e1a] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.25)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#050912] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                    {activeModalProject.sysId}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{activeModalProject.name}</h3>
                    <div className="text-xs text-cyan-300/80">{activeModalProject.tagline}</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
                <div>
                  <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] mb-2">
                    ARCHITECTURE OVERVIEW
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                    {activeModalProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    BEGINNER QUICKSTART GUIDE (NO CODING REQUIRED)
                  </h4>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2 text-slate-300">
                    <ol className="list-decimal list-inside space-y-1.5">
                      {activeModalProject.nonCoderGuide.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-purple-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    DEVELOPER CLI VERIFICATION
                  </h4>
                  <div className="bg-black/60 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
                    <div className="text-slate-200 truncate font-mono">
                      <span className="text-purple-400 select-none mr-2 font-bold">$</span>
                      {activeModalProject.cliQuickstart}
                    </div>
                    <button
                      onClick={() => {
                        cyberAudio.playHoverBlip(900);
                        navigator.clipboard.writeText(activeModalProject.cliQuickstart);
                      }}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] shrink-0 font-bold"
                    >
                      COPY
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <FolderArchive className="w-4 h-4" />
                    DIRECTORY ENTRYPOINTS
                  </h4>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1 text-slate-300 font-mono">
                    {activeModalProject.fileTree.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-slate-600">├──</span>
                        <span className="text-amber-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#050912] border-t border-white/10">
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>VIEW ON GITHUB</span>
                </a>

                <a
                  href={activeModalProject.zipUrl}
                  download
                  onClick={() => cyberAudio.playHoverBlip(1000)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>DOWNLOAD ARCHIVE (.ZIP)</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
