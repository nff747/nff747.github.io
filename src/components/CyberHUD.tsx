'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cyberAudio } from '@/utils/cyberAudio';

// ═════════════════════════════════════════════════════════════════
// 1. SCRAMBLE TEXT DECODER (CYBER ALPHANUMERIC GLYPH ANIMATOR)
// ═════════════════════════════════════════════════════════════════
const GLYPHS = '0101XYZ_#@&%<>[]{}*+=!/?;~|▲■◆★';

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerHover?: boolean;
  speed?: number;
}

export function ScrambleText({ text, className = '', triggerHover = true, speed = 25 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
        setIsScrambling(false);
      }

      iteration += 1 / 2;
    }, speed);
  };

  useEffect(() => {
    startScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span
      className={`inline-block font-mono select-none ${className}`}
      onMouseEnter={() => {
        if (triggerHover) {
          cyberAudio?.playHoverBlip(1200);
          startScramble();
        }
      }}
    >
      {displayText}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════
// 2. LIVE AUDIO SPECTRUM VISUALIZER BARS
// ═════════════════════════════════════════════════════════════════
export function AudioVisualizer({ isMuted, onToggle }: { isMuted: boolean; onToggle: () => void }) {
  const [levels, setLevels] = useState<number[]>([4, 8, 12, 6, 14, 10, 5, 9]);

  useEffect(() => {
    let animId: number;
    const update = () => {
      if (!isMuted && cyberAudio) {
        const freqData = cyberAudio.getFrequencyData();
        const newLevels = [
          Math.max(3, (freqData[0] || 0) / 16),
          Math.max(4, (freqData[2] || 0) / 14),
          Math.max(2, (freqData[4] || 0) / 18),
          Math.max(5, (freqData[6] || 0) / 12),
          Math.max(3, (freqData[8] || 0) / 15),
          Math.max(6, (freqData[10] || 0) / 13),
          Math.max(2, (freqData[12] || 0) / 20),
          Math.max(4, (freqData[14] || 0) / 16),
        ];
        setLevels(newLevels);
      } else {
        setLevels([2, 2, 2, 2, 2, 2, 2, 2]);
      }
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isMuted]);

  return (
    <button
      onClick={() => {
        onToggle();
        cyberAudio?.playHoverBlip(1400);
      }}
      className={`px-2.5 py-1.5 rounded-xl border font-mono text-[11px] flex items-center gap-2 backdrop-blur-xl transition-all ${
        isMuted
          ? 'bg-slate-950/60 border-white/[0.08] text-slate-500 hover:text-slate-300'
          : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_12px_rgba(0,229,255,0.2)]'
      }`}
      title={isMuted ? 'Unmute Cyber Audio' : 'Mute Cyber Audio'}
    >
      <div className="flex items-end gap-[2px] h-3.5 w-5">
        {levels.map((lvl, i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full transition-all duration-75 ${
              isMuted ? 'bg-slate-600' : 'bg-neon-cyan'
            }`}
            style={{ height: `${Math.min(14, lvl)}px` }}
          />
        ))}
      </div>
      <span className="hidden sm:inline tracking-wider font-bold">
        {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
      </span>
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════
// 3. REAL-TIME HARDWARE & FPS SPARKLINE MONITOR
// ═════════════════════════════════════════════════════════════════
export function LiveHardwareMonitor() {
  const [fps, setFps] = useState<number>(60);
  const [clock, setClock] = useState<number>(2450);
  const [history, setHistory] = useState<number[]>([16, 16.2, 15.9, 16.1, 16.4, 16.0, 15.8, 16.2]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        const measuredFps = Math.round((frameCount * 1000) / (now - lastTime));
        setFps(measuredFps);
        setClock(2400 + Math.floor(Math.random() * 80));
        setHistory((prev) => [...prev.slice(1), 1000 / Math.max(measuredFps, 30)]);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute SVG sparkline path
  const minVal = 14;
  const maxVal = 20;
  const points = history
    .map((val, i) => {
      const x = (i / (history.length - 1)) * 48;
      const y = 14 - ((val - minVal) / (maxVal - minVal)) * 12;
      return `${x},${Math.max(1, Math.min(13, y))}`;
    })
    .join(' ');

  return (
    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
      {/* Dynamic FPS Meter */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
        <span className="text-neon-cyan font-bold">{fps} FPS</span>
      </div>

      {/* Frame-time Sparkline Graph */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <span className="text-[9px] text-slate-500">16.6ms</span>
        <svg className="w-12 h-3.5 overflow-visible">
          <polyline
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      {/* GPU Clock */}
      <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <span className="text-slate-500">CLK:</span>
        <span className="text-slate-300">{clock} MHz</span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 4. CYBERNETIC TARGETING RETICLE & MAGNETIC CURSOR
// ═════════════════════════════════════════════════════════════════
export function CyberCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate custom cursor on non-touch desktop viewports
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      const clickable = !!target?.closest('button, a, input, textarea, [role="button"]');
      setIsHovered(clickable);
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const lerp = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Center Precise Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-neon-cyan shadow-[0_0_8px_#00e5ff] transition-transform duration-75 ease-out will-change-transform"
      />

      {/* Trailing Spring Reticle with Corner Brackets */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full border transition-all duration-200 ease-out will-change-transform flex items-center justify-center ${
          isHovered
            ? 'w-10 h-10 -ml-5 -mt-5 border-neon-crimson bg-neon-crimson/10 shadow-[0_0_15px_rgba(255,0,85,0.4)] scale-110'
            : 'w-8 h-8 border-neon-cyan/40 bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
        }`}
      >
        {/* Reticle Crosshairs */}
        <div className="absolute w-full h-[1px] bg-neon-cyan/20" />
        <div className="absolute h-full w-[1px] bg-neon-cyan/20" />
      </div>
    </div>
  );
}
