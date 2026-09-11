'use client';

import React from 'react';

interface BlueprintProps {
  id: string;
  accent?: string;
}

export const ProjectBlueprint: React.FC<BlueprintProps> = ({ id, accent = '#00f0ff' }) => {
  switch (id) {
    case 'auto-rig-web':
      return <VitruvianKinematicBlueprint accent={accent} />;
    case 'splat-bvh-core':
      return <MortonLBVHBlueprint accent={accent} />;
    case 'aerocache':
      return <OffHeapMemoryBlueprint accent={accent} />;
    case 'helix-lsm':
      return <LSMTreeStorageBlueprint accent={accent} />;
    case 'swarm-refactor':
      return <ActorSwarmBlueprint accent={accent} />;
    case 'neural-texture-engine':
      return <NeuralUpscalerBlueprint accent={accent} />;
    case 'nova-wasm':
      return <CompilerPipelineBlueprint accent={accent} />;
    case 'webgpu-vram-pager':
      return <VRAMPagerBlueprint accent={accent} />;
    case 'spatial-glass-ui':
      return <SpatialOpticsBlueprint accent={accent} />;
    case 'edge-context-router':
      return <EdgeRouterBlueprint accent={accent} />;
    default:
      return <DefaultSchematicBlueprint accent={accent} />;
  }
};

/* ─────────────────────────────────────────────────────────────
   1. AUTO-RIG-WEB: 19-Joint Vitruvian Skeleton & Web Worker
   ───────────────────────────────────────────────────────────── */
const VitruvianKinematicBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-ar" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
      <linearGradient id="bone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <rect width="480" height="180" fill="url(#grid-ar)" />

    {/* HUD Coordinate Framing */}
    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" fill="none" />

    {/* Left Panel: Web Worker Thread Boundary */}
    <rect x="22" y="30" width="115" height="120" rx="6" fill="#090e1a" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1" />
    <text x="30" y="46" fill="#00f0ff" fontSize="8" fontFamily="monospace" fontWeight="bold">WEB WORKER THREAD</text>
    <line x1="22" y1="52" x2="137" y2="52" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="0.8" />
    
    <rect x="30" y="60" width="99" height="20" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.1)" />
    <text x="36" y="73" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">ONNX Pose Estimator</text>
    
    <rect x="30" y="86" width="99" height="20" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.1)" />
    <text x="36" y="99" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">Biharmonic Skinning</text>
    
    <rect x="30" y="112" width="99" height="26" rx="3" fill="#042f2e" stroke="rgba(45, 212, 191, 0.4)" />
    <text x="36" y="123" fill="#2dd4bf" fontSize="7" fontFamily="monospace" fontWeight="bold">SharedArrayBuffer</text>
    <text x="36" y="133" fill="#5eead4" fontSize="6.5" fontFamily="monospace">ZERO-COPY TRANSFER</text>

    {/* Transfer Vector Arrow to Main Thread */}
    <path d="M 137 125 L 185 125" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
    <polygon points="187,125 182,122 182,128" fill="#2dd4bf" />

    {/* Center: Vitruvian Skeletal Hierarchy */}
    <circle cx="240" cy="90" r="70" stroke="rgba(0,240,255,0.08)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
    <circle cx="240" cy="90" r="50" stroke="rgba(0,240,255,0.05)" strokeWidth="1" fill="none" />

    {/* Skeletal Bones */}
    <line x1="240" y1="28" x2="240" y2="44" stroke="url(#bone-grad)" strokeWidth="2.5" />
    <line x1="240" y1="44" x2="240" y2="76" stroke="url(#bone-grad)" strokeWidth="2.5" />
    <line x1="240" y1="76" x2="240" y2="102" stroke="url(#bone-grad)" strokeWidth="3" />
    <line x1="208" y1="52" x2="272" y2="52" stroke="url(#bone-grad)" strokeWidth="2" />
    <line x1="208" y1="52" x2="190" y2="82" stroke="url(#bone-grad)" strokeWidth="2" />
    <line x1="190" y1="82" x2="175" y2="114" stroke="url(#bone-grad)" strokeWidth="1.8" />
    <line x1="272" y1="52" x2="290" y2="82" stroke="url(#bone-grad)" strokeWidth="2" />
    <line x1="290" y1="82" x2="305" y2="114" stroke="url(#bone-grad)" strokeWidth="1.8" />
    <line x1="240" y1="102" x2="222" y2="136" stroke="url(#bone-grad)" strokeWidth="2.5" />
    <line x1="222" y1="136" x2="216" y2="168" stroke="url(#bone-grad)" strokeWidth="2" />
    <line x1="240" y1="102" x2="258" y2="136" stroke="url(#bone-grad)" strokeWidth="2.5" />
    <line x1="258" y1="136" x2="264" y2="168" stroke="url(#bone-grad)" strokeWidth="2" />

    {/* Joint Knots */}
    {[
      { x: 240, y: 28, r: 6, label: 'HEAD' },
      { x: 240, y: 44, r: 3.5 },
      { x: 208, y: 52, r: 4 },
      { x: 272, y: 52, r: 4 },
      { x: 190, y: 82, r: 3.5 },
      { x: 290, y: 82, r: 3.5 },
      { x: 175, y: 114, r: 3.5, end: true },
      { x: 305, y: 114, r: 3.5, end: true },
      { x: 240, y: 76, r: 4 },
      { x: 240, y: 102, r: 5, root: true },
      { x: 222, y: 136, r: 3.8 },
      { x: 258, y: 136, r: 3.8 },
      { x: 216, y: 168, r: 3.5, end: true },
      { x: 264, y: 168, r: 3.5, end: true },
    ].map((j, i) => (
      <g key={i}>
        <circle cx={j.x} cy={j.y} r={j.r} fill={j.root ? '#f59e0b' : j.end ? '#10b981' : '#00f0ff'} />
        <circle cx={j.x} cy={j.y} r={j.r + 2} stroke={j.root ? '#f59e0b' : '#00f0ff'} strokeWidth="0.8" fill="none" opacity="0.6" />
      </g>
    ))}

    {/* Right Panel: Telemetry */}
    <rect x="345" y="30" width="115" height="120" rx="6" fill="#090e1a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <text x="353" y="46" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold">CCDIK SOLVER</text>
    <line x1="345" y1="52" x2="460" y2="52" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
    
    <text x="353" y="66" fill="#64748b" fontSize="7" fontFamily="monospace">JOINTS:</text>
    <text x="420" y="66" fill="#00f0ff" fontSize="7" fontFamily="monospace" fontWeight="bold">19 TRACKED</text>
    
    <text x="353" y="80" fill="#64748b" fontSize="7" fontFamily="monospace">SOLVE LATENCY:</text>
    <text x="420" y="80" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">0.42 ms</text>
    
    <text x="353" y="94" fill="#64748b" fontSize="7" fontFamily="monospace">TARGET POSE:</text>
    <text x="420" y="94" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">CONVERGED</text>

    <rect x="353" y="108" width="99" height="30" rx="3" fill="#0f172a" stroke="rgba(0, 240, 255, 0.2)" />
    <text x="359" y="120" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">FPS: 60 (Render Loop)</text>
    <text x="359" y="131" fill="#38bdf8" fontSize="6.5" fontFamily="monospace">UI Thread: 0% Block</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   2. SPLAT-BVH-CORE: Morton Z-Curve & GPU LBVH Binary Tree
   ───────────────────────────────────────────────────────────── */
const MortonLBVHBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-bvh" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-bvh)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" fill="none" />

    {/* Left: 3D Gaussian Splat AABB */}
    <g transform="translate(40, 35)">
      <text x="0" y="-10" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">3D GAUSSIAN CLUSTERS</text>
      <polygon points="10,40 50,15 110,25 70,50" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" strokeDasharray="3 2" />
      <polygon points="10,95 50,70 110,80 70,105" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
      <line x1="10" y1="40" x2="10" y2="95" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
      <line x1="50" y1="15" x2="50" y2="70" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="110" y1="25" x2="110" y2="80" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
      <line x1="70" y1="50" x2="70" y2="105" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />

      {[
        { x: 35, y: 65, c: '#00f0ff' }, { x: 45, y: 50, c: '#a855f7' }, { x: 65, y: 60, c: '#38bdf8' },
        { x: 75, y: 75, c: '#f59e0b' }, { x: 55, y: 80, c: '#10b981' }, { x: 85, y: 55, c: '#00f0ff' }
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={p.c} opacity="0.85" />
      ))}
      <path d="M 35 65 L 45 50 L 65 60 L 85 55 L 75 75 L 55 80" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2" />
      <text x="10" y="125" fill="#64748b" fontSize="6.5" fontFamily="monospace">30-BIT MORTON ENCODE</text>
    </g>

    {/* Center: LBVH Binary Tree */}
    <g transform="translate(185, 25)">
      <text x="45" y="0" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold">KARRAS 2012 LBVH TREE</text>
      
      <rect x="40" y="15" width="60" height="20" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
      <text x="48" y="28" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">Root [0..N]</text>

      <line x1="55" y1="35" x2="25" y2="55" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />
      <line x1="85" y1="35" x2="115" y2="55" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1" />

      <rect x="5" y="55" width="46" height="18" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <text x="11" y="67" fill="#94a3b8" fontSize="7" fontFamily="monospace">Node L</text>

      <rect x="95" y="55" width="46" height="18" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <text x="101" y="67" fill="#94a3b8" fontSize="7" fontFamily="monospace">Node R</text>

      <line x1="18" y1="73" x2="5" y2="92" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.8" />
      <line x1="38" y1="73" x2="50" y2="92" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.8" />
      <line x1="108" y1="73" x2="95" y2="92" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.8" />
      <line x1="128" y1="73" x2="140" y2="92" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.8" />

      {[-5, 40, 85, 130].map((lx, i) => (
        <g key={i}>
          <rect x={lx} y="92" width="36" height="16" rx="2" fill="#042f2e" stroke="#10b981" strokeWidth="0.8" />
          <text x={lx + 5} y="103" fill="#34d399" fontSize="6.5" fontFamily="monospace">Leaf {i}</text>
        </g>
      ))}

      <path d="M -15 135 L 160 85" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="95" cy="100" r="4" fill="#f43f5e" opacity="0.8" />
      <text x="15" y="138" fill="#f43f5e" fontSize="6.5" fontFamily="monospace" fontWeight="bold">Ray Intersect: Leaf 2 [HIT]</text>
    </g>

    {/* Right: GPU Residence Specs */}
    <g transform="translate(365, 30)">
      <rect width="95" height="120" rx="6" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      <text x="10" y="18" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">VRAM PIPELINE</text>
      <line x1="0" y1="24" x2="95" y2="24" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

      <text x="8" y="40" fill="#64748b" fontSize="6.5" fontFamily="monospace">CPU READBACK:</text>
      <text x="8" y="52" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">0.0 MB (ZERO)</text>

      <text x="8" y="68" fill="#64748b" fontSize="6.5" fontFamily="monospace">RADIX SORT:</text>
      <text x="8" y="80" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">ONE-SWEEP WGSL</text>

      <text x="8" y="96" fill="#64748b" fontSize="6.5" fontFamily="monospace">REBUILD TIME:</text>
      <text x="8" y="108" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">&lt; 0.82 ms</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   3. AEROCACHE: Off-Heap Slabs, Segregated Free-Lists & RESP2
   ───────────────────────────────────────────────────────────── */
const OffHeapMemoryBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-aero" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-aero)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" fill="none" />

    {/* Left: Client RESP2 NIO Event Loop */}
    <g transform="translate(25, 30)">
      <rect width="105" height="120" rx="6" fill="#090e1a" stroke="rgba(245, 158, 11, 0.3)" />
      <text x="10" y="18" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">NIO EVENT LOOP</text>
      <line x1="0" y1="24" x2="105" y2="24" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="0.8" />

      <rect x="8" y="32" width="89" height="20" rx="3" fill="#1e1b4b" stroke="rgba(129, 140, 248, 0.3)" />
      <text x="14" y="45" fill="#a5b4fc" fontSize="7" fontFamily="monospace">RESP2 Protocol</text>

      <rect x="8" y="58" width="89" height="20" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.1)" />
      <text x="14" y="71" fill="#94a3b8" fontSize="7" fontFamily="monospace">Single-Thread Epoll</text>

      <rect x="8" y="84" width="89" height="28" rx="3" fill="#311015" stroke="rgba(244, 63, 94, 0.4)" />
      <text x="14" y="96" fill="#f43f5e" fontSize="6.5" fontFamily="monospace" fontWeight="bold">GC PAUSE DURATION</text>
      <text x="14" y="106" fill="#fda4af" fontSize="7.5" fontFamily="monospace" fontWeight="bold">0.00 µs (ZERO GC)</text>
    </g>

    {/* Center: Off-Heap Arena & Segregated Free Lists */}
    <g transform="translate(145, 30)">
      <text x="10" y="10" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold">OFF-HEAP RAW ARENA [sun.misc.Unsafe]</text>
      
      <g transform="translate(10, 20)">
        <rect x="0" y="0" width="90" height="24" rx="3" fill="#042f2e" stroke="#10b981" strokeWidth="0.8" />
        <text x="8" y="15" fill="#34d399" fontSize="7" fontFamily="monospace">Bucket 64B [Slab 0]</text>
        <text x="65" y="15" fill="#6ee7b7" fontSize="6.5" fontFamily="monospace">ACTIVE</text>

        <rect x="98" y="0" width="90" height="24" rx="3" fill="#042f2e" stroke="#10b981" strokeWidth="0.8" />
        <text x="106" y="15" fill="#34d399" fontSize="7" fontFamily="monospace">Bucket 128B [Slab 1]</text>
        <text x="165" y="15" fill="#6ee7b7" fontSize="6.5" fontFamily="monospace">ACTIVE</text>

        <rect x="0" y="30" width="90" height="24" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
        <text x="8" y="45" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Bucket 256B [Slab 2]</text>
        <text x="65" y="45" fill="#c7d2fe" fontSize="6.5" fontFamily="monospace">ALLOC</text>

        <rect x="98" y="30" width="90" height="24" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
        <text x="106" y="45" fill="#a5b4fc" fontSize="7" fontFamily="monospace">Bucket 512B [Slab 3]</text>
        <text x="165" y="45" fill="#c7d2fe" fontSize="6.5" fontFamily="monospace">FREE</text>

        <rect x="0" y="62" width="188" height="28" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.15)" />
        <text x="8" y="74" fill="#64748b" fontSize="6.5" fontFamily="monospace">OFF-HEAP POINTER ALIGNMENT:</text>
        <text x="8" y="85" fill="#f59e0b" fontSize="7" fontFamily="monospace">0x7FFF_E0000000 ➔ 0x7FFF_E0000040 (64B)</text>
      </g>
    </g>

    {/* Right: Latency & Throughput Gauge */}
    <g transform="translate(365, 30)">
      <rect width="95" height="120" rx="6" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      <text x="10" y="18" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">BENCHMARK</text>
      <line x1="0" y1="24" x2="95" y2="24" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

      <text x="8" y="42" fill="#64748b" fontSize="6.5" fontFamily="monospace">GET / SET IOPS:</text>
      <text x="8" y="54" fill="#f59e0b" fontSize="7.5" fontFamily="monospace" fontWeight="bold">13,420,000 /s</text>

      <text x="8" y="72" fill="#64748b" fontSize="6.5" fontFamily="monospace">P99 LATENCY:</text>
      <text x="8" y="84" fill="#10b981" fontSize="7.5" fontFamily="monospace" fontWeight="bold">0.10 µs</text>

      <text x="8" y="102" fill="#64748b" fontSize="6.5" fontFamily="monospace">LOCK CONFLICT:</text>
      <text x="8" y="114" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">ZERO (STRIPED)</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   4. HELIX-LSM: Lock-Free SkipList MemTable & Tiered Compaction
   ───────────────────────────────────────────────────────────── */
const LSMTreeStorageBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-lsm" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-lsm)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" fill="none" />

    {/* Top-Left: Lock-Free SkipList MemTable */}
    <g transform="translate(25, 25)">
      <rect width="185" height="55" rx="5" fill="#090e1a" stroke="rgba(239, 68, 68, 0.4)" />
      <text x="10" y="14" fill="#ef4444" fontSize="7.5" fontFamily="monospace" fontWeight="bold">LOCK-FREE SKIPLIST MEMTABLE (RAM)</text>
      <text x="145" y="14" fill="#64748b" fontSize="6.5" fontFamily="monospace">EBR GC</text>

      <g transform="translate(10, 22)">
        <text x="0" y="10" fill="#64748b" fontSize="6.5" fontFamily="monospace">L2</text>
        <circle cx="25" cy="8" r="3" fill="#ef4444" />
        <line x1="28" y1="8" x2="90" y2="8" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="95" cy="8" r="3" fill="#ef4444" />
        <line x1="98" y1="8" x2="155" y2="8" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="160" cy="8" r="3" fill="#ef4444" />

        <text x="0" y="22" fill="#64748b" fontSize="6.5" fontFamily="monospace">L0</text>
        {[25, 45, 65, 80, 95, 115, 135, 160].map((cx, i) => (
          <circle key={i} cx={cx} cy={20} r="2.5" fill="#fca5a5" />
        ))}
        <line x1="25" y1="20" x2="160" y2="20" stroke="#fca5a5" strokeWidth="0.8" />
      </g>
    </g>

    {/* Top-Right: WAL Stream */}
    <g transform="translate(225, 25)">
      <rect width="125" height="55" rx="5" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="10" y="14" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">WAL BUFFER (SSD)</text>
      <rect x="10" y="22" width="105" height="24" rx="3" fill="#1e293b" />
      <text x="16" y="34" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Group-Commit Log</text>
      <text x="16" y="42" fill="#10b981" fontSize="6" fontFamily="monospace">CRC32 VERIFIED // O_DIRECT</text>
    </g>

    {/* Compaction Cascade Flow Arrow */}
    <path d="M 115 80 L 115 98" stroke="#ef4444" strokeWidth="1.5" />
    <polygon points="115,103 111,97 119,97" fill="#ef4444" />
    <text x="125" y="93" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="bold">FLUSH &amp; COMPACT</text>

    {/* Bottom: SSTable Levels */}
    <g transform="translate(25, 106)">
      <rect width="325" height="48" rx="5" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      
      <g transform="translate(10, 8)">
        <text x="0" y="11" fill="#94a3b8" fontSize="7" fontFamily="monospace">L0 (Overlapping):</text>
        <rect x="75" y="2" width="40" height="12" rx="2" fill="#450a0a" stroke="#ef4444" strokeWidth="0.8" />
        <text x="80" y="10" fill="#fca5a5" fontSize="6" fontFamily="monospace">SST 001</text>
        
        <rect x="120" y="2" width="40" height="12" rx="2" fill="#450a0a" stroke="#ef4444" strokeWidth="0.8" />
        <text x="125" y="10" fill="#fca5a5" fontSize="6" fontFamily="monospace">SST 002</text>
      </g>

      <g transform="translate(10, 26)">
        <text x="0" y="11" fill="#94a3b8" fontSize="7" fontFamily="monospace">L1 (Partitioned):</text>
        {['[A..G]', '[H..P]', '[Q..Z]'].map((range, i) => (
          <g key={i} transform={`translate(${75 + i * 45}, 2)`}>
            <rect width="40" height="12" rx="2" fill="#042f2e" stroke="#10b981" strokeWidth="0.8" />
            <text x="4" y="9" fill="#34d399" fontSize="6" fontFamily="monospace">{range}</text>
          </g>
        ))}
      </g>
    </g>

    {/* Far Right Stats */}
    <g transform="translate(365, 25)">
      <rect width="95" height="129" rx="6" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      <text x="10" y="18" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">STORAGE STATS</text>
      <line x1="0" y1="24" x2="95" y2="24" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

      <text x="8" y="42" fill="#64748b" fontSize="6.5" fontFamily="monospace">WRITE IOPS:</text>
      <text x="8" y="54" fill="#ef4444" fontSize="7.5" fontFamily="monospace" fontWeight="bold">1.42M / sec</text>

      <text x="8" y="72" fill="#64748b" fontSize="6.5" fontFamily="monospace">MEMTABLE GC:</text>
      <text x="8" y="84" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">EPOCH-BASED</text>

      <text x="8" y="102" fill="#64748b" fontSize="6.5" fontFamily="monospace">CLUSTER MODE:</text>
      <text x="8" y="114" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">CONSISTENT HASH</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   5. SWARM-REFACTOR: Actor-Model Concurrency & Security Sandbox
   ───────────────────────────────────────────────────────────── */
const ActorSwarmBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-swarm" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-swarm)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" fill="none" />

    {/* Manager Actor */}
    <g transform="translate(145, 20)">
      <rect width="130" height="30" rx="4" fill="#2e1065" stroke="#a855f7" strokeWidth="1.2" />
      <text x="18" y="18" fill="#e9d5ff" fontSize="8" fontFamily="monospace" fontWeight="bold">MANAGER ACTOR (ROOT)</text>
      <text x="18" y="26" fill="#c084fc" fontSize="6" fontFamily="monospace">AST Issue Decomposer</text>
    </g>

    <path d="M 210 50 L 80 80 M 210 50 L 210 80 M 210 50 L 340 80" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" strokeDasharray="2 2" />

    {/* Workers */}
    <g transform="translate(25, 80)">
      <rect width="110" height="36" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="8" y="14" fill="#a855f7" fontSize="7" fontFamily="monospace" fontWeight="bold">WORKER: ANALYZER</text>
      <text x="8" y="24" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">Locates Syntax Errors</text>
      <circle cx="98" cy="18" r="3" fill="#a855f7" />
    </g>

    <g transform="translate(155, 80)">
      <rect width="110" height="36" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="8" y="14" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">WORKER: SYNTHESIZER</text>
      <text x="8" y="24" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">Generates Unified Diff</text>
      <circle cx="98" cy="18" r="3" fill="#38bdf8" />
    </g>

    <g transform="translate(285, 80)">
      <rect width="110" height="36" rx="4" fill="#042f2e" stroke="#10b981" strokeWidth="0.8" />
      <text x="8" y="14" fill="#34d399" fontSize="7" fontFamily="monospace" fontWeight="bold">WORKER: TEST RUNNER</text>
      <text x="8" y="24" fill="#6ee7b7" fontSize="6.5" fontFamily="monospace">Pytest in POSIX Sandbox</text>
      <circle cx="98" cy="18" r="3" fill="#10b981" />
    </g>

    <path d="M 80 116 L 160 136 M 210 116 L 210 136 M 340 116 L 260 136" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />

    {/* Critic Actor */}
    <g transform="translate(145, 134)">
      <rect width="130" height="28" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
      <text x="18" y="14" fill="#34d399" fontSize="7.5" fontFamily="monospace" fontWeight="bold">CRITIC ACTOR [VERIFY]</text>
      <text x="18" y="23" fill="#94a3b8" fontSize="6" fontFamily="monospace">Evaluates: All Tests Pass ➔ Merge</text>
    </g>

    <path d="M 145 148 C 10 148 10 35 145 35" fill="none" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1" strokeDasharray="3 3" />
    <text x="22" y="44" fill="#ef4444" fontSize="6" fontFamily="monospace">If Fail: Retry Cycle (Max 5)</text>

    {/* Far Right Stats */}
    <g transform="translate(405, 30)">
      <rect width="65" height="120" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      <text x="6" y="16" fill="#e2e8f0" fontSize="6.5" fontFamily="monospace" fontWeight="bold">EVAL GATE</text>
      <line x1="0" y1="22" x2="65" y2="22" stroke="rgba(255,255,255,0.08)" />

      <text x="6" y="38" fill="#64748b" fontSize="6" fontFamily="monospace">BACKENDS:</text>
      <text x="6" y="48" fill="#a855f7" fontSize="6.5" fontFamily="monospace" fontWeight="bold">Ollama/vLLM</text>

      <text x="6" y="66" fill="#64748b" fontSize="6.5" fontFamily="monospace">AST FILTER:</text>
      <text x="6" y="76" fill="#10b981" fontSize="6.5" fontFamily="monospace" fontWeight="bold">ENFORCED</text>

      <text x="6" y="94" fill="#64748b" fontSize="6.5" fontFamily="monospace">TIMEOUT:</text>
      <text x="6" y="104" fill="#f59e0b" fontSize="6.5" fontFamily="monospace" fontWeight="bold">15s Hard Kill</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   6. NEURAL-TEXTURE-ENGINE: 4x Super-Resolution & WebGL2 Fallback
   ───────────────────────────────────────────────────────────── */
const NeuralUpscalerBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-nte" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-nte)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(236, 72, 153, 0.4)" strokeWidth="1" fill="none" />

    <g transform="translate(30, 35)">
      <text x="0" y="-10" fill="#ec4899" fontSize="7.5" fontFamily="monospace" fontWeight="bold">INPUT TEXEL (64x64)</text>
      <rect width="60" height="60" rx="3" fill="#1e1b4b" stroke="rgba(236, 72, 153, 0.4)" />
      {[0, 15, 30, 45].map((x) =>
        [0, 15, 30, 45].map((y) => (
          <rect key={`${x}-${y}`} x={x + 2} y={y + 2} width="11" height="11" fill="rgba(236, 72, 153, 0.2)" stroke="rgba(255,255,255,0.05)" />
        ))
      )}
      <text x="5" y="75" fill="#64748b" fontSize="6.5" fontFamily="monospace">Low-Res Source</text>
    </g>

    <g transform="translate(125, 40)">
      <line x1="0" y1="25" x2="25" y2="25" stroke="#ec4899" strokeWidth="1.2" />
      <polygon points="25,25 20,22 20,28" fill="#ec4899" />

      <rect x="30" y="5" width="85" height="40" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="36" y="20" fill="#e2e8f0" fontSize="6.8" fontFamily="monospace" fontWeight="bold">LAPLACIAN 3x3</text>
      <text x="36" y="32" fill="#94a3b8" fontSize="6" fontFamily="monospace">High-Pass Kernels</text>

      <line x1="115" y1="25" x2="135" y2="25" stroke="#ec4899" strokeWidth="1.2" />
      <polygon points="135,25 130,22 130,28" fill="#ec4899" />

      <rect x="140" y="5" width="85" height="40" rx="4" fill="#042f2e" stroke="#10b981" />
      <text x="146" y="20" fill="#34d399" fontSize="6.8" fontFamily="monospace" fontWeight="bold">QUANTIZED CONV</text>
      <text x="146" y="32" fill="#6ee7b7" fontSize="6" fontFamily="monospace">4-Layer FP16 Tensor</text>
    </g>

    <g transform="translate(370, 30)">
      <text x="-25" y="-6" fill="#10b981" fontSize="7.5" fontFamily="monospace" fontWeight="bold">OUTPUT 4x (256x256)</text>
      <rect width="70" height="70" rx="3" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
      {[0, 9, 18, 27, 36, 45, 54].map((x) =>
        [0, 9, 18, 27, 36, 45, 54].map((y) => (
          <rect key={`${x}-${y}`} x={x + 2} y={y + 2} width="6" height="6" fill="rgba(16, 185, 129, 0.4)" />
        ))
      )}
      <text x="-15" y="86" fill="#34d399" fontSize="6.5" fontFamily="monospace">Sub-Pixel Details Restored</text>
    </g>

    <g transform="translate(30, 125)">
      <rect width="410" height="32" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      <text x="15" y="16" fill="#e2e8f0" fontSize="7" fontFamily="monospace" fontWeight="bold">COMPUTE PROFILER:</text>
      <text x="135" y="16" fill="#00f0ff" fontSize="7" fontFamily="monospace">Frame Time &lt; 16ms ➔ WebGPU Compute Shaders</text>
      <text x="15" y="25" fill="#f59e0b" fontSize="6" fontFamily="monospace">Frame Time ≥ 16ms (Low-End Mobile) ➔ Graceful Fallback to WebGL2 Fragment Shader Pass</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   7. NOVA-WASM: Direct-to-WASM Compiler & Bytecode Emitter
   ───────────────────────────────────────────────────────────── */
const CompilerPipelineBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-nova" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-nova)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" fill="none" />

    <g transform="translate(25, 30)">
      <rect width="90" height="75" rx="5" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="8" y="16" fill="#10b981" fontSize="7.5" fontFamily="monospace" fontWeight="bold">1. LEXER STREAM</text>
      <line x1="0" y1="22" x2="90" y2="22" stroke="rgba(255,255,255,0.08)" />
      <text x="8" y="36" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">fn collatz(n) &#123;</text>
      <text x="8" y="48" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">  let mut s = 0;</text>
      <text x="8" y="60" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">  while n &gt; 1 ...</text>
      <text x="8" y="70" fill="#10b981" fontSize="6" fontFamily="monospace">[ZERO-ALLOC TOKENS]</text>
    </g>

    <path d="M 115 67 L 140 67" stroke="#10b981" strokeWidth="1.2" />
    <polygon points="140,67 135,64 135,70" fill="#10b981" />

    <g transform="translate(145, 30)">
      <rect width="105" height="75" rx="5" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="8" y="16" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">2. PRATT AST</text>
      <line x1="0" y1="22" x2="105" y2="22" stroke="rgba(255,255,255,0.08)" />
      
      <circle cx="52" cy="35" r="4" fill="#38bdf8" />
      <line x1="52" y1="39" x2="35" y2="52" stroke="#38bdf8" strokeWidth="0.8" />
      <line x1="52" y1="39" x2="70" y2="52" stroke="#38bdf8" strokeWidth="0.8" />
      <circle cx="35" cy="52" r="3" fill="#60a5fa" />
      <circle cx="70" cy="52" r="3" fill="#60a5fa" />
      <text x="12" y="68" fill="#94a3b8" fontSize="6.2" fontFamily="monospace">Precedence Climbing</text>
    </g>

    <path d="M 250 67 L 275 67" stroke="#10b981" strokeWidth="1.2" />
    <polygon points="275,67 270,64 270,70" fill="#10b981" />

    <g transform="translate(280, 30)">
      <rect width="170" height="75" rx="5" fill="#042f2e" stroke="#10b981" strokeWidth="1.2" />
      <text x="10" y="16" fill="#34d399" fontSize="7.5" fontFamily="monospace" fontWeight="bold">3. DIRECT WASM BINARY</text>
      <line x1="0" y1="22" x2="170" y2="22" stroke="rgba(16, 185, 129, 0.3)" />
      
      <text x="10" y="36" fill="#6ee7b7" fontSize="7" fontFamily="monospace">00 61 73 6D 01 00 00 00 (\0asm)</text>
      <text x="10" y="48" fill="#a7f3d0" fontSize="6.5" fontFamily="monospace">Sec 1 (Type) | Sec 3 (Function)</text>
      <text x="10" y="60" fill="#a7f3d0" fontSize="6.5" fontFamily="monospace">Sec 7 (Export) | Sec 10 (Code)</text>
      <text x="10" y="70" fill="#f59e0b" fontSize="6" fontFamily="monospace">NO LLVM // ZERO INTERMEDIATE IR</text>
    </g>

    <g transform="translate(25, 120)">
      <rect width="425" height="35" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.1)" />
      <text x="15" y="16" fill="#e2e8f0" fontSize="7" fontFamily="monospace">BENCHMARK METRICS:</text>
      <text x="15" y="27" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">Compilation Speed: &lt; 250 µs</text>
      <text x="190" y="27" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">Output Binary: 1.8 KB</text>
      <text x="330" y="27" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">Host: Browser / Node.js</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   8. WEBGPU-VRAM-PAGER: Async Ring Buffer Staging & Paging
   ───────────────────────────────────────────────────────────── */
const VRAMPagerBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-vram" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-vram)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1" fill="none" />

    <g transform="translate(25, 30)">
      <rect width="105" height="120" rx="5" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="10" y="18" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">HOST RAM (BROWSER)</text>
      <line x1="0" y1="24" x2="105" y2="24" stroke="rgba(255,255,255,0.08)" />

      <rect x="8" y="32" width="89" height="24" rx="3" fill="#1e1b4b" stroke="#6366f1" />
      <text x="14" y="44" fill="#a5b4fc" fontSize="6.8" fontFamily="monospace">Large AI Model</text>
      <text x="14" y="52" fill="#818cf8" fontSize="6" fontFamily="monospace">7B Weights (14GB)</text>

      <rect x="8" y="64" width="89" height="48" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.08)" />
      <text x="14" y="78" fill="#64748b" fontSize="6.5" fontFamily="monospace">Chunk Slicer</text>
      <text x="14" y="88" fill="#94a3b8" fontSize="6" fontFamily="monospace">64MB Paged Slices</text>
      <text x="14" y="100" fill="#10b981" fontSize="6" fontFamily="monospace">OOM Guard: PASS</text>
    </g>

    <g transform="translate(145, 30)">
      <rect width="185" height="120" rx="5" fill="#090e1a" stroke="rgba(99, 102, 241, 0.3)" />
      <text x="12" y="18" fill="#818cf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">ASYNC RING BUFFER (STAGING)</text>
      <line x1="0" y1="24" x2="185" y2="24" stroke="rgba(99, 102, 241, 0.15)" />

      <g transform="translate(12, 36)">
        {['Slot 0 [Ready]', 'Slot 1 [mapAsync]', 'Slot 2 [Queue]', 'Slot 3 [Free]'].map((slot, i) => (
          <g key={i} transform={`translate(0, ${i * 18})`}>
            <rect width="160" height="15" rx="2" fill={i === 1 ? '#042f2e' : i === 2 ? '#1e1b4b' : '#0f172a'} stroke="rgba(255,255,255,0.1)" />
            <text x="8" y="11" fill={i === 1 ? '#34d399' : i === 2 ? '#a5b4fc' : '#94a3b8'} fontSize="6.5" fontFamily="monospace">{slot}</text>
          </g>
        ))}
      </g>
    </g>

    <g transform="translate(345, 30)">
      <rect width="105" height="120" rx="5" fill="#090e1a" stroke="rgba(16, 185, 129, 0.4)" />
      <text x="10" y="18" fill="#34d399" fontSize="7.5" fontFamily="monospace" fontWeight="bold">GPU VRAM RESIDENCE</text>
      <line x1="0" y1="24" x2="105" y2="24" stroke="rgba(16, 185, 129, 0.2)" />

      <rect x="8" y="32" width="89" height="24" rx="3" fill="#042f2e" stroke="#10b981" />
      <text x="14" y="44" fill="#6ee7b7" fontSize="6.8" fontFamily="monospace">Active Layer VRAM</text>
      <text x="14" y="52" fill="#34d399" fontSize="6" fontFamily="monospace">Budget: 2.4 / 4.0 GB</text>

      <rect x="8" y="64" width="89" height="48" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.08)" />
      <text x="14" y="78" fill="#64748b" fontSize="6.5" fontFamily="monospace">LRU Eviction</text>
      <text x="14" y="88" fill="#94a3b8" fontSize="6" fontFamily="monospace">Auto Page Unload</text>
      <text x="14" y="100" fill="#38bdf8" fontSize="6" fontFamily="monospace">0 WebGPU Crashes</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   9. SPATIAL-GLASS-UI: Optical Refraction & Phantom DOM
   ───────────────────────────────────────────────────────────── */
const SpatialOpticsBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-glass" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-glass)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" fill="none" />

    <g transform="translate(30, 25)">
      <text x="0" y="10" fill="#06b6d4" fontSize="8" fontFamily="monospace" fontWeight="bold">OPTICAL SHADER (SNELL'S LAW)</text>
      
      <rect x="20" y="30" width="120" height="50" rx="4" fill="rgba(6, 182, 212, 0.08)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.2" />
      <text x="28" y="44" fill="#06b6d4" fontSize="6.5" fontFamily="monospace">Glass Plate (IOR = 1.52)</text>

      <line x1="0" y1="15" x2="50" y2="30" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="70" y2="80" stroke="#f43f5e" strokeWidth="1" />
      <line x1="50" y1="30" x2="75" y2="80" stroke="#10b981" strokeWidth="1" />
      <line x1="50" y1="30" x2="80" y2="80" stroke="#38bdf8" strokeWidth="1" />
      <line x1="70" y1="80" x2="100" y2="105" stroke="#f43f5e" strokeWidth="1" />
      <line x1="75" y1="80" x2="108" y2="105" stroke="#10b981" strokeWidth="1" />
      <line x1="80" y1="80" x2="116" y2="105" stroke="#38bdf8" strokeWidth="1" />

      <text x="20" y="100" fill="#94a3b8" fontSize="6.2" fontFamily="monospace">Chromatic Dispersion &amp; Blur FBO</text>
    </g>

    <g transform="translate(240, 25)">
      <rect width="215" height="125" rx="5" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="12" y="16" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">PHANTOM DOM A11Y ARCHITECTURE</text>
      <line x1="0" y1="22" x2="215" y2="22" stroke="rgba(255,255,255,0.08)" />

      <rect x="12" y="30" width="88" height="35" rx="3" fill="#0f172a" stroke="rgba(6, 182, 212, 0.4)" />
      <text x="16" y="44" fill="#06b6d4" fontSize="6.8" fontFamily="monospace" fontWeight="bold">WebGL2 Canvas</text>
      <text x="16" y="55" fill="#94a3b8" fontSize="6" fontFamily="monospace">0 DOM Node Overhead</text>

      <path d="M 105 47 L 117 47" stroke="#00f0ff" strokeWidth="1.2" />
      <polygon points="117,47 112,44 112,50" fill="#00f0ff" />

      <rect x="120" y="30" width="85" height="35" rx="3" fill="#042f2e" stroke="#10b981" />
      <text x="124" y="44" fill="#34d399" fontSize="6.8" fontFamily="monospace" fontWeight="bold">Phantom DOM</text>
      <text x="124" y="55" fill="#6ee7b7" fontSize="6" fontFamily="monospace">ARIA / Screen Readers</text>

      <rect x="12" y="75" width="193" height="40" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.06)" />
      <text x="18" y="90" fill="#64748b" fontSize="6.5" fontFamily="monospace">ACCESSIBILITY: WCAG 2.1 AA COMPLIANT</text>
      <text x="18" y="102" fill="#38bdf8" fontSize="6.5" fontFamily="monospace">PARALLAX: Sensor &amp; Gyro Matrix Driven</text>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   10. EDGE-CONTEXT-ROUTER: Local Embedding & Semantic Gateway
   ───────────────────────────────────────────────────────────── */
