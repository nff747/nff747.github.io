"use client";

import React, { useEffect, useRef } from "react";
import { Download, ExternalLink, Terminal, CheckCircle2 } from "lucide-react";

interface ProjectItem {
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
}

interface HolographicPodProps {
  project: ProjectItem;
  onOpenDetails: (project: ProjectItem) => void;
  onAudioBlip: (freq?: number) => void;
}

export function HolographicPod({ project, onOpenDetails, onAudioBlip }: HolographicPodProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = Math.random() * 100;

    const width = 560;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Deep cybernetic dark chamber
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#040814");
      bgGrad.addColorStop(0.5, "#081226");
      bgGrad.addColorStop(1, "#020409");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective floor grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1;
      const horizon = height * 0.74;
      const vanishingX = width / 2;

      for (let i = -14; i <= 14; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingX + i * 18, horizon);
        ctx.lineTo(vanishingX + i * 65, height);
        ctx.stroke();
      }
      for (let y = horizon; y < height; y += (y - horizon) * 0.42 + 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width * 0.5;
      const cy = height * 0.46;

      if (project.id === "auto-rig-web") {
        // ── 3D HOLOGRAPHIC HUMANOID SKELETON ──
        const rot = time * 0.65;
        const scale = 1.25;

        const joints: [number, number, number][] = [
          [0, -70, 0],   // 0: Head
          [0, -50, 0],   // 1: Neck
          [0, -20, 0],   // 2: Spine / Chest
          [0, 15, 0],    // 3: Pelvis
          [-25, -45, 0], // 4: L Shoulder
          [-42, -20, Math.sin(time) * 12], // 5: L Elbow
          [-58, 5, Math.sin(time) * 22],   // 6: L Hand
          [25, -45, 0],  // 7: R Shoulder
          [42, -20, -Math.sin(time) * 12], // 8: R Elbow
          [58, 5, -Math.sin(time) * 22],   // 9: R Hand
          [-16, 22, 0],  // 10: L Hip
          [-20, 56, Math.cos(time) * 12],  // 11: L Knee
          [-22, 90, Math.cos(time) * 18],  // 12: L Foot
          [16, 22, 0],   // 13: R Hip
          [20, 56, -Math.cos(time) * 12], // 14: R Knee
          [22, 90, -Math.cos(time) * 18], // 15: R Foot
        ];

        const bones = [
          [0, 1], [1, 2], [2, 3],
          [1, 4], [4, 5], [5, 6],
          [1, 7], [7, 8], [8, 9],
          [3, 10], [10, 11], [11, 12],
          [3, 13], [13, 14], [14, 15]
        ];

        const projected = joints.map(([x, y, z]) => {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = x * cosR - z * sinR;
          const rz = x * sinR + z * cosR;
          const fov = 240;
          const pScale = fov / (fov + rz);
          return {
            px: cx + rx * scale * pScale,
            py: cy + y * scale * pScale,
            depth: rz
          };
        });

        // Floor Pedestal Rings
        ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 95, 55, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing Wireframe Skeleton
        ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 12;
        bones.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(projected[a].px, projected[a].py);
          ctx.lineTo(projected[b].px, projected[b].py);
          ctx.stroke();
        });

        // Joints
        projected.forEach((p, idx) => {
          ctx.fillStyle = idx === 0 || idx === 6 || idx === 9 ? "#c084fc" : "#38bdf8";
          ctx.beginPath();
          ctx.arc(p.px, p.py, idx === 0 ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
        });

        // Left HUD Floating Widget (Free Thread Rigging)
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(9, 14, 26, 0.85)";
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 25, 125, 60);
        ctx.fillRect(20, 25, 125, 60);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.fillText("FREE THREAD RIGGING", 28, 42);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Auto-Detect: 19 Joints", 28, 56);
        ctx.fillText("Yield: 60 FPS CCDIK", 28, 70);

        // Right HUD Floating Widget (ONNX Tensor Inference)
        ctx.strokeRect(width - 145, 25, 125, 60);
        ctx.fillRect(width - 145, 25, 125, 60);
        ctx.fillStyle = "#a855f7";
        ctx.fillText("CCDIK SOLVER", width - 137, 42);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Latency: 0.12ms", width - 137, 56);
        ctx.fillText("Worker: Zero-Copy", width - 137, 70);

      } else if (project.id === "splat-bvh-core") {
        // ── 3D GAUSSIAN SPLAT VORTEX & LBVH BOUNDING HIERARCHY ──
        const rot = time * 0.55;
        const particleCount = 110;

        // Draw 3D wireframe bounding box hierarchy
        const boxSize = 65;
        const boxVerts = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ].map(([x, y, z]) => {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = x * boxSize * cosR - z * boxSize * sinR;
          const rz = x * boxSize * sinR + z * boxSize * cosR;
          const ry = y * boxSize * 0.65;
          const fov = 260;
          const pScale = fov / (fov + rz);
          return { px: cx + rx * pScale, py: cy + ry * pScale };
        });

        const boxEdges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        ctx.strokeStyle = "rgba(236, 72, 153, 0.45)";
        ctx.lineWidth = 1;
        boxEdges.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(boxVerts[a].px, boxVerts[a].py);
          ctx.lineTo(boxVerts[b].px, boxVerts[b].py);
          ctx.stroke();
        });

        // Multi-Color Splat Nebula Swarm
        for (let i = 0; i < particleCount; i++) {
          const pAngle = i * 0.28 + time * 1.2;
          const radius = 28 + (i % 38) * 1.6 + Math.sin(time + i) * 8;
          const px3d = Math.cos(pAngle) * radius;
          const py3d = Math.sin(i * 1.4) * 26 + Math.sin(time * 2 + i) * 9;
          const pz3d = Math.sin(pAngle) * radius;

          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = px3d * cosR - pz3d * sinR;
          const rz = px3d * sinR + pz3d * cosR;
          const fov = 260;
          const pScale = fov / (fov + rz);

          const screenX = cx + rx * pScale;
          const screenY = cy + py3d * pScale;

          const colors = ["#06b6d4", "#ec4899", "#f59e0b", "#c084fc", "#38bdf8", "#fb7185"];
          const splatColor = colors[i % colors.length];

          ctx.fillStyle = splatColor;
          ctx.shadowColor = splatColor;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(1.2, (3.5 + (i % 3)) * pScale), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        // Left HUD Floating Widget
        ctx.fillStyle = "rgba(9, 14, 26, 0.85)";
        ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
        ctx.strokeRect(20, 25, 125, 60);
        ctx.fillRect(20, 25, 125, 60);
        ctx.fillStyle = "#ec4899";
        ctx.font = "bold 9px monospace";
        ctx.fillText("GPU RADIX LBVH", 28, 42);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Morton Codes: 64b", 28, 56);
        ctx.fillText("Traversal: 1.2M Rays", 28, 70);

        // Right HUD Floating Widget
        ctx.strokeRect(width - 145, 25, 125, 60);
        ctx.fillRect(width - 145, 25, 125, 60);
        ctx.fillStyle = "#06b6d4";
        ctx.fillText("3D GAUSSIAN SPLATS", width - 137, 42);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Tree Depth: 16", width - 137, 56);
        ctx.fillText("Memory: VRAM-Only", width - 137, 70);

      } else {
        // ── 3D CYBERNETIC COMPUTING MATRIX CORES ──
        const rot = time * 0.7;
        const count = 42;

        ctx.strokeStyle = "rgba(6, 182, 212, 0.65)";
        ctx.shadowColor = project.accent || "#06b6d4";
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.8;

        const shapeVerts = [
          [0, -50, 0], [45, 0, 0], [0, 0, 45], [-45, 0, 0], [0, 0, -45], [0, 50, 0]
        ].map(([x, y, z]) => {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = x * cosR - z * sinR;
          const rz = x * sinR + z * cosR;
          const fov = 220;
          const pScale = fov / (fov + rz);
          return { px: cx + rx * pScale, py: cy + y * pScale };
        });

        const shapeEdges = [
          [0,1],[0,2],[0,3],[0,4],
          [5,1],[5,2],[5,3],[5,4],
          [1,2],[2,3],[3,4],[4,1]
        ];

        shapeEdges.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(shapeVerts[a].px, shapeVerts[a].py);
          ctx.lineTo(shapeVerts[b].px, shapeVerts[b].py);
          ctx.stroke();
        });

        for (let i = 0; i < count; i++) {
          const ang = i * ((Math.PI * 2) / count) + rot * 1.6;
          const rad = 72 + Math.sin(time * 3 + i) * 10;
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad * 0.38;

          ctx.fillStyle = project.accent || "#06b6d4";
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(9, 14, 26, 0.85)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.strokeRect(20, 25, 125, 60);
        ctx.fillRect(20, 25, 125, 60);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px monospace";
        ctx.fillText(project.badge.toUpperCase(), 28, 42);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Lang: ${project.lang}`, 28, 56);
        ctx.fillText("Status: PRODUCTION", 28, 70);
      }

      // Scanline overlay
      ctx.fillStyle = "rgba(6, 182, 212, 0.035)";
      for (let sl = 0; sl < height; sl += 4) {
        ctx.fillRect(0, sl, width, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [project]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#070e1b] border-2 border-slate-700/80 shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex flex-col font-mono">
      
      {/* Pod Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#040813] border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold">{project.sysId}</span>
          <span className="text-slate-500">//</span>
          <span className="text-white font-bold tracking-tight">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 text-[10px] border border-cyan-500/40 font-bold">
            {project.badge}
          </span>
          <span className="text-[10px] text-emerald-400 uppercase font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Hologram Chamber Display */}
      <div 
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#02050c] cursor-pointer group"
        onClick={() => {
          onAudioBlip(750);
          onOpenDetails(project);
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Hologram Glass Bevel & Glare */}
        <div className="absolute inset-0 pointer-events-none border-y border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 via-transparent to-black/70" />
      </div>

      {/* Card Info & Actions Footer */}
      <div className="p-4 bg-[#060b17] border-t border-white/10 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 mb-1">
            {project.tagline}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
          <a
            href={project.zipUrl}
            download
            onClick={(e) => {
              e.stopPropagation();
              onAudioBlip(1000);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>DOWNLOAD .ZIP</span>
          </a>

          <button
            onClick={() => {
              onAudioBlip(800);
              onOpenDetails(project);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs transition-colors"
          >
            SPECS
          </button>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="View on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
