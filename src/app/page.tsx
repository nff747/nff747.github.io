'use client';

import React from 'react';
import { HeroCanvas } from '@/components/HeroCanvas';
import { CaseStudies } from '@/components/CaseStudies';
import { TerminalContact } from '@/components/TerminalContact';
import { Sparkles, Github, Layers, Cpu, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void text-slate-100 overflow-x-hidden selection:bg-neon-crimson selection:text-white">
      {/* Ambient Radial Lighting Glow */}
      <div className="fixed inset-0 pointer-events-none bg-radial-glow z-0" />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: THE WEBGL HERO CANVAS & DARK GLASSMORPHIC OVERLAY
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-between px-6 pt-8 pb-12 overflow-hidden">
        {/* R3F 3D Character Hero Canvas */}
        <HeroCanvas />

        {/* Floating Top Navigation Glass Bar */}
        <header className="relative z-20 w-[94%] max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between border border-white/[0.08] shadow-glass-card backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse" />
              <span className="font-mono font-bold tracking-widest text-sm text-white uppercase">
                iKi // ARCHITECT
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-slate-400">
              <a href="#case-studies" className="hover:text-neon-cyan transition-colors">
                [ 01 // CASE STUDIES ]
              </a>
              <a href="#contact" className="hover:text-neon-cyan transition-colors">
                [ 02 // UPLINK ]
              </a>
            </nav>

            <a
              href="https://github.com/nff747"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
            >
              <Github className="w-4 h-4 text-neon-cyan" />
              <span className="hidden sm:inline">GITHUB</span>
            </a>
          </div>
        </header>

        {/* Lower Third: Value Proposition & Engineering Metrics */}
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-auto pt-16 pointer-events-none">
          {/* Engineering Domain Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 border border-white/[0.1] text-xs font-mono tracking-widest text-neon-cyan uppercase mb-4 pointer-events-auto backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
            <span>WebGL Performance Architecture // Spatial UI</span>
          </div>

          {/* High-Impact Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.1] drop-shadow-md">
            High-Yield GPU Pipelines <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              For The Modern Web
            </span>
          </h1>

          {/* Exact Engineering Value Proposition Glass Card */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl max-w-2xl mx-auto border border-white/[0.1] shadow-glass-card pointer-events-auto backdrop-blur-xl">
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Bridging complex GPU architecture with high-converting web experiences. Specializing in WebGL rendering pipelines, browser-native AI memory management, and spatial UI.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="text-neon-cyan font-bold">60 FPS</span>
              <span>LOCKED LATENCY</span>
            </div>
            <span className="text-white/[0.2]">•</span>
            <div className="flex items-center gap-2">
              <span className="text-neon-crimson font-bold">10M+</span>
              <span>SPLAT BVH INDEXING</span>
            </div>
            <span className="text-white/[0.2]">•</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold">8B+</span>
              <span>VRAM PAGING</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: FEATURED CASE STUDIES (THE PROOF)
          ═══════════════════════════════════════════════════════════════ */}
      <div id="case-studies">
        <CaseStudies />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: THE FRICTIONLESS TERMINAL CONTACT
          ═══════════════════════════════════════════════════════════════ */}
      <div id="contact">
        <TerminalContact />
      </div>

      {/* Subtle Minimalist Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center text-xs font-mono text-slate-500">
        <p>© 2026 iKi // Engineered for extreme runtime efficiency and zero DOM waste.</p>
      </footer>
    </main>
  );
}
