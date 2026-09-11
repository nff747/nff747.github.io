"use client";

import React, { useEffect, useRef } from "react";
import { Download, ExternalLink, Info } from "lucide-react";

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

    const width = 480;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Deep dark chamber background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#030712");
      bgGrad.addColorStop(0.5, "#060d1d");
      bgGrad.addColorStop(1, "#020408");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective floor grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
      ctx.lineWidth = 1;
      const horizon = height * 0.72;
      const vanishingX = width / 2;

      // Floor grid lines
      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingX + i * 15, horizon);
        ctx.lineTo(vanishingX + i * 55, height);
        ctx.stroke();
      }
      for (let y = horizon; y < height; y += (y - horizon) * 0.45 + 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw specialized 3D hologram based on project ID
      const cx = width * 0.5;
      const cy = height * 0.44;

      if (project.id === "auto-rig-web") {
        // ── 3D HOLOGRAPHIC HUMANOID SKELETON ──
        const rot = time * 0.7;
        const scale = 1.1;

        // Joints definition in 3D (x, y, z)
        const joints: [number, number, number][] = [
          [0, -65, 0],   // 0: Head
          [0, -45, 0],   // 1: Neck
          [0, -15, 0],   // 2: Spine / Chest
          [0, 15, 0],    // 3: Pelvis
          // Left arm
          [-22, -40, 0], // 4: L Shoulder
          [-35, -15, Math.sin(time) * 10], // 5: L Elbow
          [-48, 10, Math.sin(time) * 20],  // 6: L Hand
          // Right arm
          [22, -40, 0],  // 7: R Shoulder
          [35, -15, -Math.sin(time) * 10], // 8: R Elbow
          [48, 10, -Math.sin(time) * 20],  // 9: R Hand
          // Left leg
          [-14, 20, 0],  // 10: L Hip
          [-16, 50, Math.cos(time) * 10],  // 11: L Knee
          [-18, 80, Math.cos(time) * 15],  // 12: L Foot
          // Right leg
          [14, 20, 0],   // 13: R Hip
          [16, 50, -Math.cos(time) * 10], // 14: R Knee
          [18, 80, -Math.cos(time) * 15], // 15: R Foot
        ];

        // Bones connecting joints
        const bones = [
          [0, 1], [1, 2], [2, 3],
          [1, 4], [4, 5], [5, 6],
          [1, 7], [7, 8], [8, 9],
          [3, 10], [10, 11], [11, 12],
          [3, 13], [13, 14], [14, 15]
        ];

        // Project 3D points with rotation
        const projected = joints.map(([x, y, z]) => {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = x * cosR - z * sinR;
          const rz = x * sinR + z * cosR;
          const fov = 200;
          const pScale = fov / (fov + rz);
          return {
            px: cx + rx * scale * pScale,
            py: cy + y * scale * pScale,
            depth: rz
          };
        });

        // Draw Holo Rings around avatar
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + 85, 45, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Bones
        ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 10;
        bones.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(projected[a].px, projected[a].py);
          ctx.lineTo(projected[b].px, projected[b].py);
          ctx.stroke();
        });

        // Draw Joints
        projected.forEach((p, idx) => {
          ctx.fillStyle = idx === 0 || idx === 6 || idx === 9 ? "#a855f7" : "#38bdf8";
          ctx.beginPath();
          ctx.arc(p.px, p.py, idx === 0 ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Floating telemetry boxes in HUD
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
        ctx.lineWidth = 1;

        // Left HUD widget
        ctx.strokeRect(18, 20, 110, 52);
        ctx.fillRect(18, 20, 110, 52);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 8px monospace";
        ctx.fillText("IK SOLVER ACTIVE", 24, 34);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Threads: WebWorker", 24, 46);
        ctx.fillText("Latency: 0.12ms", 24, 58);

        // Right HUD widget
        ctx.strokeRect(width - 128, 20, 110, 52);
        ctx.fillRect(width - 128, 20, 110, 52);
        ctx.fillStyle = "#a855f7";
        ctx.fillText("SKINNING MATRIX", width - 122, 34);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Joints: 19 Verified", width - 122, 46);
        ctx.fillText("Yield: 60 FPS", width - 122, 58);

      } else if (project.id === "splat-bvh-core") {
        // ── 3D GAUSSIAN SPLATTING NEBULA & LBVH BOUNDING BOXES ──
        const rot = time * 0.5;
        const particleCount = 80;

        // Draw 3D wireframe bounding box
        const boxSize = 55;
        const boxVerts = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ].map(([x, y, z]) => {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = x * boxSize * cosR - z * boxSize * sinR;
          const rz = x * boxSize * sinR + z * boxSize * cosR;
          const ry = y * boxSize * 0.7;
          const fov = 220;
          const pScale = fov / (fov + rz);
          return {
            px: cx + rx * pScale,
            py: cy + ry * pScale
          };
        });

        const boxEdges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
        ctx.lineWidth = 1;
        boxEdges.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(boxVerts[a].px, boxVerts[a].py);
          ctx.lineTo(boxVerts[b].px, boxVerts[b].py);
          ctx.stroke();
        });

        // Draw Colorful Splats Swarm
        for (let i = 0; i < particleCount; i++) {
          const pAngle = i * 0.3 + time;
          const radius = 25 + (i % 30) * 1.5 + Math.sin(time + i) * 6;
          const px3d = Math.cos(pAngle) * radius;
          const py3d = Math.sin(i * 1.5) * 22 + Math.sin(time * 2 + i) * 8;
          const pz3d = Math.sin(pAngle) * radius;

          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = px3d * cosR - pz3d * sinR;
          const rz = px3d * sinR + pz3d * cosR;
          const fov = 220;
          const pScale = fov / (fov + rz);

          const screenX = cx + rx * pScale;
          const screenY = cy + py3d * pScale;

          // Splat color palette (cyan, pink, amber, purple)
          const colors = ["#06b6d4", "#ec4899", "#f59e0b", "#a855f7", "#38bdf8"];
          const splatColor = colors[i % colors.length];

          ctx.fillStyle = splatColor;
          ctx.shadowColor = splatColor;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(1, (3 + (i % 3)) * pScale), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        // HUD widget
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = "rgba(236, 72, 153, 0.35)";
        ctx.strokeRect(18, 20, 115, 52);
        ctx.fillRect(18, 20, 115, 52);
        ctx.fillStyle = "#ec4899";
        ctx.font = "bold 8px monospace";
        ctx.fillText("LBVH GPU RADIX", 24, 34);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Morton Codes: 64b", 24, 46);
        ctx.fillText("Ray Throughput: 1.2M", 24, 58);

      } else if (project.id === "helix-lsm") {
        // ── 3D DISTRIBUTED LSM TREE CRYSTAL STACK ──
        const rot = time * 0.8;
        const levels = 5;

        for (let l = 0; l < levels; l++) {
          const lY = cy - 40 + l * 20;
          const lRadius = 55 - l * 6;
          const cosR = Math.cos(rot + l * 0.4);

          ctx.strokeStyle = l === 0 ? "rgba(56, 189, 248, 0.8)" : "rgba(239, 68, 68, 0.7)";
          ctx.shadowColor = l === 0 ? "#38bdf8" : "#ef4444";
          ctx.shadowBlur = 6;
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.ellipse(cx, lY, lRadius, lRadius * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Nodes along ring
          for (let n = 0; n < 4; n++) {
            const angle = n * (Math.PI / 2) + rot + l * 0.5;
            const nx = cx + Math.cos(angle) * lRadius;
            const ny = lY + Math.sin(angle) * lRadius * 0.35;

            ctx.fillStyle = l === 0 ? "#38bdf8" : "#f87171";
            ctx.beginPath();
            ctx.arc(nx, ny, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
        ctx.strokeRect(18, 20, 115, 52);
        ctx.fillRect(18, 20, 115, 52);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 8px monospace";
        ctx.fillText("LSM CONCURRENT WAL", 24, 34);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Compaction: L0 -> L6", 24, 46);
        ctx.fillText("IOPS: 1.4M (Lock-Free)", 24, 58);

      } else {
        // ── 3D CYBERNETIC COMPUTING MATRIX FOR OTHER PROJECTS ──
        const rot = time * 0.6;
        const count = 36;

        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.shadowColor = project.accent || "#06b6d4";
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;

        // Rotating central 3D octahedron
        const shapeVerts = [
          [0, -45, 0], [40, 0, 0], [0, 0, 40], [-40, 0, 0], [0, 0, -40], [0, 45, 0]
        ].map(([x, y, z]) => {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);
          const rx = x * cosR - z * sinR;
          const rz = x * sinR + z * cosR;
          const fov = 200;
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

        // Orbiting data nodes
        for (let i = 0; i < count; i++) {
          const ang = i * ((Math.PI * 2) / count) + rot * 1.5;
          const rad = 65 + Math.sin(time * 3 + i) * 8;
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad * 0.4;

          ctx.fillStyle = project.accent || "#06b6d4";
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.strokeRect(18, 20, 120, 52);
        ctx.fillRect(18, 20, 120, 52);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 8px monospace";
        ctx.fillText(project.badge.toUpperCase(), 24, 34);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(project.lang, 24, 46);
        ctx.fillText("Status: PRODUCTION", 24, 58);
      }

      // Scanline effect
      ctx.fillStyle = "rgba(6, 182, 212, 0.04)";
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
    <div className="relative group rounded-xl overflow-hidden bg-[#070d18] border border-cyan-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:border-cyan-400/60 transition-all duration-300 flex flex-col">
      {/* Pod Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#03060f] border-b border-white/[0.08] font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold">{project.sysId}</span>
          <span className="text-slate-500">//</span>
          <span className="text-white font-bold tracking-tight">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-500/30 font-bold">
            {project.lang}
          </span>
          <span className="text-[10px] text-emerald-400 uppercase font-mono">ONLINE</span>
        </div>
      </div>

      {/* Hologram Chamber Display */}
      <div 
        className="relative aspect-[2/1] w-full overflow-hidden bg-[#02050b] cursor-pointer"
        onClick={() => {
          onAudioBlip(750);
          onOpenDetails(project);
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Hologram Glass Bevel & Glare */}
        <div className="absolute inset-0 pointer-events-none border-y border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 via-transparent to-black/60" />

        {/* Hover inspect banner */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-cyan-300 border border-cyan-500/40 font-mono flex items-center gap-1.5 pointer-events-none">
          <Info className="w-3 h-3" />
          <span>INSPECT POD</span>
        </div>
      </div>

      {/* Card Info & Actions Footer */}
      <div className="p-4 bg-[#050a14] flex-1 flex flex-col justify-between font-mono space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-1 group-hover:text-cyan-300 transition-colors">
            {project.tagline}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
          <a
            href={project.zipUrl}
            download
            onClick={(e) => {
              e.stopPropagation();
              onAudioBlip(1000);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>DOWNLOAD .ZIP</span>
          </a>

          <button
            onClick={() => {
              onAudioBlip(800);
              onOpenDetails(project);
            }}
            className="px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs transition-colors flex items-center gap-1"
          >
            <span>SPECS</span>
          </button>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
            title="View Source on GitHub"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
