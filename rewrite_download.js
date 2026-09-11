const fs = require('fs');

const projectsCode = fs.readFileSync('projects.ts', 'utf8');

const newCode = `
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
${projectsCode}

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
            ctx.strokeStyle = \`rgba(255, 255, 255, \${0.05 * (1 - dist / 120)})\`;
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
              Download Hub Hub
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
                className={\`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 \${
                  selectedCategory === cat 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                }\`}
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
                  backgroundImage: \`url(/banners/\${activeModalProject.id}.jpg)\`,
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
