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
  Cpu, 
  Layers, 
  Code2, 
  Box, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ArrowLeft,
  X,
  CheckCircle2,
  FolderDown,
  FolderArchive,
  BookOpen,
  SlidersHorizontal,
  Activity,
  GitBranch,
  FileCode2,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cyberAudio } from '@/utils/cyberAudio';
import { ProjectBlueprint } from '@/components/ArchitectureBlueprints';

interface ProjectItem {
  id: string;
  sysId: string;
  name: string;
  tagline: string;
  category: '3D & WebGPU' | 'AI & LLM' | 'High-Performance Systems' | 'Storage & Compilers';
  lang: string;
  badge: string;
  metric: string;
  description: string;
  nonCoderGuide: string[];
  cliQuickstart: string;
  tags: string[];
  githubUrl: string;
  zipUrl: string;
  accent: string;
  fileTree: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'auto-rig-web',
    sysId: 'SYS_01',
    name: 'auto-rig-web',
    tagline: 'Zero-Click 3D Humanoid Auto-Rigging in Web Worker',
    category: '3D & WebGPU',
    lang: 'TypeScript',
    badge: 'Three.js / ONNX',
    metric: '500ms Rigging // 60 FPS CCDIK',
    description: 'Autonomous client-side skeletal rigging engine. Ingests raw .obj/.gltf meshes, estimates 19-joint Vitruvian anatomical proportions, and computes biharmonic skinning weights inside an isolated Web Worker via SharedArrayBuffer.',
    nonCoderGuide: [
      'Download and extract the .zip file to any folder.',
      'Navigate to `examples/basic-usage.html` and double-click to open it in Chrome, Brave, or Edge.',
      'Drag and drop any 3D humanoid character mesh (.obj or .gltf) to watch it auto-rig and animate in real time.'
    ],
    cliQuickstart: 'npm install && npm test',
    fileTree: ['src/core/AutoRigger.ts', 'src/worker/rigWorker.ts', 'src/math/CCDIKSolver.ts', 'examples/basic-usage.html'],
    tags: ['threejs', 'webgl', 'webgpu', 'onnx', 'animation', 'ik-solver'],
    githubUrl: 'https://github.com/nff747/auto-rig-web',
    zipUrl: 'https://github.com/nff747/auto-rig-web/archive/refs/heads/main.zip',
    accent: '#00f0ff'
  },
  {
    id: 'splat-bvh-core',
    sysId: 'SYS_02',
    name: 'splat-bvh-core',
    tagline: 'Real-Time Karras 2012 GPU LBVH for 3D Gaussian Splats',
    category: '3D & WebGPU',
    lang: 'WebGPU / WGSL',
    badge: 'WebGPU Compute',
    metric: 'Sub-ms Rebuilds // Zero CPU Readbacks',
    description: 'GPU-resident Linear Bounding Volume Hierarchy builder in WebGPU WGSL. Employs parallel 30-bit Morton coding, in-VRAM bitonic radix sort, and Karras split search for raycasting and frustum culling without CPU memory roundtrips.',
    nonCoderGuide: [
      'Extract the .zip package to your local drive.',
      'Open `demo/index.html` in Chrome or Edge with WebGPU enabled.',
      'Interact with the 3D point cloud and observe real-time spatial bounding boxes adapting at 60 FPS.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/BVHBuilder.ts', 'src/shaders/bvhBuild.wgsl.ts', 'src/math/morton.ts', 'demo/index.html'],
    tags: ['webgpu', 'wgsl', '3dgs', 'gaussian-splats', 'bvh', 'bitonic-sort'],
    githubUrl: 'https://github.com/nff747/splat-bvh-core',
    zipUrl: 'https://github.com/nff747/splat-bvh-core/archive/refs/heads/main.zip',
    accent: '#38bdf8'
  },
  {
    id: 'aerocache',
    sysId: 'SYS_03',
    name: 'aerocache',
    tagline: '13M ops/sec Zero-GC Off-Heap In-Memory Cache in Java',
    category: 'High-Performance Systems',
    lang: 'Java 21',
    badge: 'Off-Heap Unsafe',
    metric: '13.4M ops/sec // 0.10µs P99 // 0.0ms GC',
    description: 'Ultra-low-latency Redis RESP2 compatible cache server running on a single-threaded Java NIO event loop. Allocates raw off-heap memory slabs via sun.misc.Unsafe with 13 segregated free lists and lock-striped concurrency.',
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
    description: 'Kernel-grade distributed LSM key-value database engine. Features a lock-free SkipList MemTable with Epoch-Based Reclamation (EBR), group-commit WAL with CRC-32 verification, and multi-level compaction cascading across L0-L6.',
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
    description: 'Asynchronous multi-agent orchestrator inspired by Erlang/Akka. Manager, Worker, and Critic actors collaborate in an iterative test-eval loop to locate syntax errors, synthesize AST patches, and self-heal Python codebases safely.',
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
    description: 'Real-time neural and analytical texture upscaler for 3D web runtimes. Uses quantized tensor weights with Laplacian edge enhancement and hardware capability profiling to fallback gracefully on low-power mobile devices.',
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
    description: 'Statically typed systems programming language bypassing LLVM entirely. Employs a single-pass recursive descent parser, Pratt expression climber, and direct Section 1-11 WASM binary byte emitter with linear memory intrinsics.',
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
    description: 'Memory paging system preventing WebGPU out-of-memory browser crashes when loading multi-gigabyte LLMs or massive textures. Employs asynchronous circular staging buffers, queue.writeBuffer streaming, and LRU page eviction.',
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
    description: 'Hardware-accelerated spatial glassmorphism UI rendered in WebGL2 fragment shaders. Simulates optical refraction, chromatic dispersion, sensor-driven gyro parallax, and synchronizes with an invisible Phantom DOM for full screen-reader a11y.',
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
    tagline: 'Quantized Edge Semantic Context Router for LLMs',
    category: 'AI & LLM',
    lang: 'TypeScript',
    badge: 'Local Embeddings',
    metric: '83% API Cost Savings // Sub-5ms Routing',
    description: 'Hybrid edge-cloud context gateway. Evaluates user query intent locally using quantized browser embeddings (@xenova/transformers) to resolve cached responses immediately or route complex questions upstream to cloud LLMs.',
    nonCoderGuide: [
      'Extract the project folder.',
      'Open terminal and run `npm install && npm start`.',
      'Enter test questions to see the local embedding engine calculate cosine similarity scores and route requests.'
    ],
    cliQuickstart: 'npm install && npx vitest run',
    fileTree: ['src/core/EdgeRouter.ts', 'src/models/EmbeddingPipeline.ts', 'src/cache/VectorCache.ts', 'examples/cli.ts'],
    tags: ['transformers', 'edge-ai', 'llm-routing', 'cost-optimizer', 'embeddings', 'quantized'],
    githubUrl: 'https://github.com/nff747/edge-context-router',
    zipUrl: 'https://github.com/nff747/edge-context-router/archive/refs/heads/main.zip',
    accent: '#8b5cf6'
  }
];

