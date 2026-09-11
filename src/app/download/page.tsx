"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, FolderArchive, CheckCircle2, Terminal, ExternalLink, X } from 'lucide-react';
import { TiltCard } from '../../components/TiltCard';

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

// ── AUDIO HOOK ──
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
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  return { playHoverBlip };
};

export default function DownloadHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Repositories');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cyberAudio = useCyberAudio();

  // ── BACKGROUND CANVAS (Spatial Particle Field) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.4)'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ── FILTER PROJECTS ──
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All Repositories' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-[#020408] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-60 mix-blend-screen"
      />

      {/* Radial Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 min-h-screen flex flex-col">
        
        {/* Header & Search Engine */}
        <div className="flex flex-col items-center mb-16 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Download Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-600 tracking-tight drop-shadow-sm">
              PUBLIC ARCHIVES
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              High-performance engines, WebGL experiences, and ML architectures. 
              Open source for commercial and personal use.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-[#070b14]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-cyan-500/50 transition-colors">
              <div className="pl-4 pr-2">
                <Search className="w-6 h-6 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, tech stack, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => cyberAudio.playHoverBlip(1200)}
                className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-slate-600 font-mono py-3"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  cyberAudio.playHoverBlip(1000);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Spatial 3D Grid */}
        {filteredProjects.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center font-mono text-slate-500">
              <div className="text-4xl mb-4">ಠ_ಠ</div>
              <p>NO ARCHIVES MATCH QUERY "{searchQuery}"</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[2000px]">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, z: -100, rotateX: 10 }}
                animate={{ opacity: 1, z: 0, rotateX: 0 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100 }}
              >
                <TiltCard 
                  project={project} 
                  onClick={() => {
                    cyberAudio.playHoverBlip(600);
                    setActiveModalProject(project);
                  }} 
                />
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* ── HOLOGRAPHIC MODAL ── */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotateX: 5, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, rotateX: -5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#03060c]/90 border border-cyan-500/30 rounded-2xl shadow-[0_0_100px_rgba(6,182,212,0.15)] overflow-hidden font-mono"
            >
              {/* Modal Banner Backdrop */}
              <div 
                className="absolute top-0 left-0 right-0 h-64 bg-cover bg-center opacity-30 mask-image-gradient"
                style={{
                  backgroundImage: `url(/banners/${activeModalProject.id}.jpg)`,
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
                }}
              />

              {/* Modal Header */}
              <div className="relative flex items-center justify-between px-8 py-6 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    {activeModalProject.sysId}
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white tracking-tight">{activeModalProject.name}</h3>
                    <div className="text-cyan-300/80 text-sm">{activeModalProject.tagline}</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="relative p-8 max-h-[70vh] overflow-y-auto space-y-10 z-10 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Non-Coder Guide */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        Quickstart (Beginners)
                      </h4>
                      <ol className="relative border-l border-white/10 ml-3 space-y-6">
                        {activeModalProject.nonCoderGuide.map((step, idx) => (
                          <li key={idx} className="pl-6">
                            <span className="absolute w-6 h-6 bg-[#03060c] border border-emerald-500/30 rounded-full -left-3 flex items-center justify-center text-[10px] text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              {idx + 1}
                            </span>
                            <p className="text-slate-300 text-sm leading-relaxed pt-0.5">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <a
                      href={activeModalProject.zipUrl}
                      download
                      onClick={() => cyberAudio.playHoverBlip(1000)}
                      className="group flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-sm transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] active:scale-[0.98]"
                    >
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>DOWNLOAD .ZIP ARCHIVE</span>
                    </a>
                  </div>

                  {/* Right Column: Dev/Tech Specs */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-purple-400" />
                        Developer Tools
                      </h4>
                      <div className="bg-[#000000] rounded-xl p-4 border border-white/10 shadow-inner">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">CLI Verification</span>
                          <button
                            onClick={() => {
                              cyberAudio.playHoverBlip(900);
                              navigator.clipboard.writeText(activeModalProject.cliQuickstart);
                            }}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] transition-colors"
                          >
                            COPY
                          </button>
                        </div>
                        <div className="text-purple-300 font-mono text-sm overflow-x-auto whitespace-nowrap">
                          <span className="text-purple-500 select-none mr-2">$</span>
                          {activeModalProject.cliQuickstart}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                        <FolderArchive className="w-5 h-5 text-amber-400" />
                        Architecture
                      </h4>
                      <div className="bg-[#000000]/60 rounded-xl p-4 border border-white/10 space-y-2">
                        {activeModalProject.fileTree.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm">
                            <span className="text-slate-600">├──</span>
                            <span className="text-amber-300 font-mono">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <a
                      href={activeModalProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      VIEW ON GITHUB
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
