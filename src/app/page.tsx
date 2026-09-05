'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroCanvas, NPCEmote } from '@/components/HeroCanvas';
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
  Radio,
  Smile,
  Activity,
  Zap,
  Volume2,
  VolumeX,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cyberAudio } from '@/utils/cyberAudio';
import { 
  ScrambleText, 
  AudioVisualizer, 
  LiveHardwareMonitor, 
  CyberCursor 
} from '@/components/CyberHUD';

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
  const [activeEmote, setActiveEmote] = useState<NPCEmote>('IDLE');
  const [manualEmote, setManualEmote] = useState<NPCEmote | null>(null);

  // Audio Engine State
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true); // Defaults muted to respect autoplay, clickable immediately

  // High-Voltage Overload Mode State
  const [overloadMode, setOverloadMode] = useState<boolean>(false);

  // Holographic Speech Telemetry readout next to the character
  const [telemetryMessage, setTelemetryMessage] = useState<string>('NEURAL_LINK // ACTIVE 99.8%');

  // Interactive Hacker Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: 'system' | 'user' | 'success' | 'warn' | 'matrix' }>>([
    { text: 'TERMINAL_v4.0 BOOT SEQUENCE OK // TLS 1.3 ENCRYPTED', type: 'system' },
    { text: 'TYPE "help" TO INSPECT AVAILABLE CLI COMMANDS', type: 'system' },
  ]);

  const lastScrollTime = useRef<number>(0);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of terminal when logs update
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Sync Telemetry Message with NPC Emotes
  useEffect(() => {
    switch (activeEmote) {
      case 'CURIOUS':
        setTelemetryMessage('CURIOUS // TARGETING CURSOR TRAJECTORY');
        cyberAudio?.playEmoteChime('CURIOUS');
        break;
      case 'SMUG_SMILE':
        setTelemetryMessage('CONFIDENT // 10M GAUSSIANS PROCESSED [0.8MS]');
        cyberAudio?.playEmoteChime('SMUG_SMILE');
        break;
      case 'PENSIVE':
        setTelemetryMessage('PROFILING // OPTIMIZING MORTON Z-CURVE HIERARCHY');
        cyberAudio?.playEmoteChime('PENSIVE');
        break;
      case 'SURPRISED':
        setTelemetryMessage('ALERT // DETECTED 8B PARAMETER WEIGHT STREAM');
        cyberAudio?.playEmoteChime('SURPRISED');
        break;
      case 'AGREE_NOD':
        setTelemetryMessage('AFFIRMATIVE // BI-HARMONIC WEIGHTS CONVERGED');
        cyberAudio?.playEmoteChime('AGREE_NOD');
        break;
      case 'IDLE':
      default:
        setTelemetryMessage(overloadMode ? 'OVERDRIVE // GPU CLOCK BOOSTED' : 'NEURAL_LINK // ACTIVE 99.8%');
        break;
    }
  }, [activeEmote, overloadMode]);

  // 3D Animated Scroll Navigator (Wheel event debounced for chapter gliding)
  const handleWheel = useCallback((e: WheelEvent) => {
    if (window.innerWidth < 768) return;

    const now = Date.now();
    if (now - lastScrollTime.current < 650) return;

    if (e.deltaY > 30) {
      setActiveChapter((prev) => {
        const next = Math.min(prev + 1, 2);
        if (next !== prev) {
          lastScrollTime.current = now;
          cyberAudio?.playChapterSwoosh();
        }
        return next;
      });
    } else if (e.deltaY < -30) {
      setActiveChapter((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next !== prev) {
          lastScrollTime.current = now;
          cyberAudio?.playChapterSwoosh();
        }
        return next;
      });
    }
  }, []);

  // Keyboard navigation (1, 2, 3 or Up/Down arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '1') {
        setActiveChapter(0);
        cyberAudio?.playChapterSwoosh();
      } else if (e.key === '2') {
        setActiveChapter(1);
        cyberAudio?.playChapterSwoosh();
      } else if (e.key === '3') {
        setActiveChapter(2);
        cyberAudio?.playChapterSwoosh();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setActiveChapter((prev) => {
          const next = Math.min(prev + 1, 2);
          if (next !== prev) cyberAudio?.playChapterSwoosh();
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActiveChapter((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev) cyberAudio?.playChapterSwoosh();
          return next;
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel]);

  // Audio mute toggle handler
  const handleAudioToggle = () => {
    const muted = cyberAudio?.toggleMute();
    setIsAudioMuted(muted ?? false);
  };

  // Overload mode toggle handler
  const handleOverloadToggle = () => {
    const next = !overloadMode;
    setOverloadMode(next);
    if (next) {
      cyberAudio?.playOverloadAlarm();
    } else {
      cyberAudio?.playHoverBlip(440);
    }
  };

  // Emote trigger helper
  const triggerManualEmote = (emote: NPCEmote) => {
    cyberAudio?.playHoverBlip(1100);
    setManualEmote(emote);
    setTimeout(() => setManualEmote(null), 400);
  };

  // Interactive Hacker Terminal Command Parser
  const executeTerminalCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    cyberAudio?.playTerminalClick();
    const newLogs = [...terminalLogs, { text: `> ${trimmed}`, type: 'user' as const }];
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    switch (cmd) {
      case 'help':
        newLogs.push(
          { text: 'AVAILABLE COMMANDS:', type: 'system' },
          { text: '  projects         - List all 5 high-yield GPU architectures', type: 'system' },
          { text: '  specs            - Inspect kernel compute & memory benchmarks', type: 'system' },
          { text: '  emote <type>     - Command the 3D NPC (smile, curious, ponder, gasp, nod)', type: 'system' },
          { text: '  matrix           - Stream digital falling phosphor code', type: 'system' },
          { text: '  overload         - Toggle high-voltage cyber overdrive mode', type: 'system' },
          { text: '  ping             - Query real-time GPU frame budget and latency', type: 'system' },
          { text: '  connect <email>  - Dispatch socket uplink to iKi', type: 'system' },
          { text: '  clear            - Clear terminal buffer', type: 'system' }
        );
        break;

      case 'projects':
        VAULT_PROJECTS.forEach((p, idx) => {
          newLogs.push({
            text: `[0${idx + 1}] ${p.title} // ${p.benchmark}`,
            type: 'success',
          });
        });
        break;

      case 'specs':
        newLogs.push(
          { text: 'SYSTEM HARDWARE SPECS:', type: 'system' },
          { text: '  PIPELINE: WebGPU Compute Shaders + WGSL One-Sweep Radix Sort', type: 'system' },
          { text: '  FRAME BUDGET: 16.6ms Target // 60 FPS Locked', type: 'success' },
          { text: '  VRAM PAGER: mapAsync Ring Buffers // Zero GC Allocation Spikes', type: 'system' },
          { text: '  A11Y: Phantom DOM 3D Matrix4 Synchronization Layer', type: 'system' }
        );
        break;

      case 'emote':
        const emoteMap: Record<string, NPCEmote> = {
          smile: 'SMUG_SMILE',
          curious: 'CURIOUS',
          ponder: 'PENSIVE',
          gasp: 'SURPRISED',
          nod: 'AGREE_NOD',
        };
        const targetEmote = emoteMap[arg.toLowerCase()];
        if (targetEmote) {
          triggerManualEmote(targetEmote);
          newLogs.push({ text: `EXECUTED // NPC POSTURE SET TO: ${targetEmote}`, type: 'success' });
        } else {
          newLogs.push({ text: 'ERR: UNKNOWN EMOTE. TRY: smile, curious, ponder, gasp, nod', type: 'warn' });
        }
        break;

      case 'matrix':
        newLogs.push(
          { text: '01001001 01001011 01001001 00100000 01000111 01010000 01010101', type: 'matrix' },
          { text: '>> INJECTING WGSL COMPUTE PARTICLES INTO RENDER PIPELINE...', type: 'matrix' },
          { text: '>> MORTON Z-CURVE 1-SWEEP RADIX KEY CLUSTER RESOLVED', type: 'matrix' },
          { text: '>> STAGING RING BUFFERS MAPPED VIA MAP_ASYNC', type: 'matrix' }
        );
        break;

      case 'overload':
        handleOverloadToggle();
        newLogs.push({
          text: `OVERLOAD MODE: ${!overloadMode ? 'ENGAGED // VOLTAGE MAXIMUM' : 'DISENGAGED // NOMINAL'}`,
          type: !overloadMode ? 'warn' : 'system',
        });
        break;

      case 'ping':
        newLogs.push({
          text: 'PING: 1.2ms // 60 FPS LOCKED // ZERO BUFFER JITTER // ACES FILMIC',
          type: 'success',
        });
        break;

      case 'connect':
        if (!arg || !arg.includes('@')) {
          newLogs.push({ text: 'ERR: INVALID_EMAIL // SYNTAX: connect you@domain.com', type: 'warn' });
        } else {
          cyberAudio?.playHandshakeTone();
          newLogs.push(
            { text: `ENCRYPTING PAYLOAD // SENDING TLS 1.3 DISPATCH TO ${arg}...`, type: 'system' },
            { text: 'HANDSHAKE COMPLETE [200 OK] // UPLINK ESTABLISHED WITH iKi', type: 'success' }
          );
        }
        break;

      case 'clear':
        setTerminalLogs([{ text: 'CONSOLE CLEARED // READY', type: 'system' }]);
        setTerminalInput('');
        return;

      default:
        newLogs.push({
          text: `ERR: UNRECOGNIZED COMMAND "${cmd}". TYPE "help" FOR COMMAND MATRIX`,
          type: 'warn',
        });
        break;
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const activeProject = VAULT_PROJECTS[selectedProjectIndex];

  return (
    <main className={`relative min-h-screen md:h-screen w-full bg-void text-slate-100 overflow-x-hidden md:overflow-hidden selection:bg-neon-crimson selection:text-white flex flex-col justify-between transition-colors duration-700 ${
      overloadMode ? 'overload-active' : ''
    }`}>
      {/* Custom Hardware-Accelerated Cybernetic Cursor */}
      <CyberCursor />

      {/* 3D WebGL Canvas Layer with Calibrated Portrait Bust Framing (Zero Character Obstruction) */}
      <HeroCanvas 
        activeChapter={activeChapter} 
        manualEmote={manualEmote}
        onEmoteChange={setActiveEmote}
        overloadMode={overloadMode}
        activeAccent={activeProject.accent}
      />

      {/* ═══════════════════════════════════════════════════════════════
          TOP HUD NAVIGATION & TELEMETRY HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pt-3.5 pointer-events-auto">
        <div className="w-full flex items-center justify-between gap-3">
          
          {/* Identity & Status Beacon */}
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${overloadMode ? 'bg-neon-crimson shadow-[0_0_12px_#ff0055]' : 'bg-neon-cyan shadow-[0_0_10px_#00e5ff]'} animate-pulse`} />
            <div className="flex flex-col">
              <span className="font-mono font-extrabold tracking-widest text-sm text-white uppercase flex items-center gap-1.5">
                <ScrambleText text="iKi" />
                <span className="text-slate-500 font-normal">//</span>
                <span className={`text-[11px] font-semibold ${overloadMode ? 'text-neon-crimson' : 'text-neon-cyan'}`}>
                  {overloadMode ? 'OVERLOAD ACTIVE' : 'SYSTEM ONLINE'}
                </span>
              </span>
            </div>
          </div>

          {/* Interactive Chapter Timeline Selector */}
          <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-slate-950/80 border border-white/[0.08] backdrop-blur-xl font-mono text-xs shadow-glass-card">
            <button
              onClick={() => {
                setActiveChapter(0);
                cyberAudio?.playChapterSwoosh();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeChapter === 0
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>01 // <ScrambleText text="OVERVIEW" triggerHover={false} /></span>
            </button>

            <button
              onClick={() => {
                setActiveChapter(1);
                cyberAudio?.playChapterSwoosh();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeChapter === 1
                  ? 'bg-neon-crimson/20 text-neon-crimson border border-neon-crimson/40 shadow-[0_0_12px_rgba(255,0,85,0.25)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>02 // <ScrambleText text="VAULT" triggerHover={false} /></span>
            </button>

            <button
              onClick={() => {
                setActiveChapter(2);
                cyberAudio?.playChapterSwoosh();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeChapter === 2
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_12px_rgba(57,211,83,0.25)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>03 // <ScrambleText text="UPLINK" triggerHover={false} /></span>
            </button>
          </nav>

          {/* Right Action Tools: Overload Turbo + Audio EQ + GitHub */}
          <div className="flex items-center gap-2">
            
            {/* Real-time Hardware Performance Gauges */}
            <div className="hidden lg:block">
              <LiveHardwareMonitor />
            </div>

            {/* Overload Turbo Mode Toggle Button */}
            <button
              onClick={handleOverloadToggle}
              className={`px-2.5 py-1.5 rounded-xl border font-mono text-[11px] flex items-center gap-1.5 backdrop-blur-xl transition-all ${
                overloadMode
                  ? 'bg-neon-crimson text-white border-neon-crimson shadow-[0_0_20px_rgba(255,0,85,0.6)] font-bold animate-pulse'
                  : 'bg-slate-950/70 hover:bg-white/[0.08] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title="Toggle High-Voltage Cyber Overdrive"
            >
              <Zap className={`w-3.5 h-3.5 ${overloadMode ? 'fill-white' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">OVERLOAD</span>
            </button>

            {/* Live Audio Equalizer & Mute Toggle */}
            <AudioVisualizer isMuted={isAudioMuted} onToggle={handleAudioToggle} />

            {/* GitHub Profile Action */}
            <a
              href="https://github.com/nff747"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio?.playHoverBlip(1500)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-xl"
            >
              <Github className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="hidden sm:inline">GITHUB</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP SIDE DECKS WORKSPACE
          Anchored to the far flanks of the viewport to keep the 
          central 3D character 100% UNCOVERED and prominently visible.
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-2 flex-1 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT GLASS DECK: ARCHITECT SPECS, TELEMETRY & NPC EMOTE DECK
            ───────────────────────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[310px] lg:w-[345px] pointer-events-auto shrink-0"
        >
          <div className="glass-panel cyber-corner p-5 rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl flex flex-col gap-4">
            
            {/* Domain Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/25 text-[11px] font-mono tracking-wider text-neon-cyan w-fit">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span><ScrambleText text="GPU ARCHITECTURE // SPATIAL UI" /></span>
            </div>

            {/* Architect Identity */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                High-Yield <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-slate-100 to-slate-400">
                  GPU Pipelines
                </span>
              </h1>
              <p className="mt-1 text-xs font-mono text-slate-400">
                iKi // WebGL & WebGPU Architect
              </p>
            </div>

            {/* Core Value Proposition */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Bridging complex GPU architecture with high-converting web experiences. Specializing in WebGL rendering pipelines, browser-native AI memory management, and spatial UI.
            </p>

            {/* Real-time Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/[0.08] font-mono text-center">
              <div 
                onMouseEnter={() => cyberAudio?.playHoverBlip(900)}
                className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-neon-cyan/30 transition-all cursor-default"
              >
                <div className="text-neon-cyan font-bold text-xs"><ScrambleText text="60 FPS" /></div>
                <div className="text-[9px] text-slate-400 mt-0.5">LOCKED</div>
              </div>
              <div 
                onMouseEnter={() => cyberAudio?.playHoverBlip(1000)}
                className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-neon-crimson/30 transition-all cursor-default"
              >
                <div className="text-neon-crimson font-bold text-xs"><ScrambleText text="10M+" /></div>
                <div className="text-[9px] text-slate-400 mt-0.5">SPLAT BVH</div>
              </div>
              <div 
                onMouseEnter={() => cyberAudio?.playHoverBlip(1100)}
                className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-green-400/30 transition-all cursor-default"
              >
                <div className="text-green-400 font-bold text-xs"><ScrambleText text="8B+" /></div>
                <div className="text-[9px] text-slate-400 mt-0.5">VRAM PAGING</div>
              </div>
            </div>

            {/* ── AUTONOMOUS NPC EMOTE CONTROLLER & STATE BADGE ── */}
            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
                  NPC KINEMATICS:
                </span>
                <span className="text-neon-cyan font-semibold tracking-wider text-[10px]">
                  {activeEmote === 'IDLE' && 'IDLE // OBSERVING'}
                  {activeEmote === 'CURIOUS' && 'CURIOUS_LOOK 💡'}
                  {activeEmote === 'SMUG_SMILE' && 'WARM_SMILE 😊'}
                  {activeEmote === 'PENSIVE' && 'PROFILING_SHADERS 🤔'}
                  {activeEmote === 'SURPRISED' && 'SURPRISED_GASPO 😮'}
                  {activeEmote === 'AGREE_NOD' && 'AFFIRMATIVE_NOD 🙌'}
                </span>
              </div>

              {/* Interactive NPC Emote Triggers */}
              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                <button
                  onClick={() => triggerManualEmote('SMUG_SMILE')}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-neon-cyan/20 hover:text-neon-cyan border border-white/[0.06] transition-colors"
                  title="Trigger warm smile"
                >
                  😊 Smile
                </button>
                <button
                  onClick={() => triggerManualEmote('CURIOUS')}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-neon-cyan/20 hover:text-neon-cyan border border-white/[0.06] transition-colors"
                  title="Trigger curious tilt"
                >
                  💡 Curious
                </button>
                <button
                  onClick={() => triggerManualEmote('PENSIVE')}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-neon-cyan/20 hover:text-neon-cyan border border-white/[0.06] transition-colors"
                  title="Trigger thought"
                >
                  🤔 Ponder
                </button>
                <button
                  onClick={() => triggerManualEmote('SURPRISED')}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-neon-cyan/20 hover:text-neon-cyan border border-white/[0.06] transition-colors"
                  title="Trigger gasp"
                >
                  😮 Gasp
                </button>
                <button
                  onClick={() => triggerManualEmote('AGREE_NOD')}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-neon-cyan/20 hover:text-neon-cyan border border-white/[0.06] transition-colors"
                  title="Trigger nod"
                >
                  🙌 Nod
                </button>
                <button
                  onClick={() => triggerManualEmote('IDLE')}
                  className="px-1.5 py-0.5 rounded-md bg-white/[0.02] text-slate-500 hover:text-white border border-white/[0.04] transition-colors"
                  title="Reset to autonomous idle"
                >
                  ⚡ Auto
                </button>
              </div>
            </div>

            {/* 3D Spatial Stepper Indicator */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-white/[0.06]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                CHAPTER {activeChapter + 1} OF 3
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                SCROLL TO GLIDE
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            CENTER CLEAR CORRIDOR: UNOBSTRUCTED 3D CHARACTER STAGE
            Features subtle floating holographic telemetry brackets
            around the open central airspace without touching the face.
            ───────────────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-1 pointer-events-none min-w-[220px] flex-col items-center justify-start pt-8">
          {/* Floating Holographic AI Telemetry Tag */}
          <motion.div
            key={telemetryMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-3 py-1 rounded-full bg-slate-950/70 border border-neon-cyan/30 text-neon-cyan font-mono text-[10px] tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
            <ScrambleText text={telemetryMessage} speed={20} />
          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT GLASS DECK: DYNAMIC INTERACTIVE MODULE
            Anchored to the right edge with zero obstruction of the character.
            ───────────────────────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[330px] lg:w-[370px] pointer-events-auto shrink-0"
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
                className="glass-panel cyber-corner p-5 rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl flex flex-col gap-4"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-300 uppercase">
                    <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
                    <span><ScrambleText text="SYSTEM CAPABILITIES" /></span>
                  </div>
                  <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                    5 ENGINES
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div 
                    onMouseEnter={() => cyberAudio?.playHoverBlip(800)}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-neon-cyan/40 hover:bg-white/[0.05] transition-all cursor-default"
                  >
                    <div className="text-white font-semibold flex items-center justify-between">
                      <span>01 // ONE-SWEEP RADIX SORT</span>
                      <span className="text-neon-cyan text-[10px]">WGSL</span>
                    </div>
                    <p className="text-slate-400 mt-0.5 text-[11px] font-sans">
                      10M+ point spatial indexing keeping Morton keys entirely in VRAM.
                    </p>
                  </div>

                  <div 
                    onMouseEnter={() => cyberAudio?.playHoverBlip(900)}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-neon-crimson/40 hover:bg-white/[0.05] transition-all cursor-default"
                  >
                    <div className="text-white font-semibold flex items-center justify-between">
                      <span>02 // KERNEL VRAM PAGER</span>
                      <span className="text-neon-crimson text-[10px]">WEBGPU</span>
                    </div>
                    <p className="text-slate-400 mt-0.5 text-[11px] font-sans">
                      PCIe asynchronous ring-buffers streaming 8B LLM weights zero-GC.
                    </p>
                  </div>

                  <div 
                    onMouseEnter={() => cyberAudio?.playHoverBlip(1000)}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-green-400/40 hover:bg-white/[0.05] transition-all cursor-default"
                  >
                    <div className="text-white font-semibold flex items-center justify-between">
                      <span>03 // ZERO-COPY AUTO-RIG</span>
                      <span className="text-green-400 text-[10px]">WORKERS</span>
                    </div>
                    <p className="text-slate-400 mt-0.5 text-[11px] font-sans">
                      SharedArrayBuffer multi-threaded skeletal rigging & ONNX skinning.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex gap-2.5">
                  <button
                    onClick={() => {
                      setActiveChapter(1);
                      cyberAudio?.playChapterSwoosh();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-neon-cyan hover:text-slate-950 text-white font-mono text-xs font-semibold border border-white/[0.1] hover:border-neon-cyan transition-all flex items-center justify-center gap-1.5 shadow-glass-glow"
                  >
                    <span>EXPLORE VAULT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveChapter(2);
                      cyberAudio?.playChapterSwoosh();
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs border border-white/[0.08] transition-all"
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
                className="glass-panel cyber-corner p-5 rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl flex flex-col gap-4"
              >
                {/* Vault Top Bar */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-300 uppercase">
                    <Box className="w-3.5 h-3.5 text-neon-crimson" />
                    <span><ScrambleText text="THE VAULT // 5 PRODUCTIONS" /></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedProjectIndex + 1} / {VAULT_PROJECTS.length}
                  </span>
                </div>

                {/* Project Selector Mini-Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none font-mono text-[10px]">
                  {VAULT_PROJECTS.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectIndex(idx);
                        cyberAudio?.playHoverBlip(1000 + idx * 100);
                      }}
                      className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                        selectedProjectIndex === idx
                          ? 'bg-neon-crimson/20 text-neon-crimson border border-neon-crimson/40 font-semibold shadow-[0_0_10px_rgba(255,0,85,0.3)]'
                          : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.05]'
                      }`}
                    >
                      {p.id.split('-')[0].toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Selected Project Card */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col gap-2.5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        <ScrambleText text={activeProject.title} />
                      </h3>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                        {activeProject.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neon-cyan mt-0.5">
                      {activeProject.benchmark}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {activeProject.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {activeProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        onMouseEnter={() => cyberAudio?.playHoverBlip(1400)}
                        className="px-1.5 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-neon-cyan/40 text-[9px] font-mono text-slate-400 hover:text-neon-cyan transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Controls & GitHub Link */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedProjectIndex((prev) =>
                          prev === 0 ? VAULT_PROJECTS.length - 1 : prev - 1
                        );
                        cyberAudio?.playHoverBlip(950);
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                      title="Previous System"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProjectIndex((prev) =>
                          (prev + 1) % VAULT_PROJECTS.length
                        );
                        cyberAudio?.playHoverBlip(1050);
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                      title="Next System"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberAudio?.playHoverBlip(1600)}
                    className="py-1.5 px-3 rounded-xl bg-neon-crimson hover:bg-neon-crimson/90 text-white font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                  >
                    <span>INSPECT REPO</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* ── CHAPTER 2: CLIENT UPLINK (INTERACTIVE HACKER TERMINAL CLI) ── */}
            {activeChapter === 2 && (
              <motion.div
                key="chapter-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel cyber-corner rounded-2xl border border-white/[0.1] shadow-glass-card backdrop-blur-xl overflow-hidden flex flex-col"
              >
                {/* Terminal Window Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-white/[0.08] text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                    <span className="ml-1 text-slate-300 font-semibold tracking-wider text-[11px]">
                      UPLINK // <ScrambleText text="TERMINAL_v4.0" />
                    </span>
                  </div>
                  <span className="text-[10px] text-green-400">ENCRYPTED</span>
                </div>

                {/* Interactive CLI Console Log Stream */}
                <div className="p-3.5 font-mono text-[11px] h-48 overflow-y-auto space-y-1.5 scanline">
                  {terminalLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-tight ${
                        log.type === 'system'
                          ? 'text-slate-400'
                          : log.type === 'user'
                          ? 'text-neon-cyan font-bold'
                          : log.type === 'success'
                          ? 'text-green-400 font-semibold'
                          : log.type === 'matrix'
                          ? 'text-green-500 font-mono tracking-widest'
                          : 'text-amber-400'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>

                {/* Active Command Line Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeTerminalCommand(terminalInput);
                  }}
                  className="p-2.5 bg-slate-950/80 border-t border-white/[0.08] flex items-center gap-2"
                >
                  <span className="text-neon-cyan font-bold font-mono text-[11px] select-none">
                    iKi:~$
                  </span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => {
                      setTerminalInput(e.target.value);
                      cyberAudio?.playTerminalClick();
                    }}
                    placeholder='Type "help", "projects", or "emote smile"...'
                    className="flex-1 bg-transparent text-white font-mono text-[11px] focus:outline-none placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-neon-cyan hover:bg-neon-cyan/90 text-slate-950 font-mono font-bold text-[10px] transition-all"
                  >
                    RUN
                  </button>
                </form>

                <div className="px-3.5 py-1.5 bg-slate-950/60 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>DISCORD // @iki.gpu</span>
                  <span>TRY: "emote nod" OR "matrix"</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CYBERNETIC STATUS FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pb-3 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>RUNTIME: OPTIMAL // ACES FILMIC // ZERO CHARACTER OCCLUSION</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-600 hidden sm:inline">16.6ms FRAME TARGET</span>
          <span>© 2026 iKi // WebGL Performance Architecture</span>
        </div>
      </footer>
    </main>
  );
}