const CATEGORIES = ['All Repositories', '3D & WebGPU', 'AI & LLM', 'High-Performance Systems', 'Storage & Compilers'] as const;

export default function DownloadHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Repositories');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCLITab, setCopiedCLITab] = useState<'sh' | 'py' | 'git' | null>(null);
  const [activeCLITab, setActiveCLITab] = useState<'sh' | 'py' | 'git'>('sh');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Background 3D canvas animation (Preserved as requested)
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

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ',
      alpha: Math.random() * 0.4 + 0.15
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(5, 8, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 64;
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

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 125) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.7;
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

  const handleCopyCLI = (tab: 'sh' | 'py' | 'git') => {
    cyberAudio.playHoverBlip(1050);
    let cmd = '';
    if (tab === 'sh') {
      cmd = 'curl -sSL https://nff747.github.io/download.sh | bash';
    } else if (tab === 'py') {
      cmd = 'python3 -c "$(curl -fsSL https://nff747.github.io/download.py)"';
    } else {
      cmd = 'for repo in auto-rig-web splat-bvh-core aerocache helix-lsm swarm-refactor neural-texture-engine nova-wasm webgpu-vram-pager spatial-glass-ui edge-context-router; do git clone "https://github.com/nff747/$repo.git"; done';
    }
    navigator.clipboard.writeText(cmd);
    setCopiedCLITab(tab);
    setTimeout(() => setCopiedCLITab(null), 2500);
  };

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((item) => {
      const matchesCategory = selectedCategory === 'All Repositories' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sysId.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.lang.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-[#05080d] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Particle Background (Preserved) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Cyber Subtle Gradient Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.03)_0%,_rgba(5,8,13,0.85)_80%)] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28">
        
        {/* ── TOP TELEMETRY STATUS BAR ── */}
        <header className="flex flex-wrap items-center justify-between gap-4 border border-white/[0.08] bg-[#090d16]/80 backdrop-blur-xl rounded-xl px-5 py-3.5 mb-8 shadow-2xl">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors group"
            onClick={() => cyberAudio.playHoverBlip(600)}
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:scale-105 transition-all text-cyan-400">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase font-mono text-slate-500">SYSTEMS RETURN</div>
              <div className="font-mono font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                PORTFOLIO_CORE.WebGL
              </div>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>REGISTRY: 10 / 10 ACTIVE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>MIT DUAL-USE COMMERCIAL</span>
            </div>
            <a 
              href="https://github.com/nff747" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 transition-all"
              onClick={() => cyberAudio.playHoverBlip(750)}
            >
              <ExternalLink className="w-3 h-3" />
              <span>GITHUB</span>
            </a>
          </div>
        </header>

        {/* ── HERO BANNER: ARCHITECTURAL SYSTEMS VAULT ── */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-cyan-400 font-mono text-[11px] tracking-widest uppercase mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>OPEN-SOURCE HARDWARE &amp; COMPILER ARCHITECTURES</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-mono">
            FLAGSHIP SYSTEMS REGISTRY
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-mono">
            Zero-dependency, high-throughput client/server libraries, GPU LBVH trees, and LLVM-bypassing binary emitters. Unrestricted open-source distribution under MIT.
          </p>
        </div>

        {/* ── UNIVERSAL CLI DOCK: 1-CLICK ECOSYSTEM DOWNLOADER ── */}
        <div className="mb-10 rounded-xl bg-[#090d16]/90 border border-white/[0.08] shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Dock Tab Selector */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] px-4 py-2.5 bg-black/40 gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                Automated Ecosystem Downloader
              </span>
            </div>

            <div className="flex items-center gap-1">
              {(['sh', 'py', 'git'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    cyberAudio.playHoverBlip(700);
                    setActiveCLITab(tab);
                  }}
                  className={`px-3 py-1 rounded-md font-mono text-[11px] transition-all ${
                    activeCLITab === tab
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {tab === 'sh' && 'BASH (Linux/macOS)'}
                  {tab === 'py' && 'PYTHON 3 (Cross-Platform)'}
                  {tab === 'git' && 'BATCH GIT CLONE'}
                </button>
              ))}
            </div>
          </div>

          {/* Dock Command Line Display */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full overflow-x-auto font-mono text-xs bg-black/60 rounded-lg p-3 border border-white/[0.04]">
              <span className="text-cyan-400 select-none mr-2 font-bold">$</span>
              <span className="text-slate-200">
                {activeCLITab === 'sh' && 'curl -sSL https://nff747.github.io/download.sh | bash'}
                {activeCLITab === 'py' && 'python3 -c "$(curl -fsSL https://nff747.github.io/download.py)"'}
                {activeCLITab === 'git' && 'for r in auto-rig-web splat-bvh-core aerocache helix-lsm swarm-refactor neural-texture-engine nova-wasm webgpu-vram-pager spatial-glass-ui edge-context-router; do git clone "https://github.com/nff747/$r.git"; done'}
              </span>
            </div>

            <button
              onClick={() => handleCopyCLI(activeCLITab)}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              {copiedCLITab === activeCLITab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY COMMAND</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── SEARCH & FILTER COMMAND BAR ── */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search registry by identifier (SYS_01), stack (WGSL, Rust, WebGPU), or component... (Press '/' to focus)"
              className="w-full pl-11 pr-12 py-3 bg-[#080d16]/90 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      cyberAudio.playHoverBlip(650);
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1 rounded-md text-[11px] transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-md'
                        : 'bg-black/30 border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.15]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500">
              FILTERED: <span className="text-cyan-400 font-bold">{filteredProjects.length}</span> / {PROJECTS.length} REPOSITORIES
            </div>
          </div>
        </div>

        {/* ── PROJECT BLUEPRINT CARDS GRID ── */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-dashed border-white/[0.08] bg-black/20">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-mono font-bold text-slate-300">NO MATCHING REGISTRY REPOSITORIES</h3>
            <p className="text-slate-600 text-xs mt-1 font-mono">Try adjusting your keyword filter or reset category selection.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Repositories');
              }}
              className="mt-4 px-4 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-cyan-300 text-xs font-mono hover:bg-white/[0.1] transition-all"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project, idx) => {
              const isCopied = copiedId === project.id;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-xl bg-[#090d16]/95 border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group"
                >
                  <div>
                    {/* Card Telemetry Header Bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40 font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">{project.sysId}</span>
                        <span className="text-slate-600">//</span>
                        <span className="text-slate-300 font-semibold">{project.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 text-[10px]">
                          {project.lang}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    {/* Vector Architecture Blueprint Viewer (Zero AI Raster Junk) */}
                    <div className="relative w-full aspect-[21/9] border-b border-white/[0.06] overflow-hidden bg-[#050811]">
                      <ProjectBlueprint id={project.id} accent={project.accent} />

                      {/* Corner Blueprint Badge */}
                      <div className="absolute bottom-2 left-3 pointer-events-none">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 border border-white/[0.1] text-[10px] font-mono text-cyan-300 backdrop-blur-sm">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>{project.metric}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Information Body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h2 className="text-base font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                            {project.tagline}
                          </h2>
                        </div>
                        <button
                          onClick={() => setActiveModalProject(project)}
                          className="shrink-0 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-cyan-950/60 border border-white/[0.08] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition-all flex items-center gap-1"
                          title="Inspect Architecture & Quickstart"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>SPECS</span>
                        </button>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed mb-4 font-mono">
                        {project.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-2 font-mono">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] text-[10px] text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Toolbar */}
                  <div className="px-5 py-3 border-t border-white/[0.06] bg-black/40 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    {/* Primary: Direct ZIP Download */}
                    <a
                      href={project.zipUrl}
                      download
                      onClick={() => cyberAudio.playHoverBlip(1000)}
                      className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>DOWNLOAD .ZIP</span>
                    </a>

                    {/* Secondary: Copy Git Clone */}
                    <button
                      onClick={() => handleCopyClone(project)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-all"
                      title="Copy git clone URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>CLONE</span>
                        </>
                      )}
                    </button>

                    {/* Tertiary: View GitHub Repo */}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => cyberAudio.playHoverBlip(700)}
                      className="flex items-center justify-center p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-slate-200 transition-all"
                      title="Open GitHub Repository"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── NON-CODER / QUICKSTART CONSOLE SECTION ── */}
        <div className="mt-16 rounded-xl bg-[#090d16]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>DIRECT LOCAL DEPLOYMENT WORKFLOW</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-white mb-6">
            HOW TO RUN THESE REPOSITORIES IN 3 STEPS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="p-5 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs mb-3">
                01
              </div>
              <h3 className="font-bold text-slate-200 text-sm mb-1">DOWNLOAD ARCHIVE</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Click any cyan <span className="text-cyan-300">Download .ZIP</span> button above. Your browser fetches the complete self-contained source bundle immediately without credentials or registration.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="w-7 h-7 rounded bg-purple-950/80 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                02
              </div>
              <h3 className="font-bold text-slate-200 text-sm mb-1">UNPACK ARCHIVE</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Right-click the downloaded `.zip` file on your OS and choose <span className="text-purple-300">Extract All</span> (Windows) or double-click to decompress on macOS / Linux.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="w-7 h-7 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                03
              </div>
              <h3 className="font-bold text-slate-200 text-sm mb-1">LAUNCH DEMO</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Web projects feature a standalone <span className="text-emerald-300">demo/index.html</span> you can double-click to run in any browser. Backend projects include full test suites runnable with a single command.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── SYSTEM SPECIFICATION MODAL DRAWER ── */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden font-mono"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    {activeModalProject.sysId}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{activeModalProject.name}</h3>
                    <div className="text-[11px] text-slate-500">{activeModalProject.badge} // {activeModalProject.lang}</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
                {/* Blueprint View */}
                <div className="rounded-lg overflow-hidden border border-white/[0.08] aspect-[21/9] bg-[#050811]">
                  <ProjectBlueprint id={activeModalProject.id} accent={activeModalProject.accent} />
                </div>

                {/* Technical Overview */}
                <div>
                  <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] mb-2">
                    ARCHITECTURE OVERVIEW
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {activeModalProject.description}
                  </p>
                </div>

                {/* Directory Structure */}
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
                    KEY DIRECTORY ENTRYPOINTS
                  </h4>
                  <div className="bg-black/60 rounded-lg p-3 border border-white/[0.06] space-y-1 text-slate-300">
                    {activeModalProject.fileTree.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-slate-600">├──</span>
                        <span className="text-cyan-300 font-mono">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-Coder Step-by-Step */}
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    QUICKSTART GUIDE (BEGINNER FRIENDLY)
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                    {activeModalProject.nonCoderGuide.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Terminal Quickstart */}
                <div>
                  <h4 className="font-bold text-purple-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    DEVELOPER CLI VERIFICATION
                  </h4>
                  <div className="bg-black/60 rounded-lg p-3 border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="text-slate-200 truncate">
                      <span className="text-purple-400 select-none mr-2 font-bold">$</span>
                      {activeModalProject.cliQuickstart}
                    </div>
                    <button
                      onClick={() => {
                        cyberAudio.playHoverBlip(900);
                        navigator.clipboard.writeText(activeModalProject.cliQuickstart);
                      }}
                      className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-[10px] shrink-0"
                    >
                      COPY
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-black/50">
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>VIEW ON GITHUB</span>
                </a>

                <a
                  href={activeModalProject.zipUrl}
                  download
                  onClick={() => cyberAudio.playHoverBlip(1000)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
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