const EdgeRouterBlueprint = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 480 180" className="w-full h-full bg-[#050811] select-none">
    <defs>
      <pattern id="grid-ecr" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="480" height="180" fill="url(#grid-ecr)" />

    <path d="M 10 20 L 10 10 L 20 10 M 470 20 L 470 10 L 460 10 M 10 160 L 10 170 L 20 170 M 470 160 L 470 170 L 460 170" 
      stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" fill="none" />

    <g transform="translate(25, 45)">
      <rect width="90" height="60" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.15)" />
      <text x="8" y="16" fill="#e2e8f0" fontSize="7.5" fontFamily="monospace" fontWeight="bold">QUERY INPUT</text>
      <line x1="0" y1="22" x2="90" y2="22" stroke="rgba(255,255,255,0.08)" />
      <text x="8" y="36" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">&quot;Query Intent...&quot;</text>
      <text x="8" y="48" fill="#8b5cf6" fontSize="6" fontFamily="monospace">Local Vectorizer</text>
    </g>

    <path d="M 115 75 L 140 75" stroke="#8b5cf6" strokeWidth="1.2" />
    <polygon points="140,75 135,72 135,78" fill="#8b5cf6" />

    <g transform="translate(145, 35)">
      <polygon points="55,0 110,40 55,80 0,40" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.2" />
      <text x="25" y="38" fill="#c4b5fd" fontSize="7" fontFamily="monospace" fontWeight="bold">COSINE SIM</text>
      <text x="28" y="48" fill="#a78bfa" fontSize="6" fontFamily="monospace">Score ≥ 0.82 ?</text>
    </g>

    <path d="M 255 55 L 290 35 L 320 35" stroke="#10b981" strokeWidth="1.2" fill="none" />
    <polygon points="320,35 315,32 315,38" fill="#10b981" />
    <g transform="translate(325, 20)">
      <rect width="130" height="42" rx="4" fill="#042f2e" stroke="#10b981" />
      <text x="10" y="16" fill="#34d399" fontSize="7" fontFamily="monospace" fontWeight="bold">RESOLVE LOCALLY (0ms)</text>
      <text x="10" y="26" fill="#6ee7b7" fontSize="6.5" fontFamily="monospace">Local Cache Hit // $0.00 Cost</text>
      <text x="10" y="36" fill="#a7f3d0" fontSize="6" fontFamily="monospace">83% Queries Handled at Edge</text>
    </g>

    <path d="M 255 95 L 290 115 L 320 115" stroke="#f59e0b" strokeWidth="1.2" fill="none" />
    <polygon points="320,115 315,112 315,118" fill="#f59e0b" />
    <g transform="translate(325, 95)">
      <rect width="130" height="42" rx="4" fill="#2e1065" stroke="#f59e0b" />
      <text x="10" y="16" fill="#fcd34d" fontSize="7" fontFamily="monospace" fontWeight="bold">ROUTE TO CLOUD LLM</text>
      <text x="10" y="26" fill="#fde68a" fontSize="6.5" fontFamily="monospace">Complex Reasoning Gate</text>
      <text x="10" y="36" fill="#cbd5e1" fontSize="6" fontFamily="monospace">Cloud Token Optimization</text>
    </g>

    <g transform="translate(25, 130)">
      <rect width="250" height="28" rx="4" fill="#090e1a" stroke="rgba(255,255,255,0.08)" />
      <text x="10" y="18" fill="#38bdf8" fontSize="6.8" fontFamily="monospace">LOCAL MODEL: all-MiniLM-L6-v2 (Quantized 23MB)</text>
    </g>
  </svg>
);

const DefaultSchematicBlueprint = ({ accent }: { accent: string }) => (
  <div className="w-full h-full bg-[#050811] flex items-center justify-center font-mono text-xs text-slate-500">
    SYSTEM ARCHITECTURE BLUEPRINT // PENDING TELEMETRY
  </div>
);
