'use client';

import React, { useState } from 'react';
import { HeroCanvas } from '@/components/HeroCanvas';
import { NarrativeHUD } from '@/components/NarrativeHUD';
import { CaseStudies } from '@/components/CaseStudies';
import { TerminalContact } from '@/components/TerminalContact';
import { ChapterId } from '@/types/story';
import { Github, Sparkles } from 'lucide-react';

export default function Home() {
  const [currentChapter, setCurrentChapter] = useState<ChapterId>('prologue');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const handleSelectChapter = (chapter: ChapterId) => {
    setCurrentChapter(chapter);
    if (chapter === 'vault') {
      const el = document.getElementById('case-studies');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (chapter === 'uplink') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (chapter === 'prologue') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen bg-void text-slate-100 overflow-x-hidden selection:bg-neon-crimson selection:text-white">
      {/* Background Radial Glow Accent */}
      <div className="fixed inset-0 pointer-events-none bg-radial-glow z-0" />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: THE WEBGL CINEMATIC HERO & NARRATIVE HUD
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-between px-4 sm:px-6 pt-6 pb-8 overflow-hidden">
        {/* R3F 3D Storytelling Canvas (Interactive Anime Character Companion) */}
        <HeroCanvas currentChapter={currentChapter} hoveredProject={hoveredProject} />

        {/* Floating Top Navigation HUD */}
        <header className="relative z-20 w-[96%] max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between border border-white/[0.08] shadow-glass-card backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse" />
              <span className="font-mono font-bold tracking-widest text-sm text-white uppercase">
                iKi // ARCHITECT
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider text-slate-400">
              <button
                onClick={() => handleSelectChapter('prologue')}
                className={`transition-colors ${currentChapter === 'prologue' ? 'text-neon-cyan' : 'hover:text-slate-200'}`}
              >
                [ 01 // PROLOGUE ]
              </button>
              <button
                onClick={() => handleSelectChapter('philosophy')}
                className={`transition-colors ${currentChapter === 'philosophy' ? 'text-neon-cyan' : 'hover:text-slate-200'}`}
              >
                [ 02 // PHILOSOPHY ]
              </button>
              <button
                onClick={() => handleSelectChapter('vault')}
                className={`transition-colors ${currentChapter === 'vault' ? 'text-neon-cyan' : 'hover:text-slate-200'}`}
              >
                [ 03 // VAULT ]
              </button>
              <button
                onClick={() => handleSelectChapter('uplink')}
                className={`transition-colors ${currentChapter === 'uplink' ? 'text-neon-cyan' : 'hover:text-slate-200'}`}
              >
                [ 04 // UPLINK ]
              </button>
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

        {/* Lower Third: Interactive Narrative Dialogue Stream & Companion Subtitles */}
        <div className="relative z-20 w-full max-w-3xl mx-auto mt-auto pointer-events-none">
          <NarrativeHUD
            currentChapter={currentChapter}
            onSelectChapter={handleSelectChapter}
            hoveredProject={hoveredProject}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: FEATURED CASE STUDIES & ARTIFACT VAULT
          ═══════════════════════════════════════════════════════════════ */}
      <div id="case-studies">
        <CaseStudies onHoverProject={setHoveredProject} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: THE FRICTIONLESS TERMINAL UPLINK
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
