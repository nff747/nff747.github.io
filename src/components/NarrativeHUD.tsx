'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChapterId, DialogueBeat, STORY_BEATS } from '@/types/story';
import { Volume2, VolumeX, ChevronRight, Play, Pause, Sparkles } from 'lucide-react';

interface NarrativeHUDProps {
  currentChapter: ChapterId;
  onSelectChapter: (chapter: ChapterId) => void;
  hoveredProject?: string | null;
}

export function NarrativeHUD({
  currentChapter,
  onSelectChapter,
  hoveredProject,
}: NarrativeHUDProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Audio Context for synthesized cyber chimes
  const audioCtxRef = useRef<AudioContext | null>(null);

  const activeBeatIndex = STORY_BEATS.findIndex((b) => b.chapter === currentChapter);
  const currentBeat: DialogueBeat = STORY_BEATS[activeBeatIndex] || STORY_BEATS[0];

  // Dynamic override when hovering over a specific project
  const effectiveText = hoveredProject
    ? `Inspecting ${hoveredProject}... Squeezing every microsecond of compute out of this architecture.`
    : currentBeat.text;

  // Synthesize cyberpunk terminal typing beep
  const playCyberChime = (pitch = 800) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio playback allowed to fail gracefully
    }
  };

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(effectiveText.slice(0, index));
      if (index % 3 === 0) {
        playCyberChime(700 + (index % 5) * 80);
      }

      if (index >= effectiveText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [effectiveText, audioEnabled]);

  // Auto-play story pacing
  useEffect(() => {
    if (!autoPlay || isTyping || hoveredProject) return;

    const timer = setTimeout(() => {
      const nextIndex = (activeBeatIndex + 1) % STORY_BEATS.length;
      onSelectChapter(STORY_BEATS[nextIndex].chapter);
    }, 7000);

    return () => clearTimeout(timer);
  }, [autoPlay, isTyping, activeBeatIndex, onSelectChapter, hoveredProject]);

  const handleNextChapter = () => {
    if (currentBeat.actionPrompt?.scrollToId) {
      const el = document.getElementById(currentBeat.actionPrompt.scrollToId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    if (currentBeat.actionPrompt?.targetChapter) {
      onSelectChapter(currentBeat.actionPrompt.targetChapter);
    } else {
      const nextIndex = (activeBeatIndex + 1) % STORY_BEATS.length;
      onSelectChapter(STORY_BEATS[nextIndex].chapter);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pointer-events-auto select-none">
      {/* Chapter Progress Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-3">
        {STORY_BEATS.map((beat, idx) => {
          const isActive = beat.chapter === currentChapter;
          return (
            <button
              key={beat.id}
              onClick={() => onSelectChapter(beat.chapter)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-neon-glow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/[0.05] hover:bg-white/[0.05]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-neon-cyan animate-ping' : 'bg-slate-500'
                }`}
              />
              <span>0{idx + 1} // {beat.chapter}</span>
            </button>
          );
        })}
      </div>

      {/* Cyber Dialogue Box */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.1] shadow-glass-card backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              {hoveredProject ? 'NEURAL PROBE' : currentBeat.speaker}
            </span>
            <span className="text-[10px] font-mono text-neon-cyan/80 bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20 uppercase">
              {hoveredProject ? 'INSPECTION' : currentBeat.title}
            </span>
          </div>

          {/* Sound & Auto-Play Controls */}
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-1 rounded hover:bg-white/[0.08] hover:text-neon-cyan transition-colors"
              title={audioEnabled ? 'Mute Chimes' : 'Enable Cyber Voice Synth'}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-neon-cyan" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="p-1 rounded hover:bg-white/[0.08] hover:text-neon-cyan transition-colors text-[10px] font-mono flex items-center gap-1"
              title={autoPlay ? 'Pause Story Auto-Play' : 'Resume Story Auto-Play'}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5 text-neon-cyan" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{autoPlay ? 'AUTO' : 'MANUAL'}</span>
            </button>
          </div>
        </div>

        {/* Narrative Subtitle Typewriter Stream */}
        <div className="min-h-[52px] sm:min-h-[48px] flex items-center">
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed tracking-wide">
            {displayedText}
            {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-neon-cyan animate-pulse align-middle" />}
          </p>
        </div>

        {/* Interactive Action Prompt */}
        <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-white/[0.04] text-xs font-mono">
          <span className="text-slate-500 text-[10px]">
            {isTyping ? 'TRANSMITTING NEURAL PACKET...' : 'SYNCHRONIZED WITH GPU CORE'}
          </span>

          <button
            onClick={handleNextChapter}
            className="inline-flex items-center gap-1.5 text-neon-cyan hover:text-white transition-colors group font-semibold"
          >
            <span>{currentBeat.actionPrompt?.label || 'NEXT CHAPTER →'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
