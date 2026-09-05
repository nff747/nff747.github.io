'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Pre-warm the character model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

export type NPCEmote = 'IDLE' | 'CURIOUS' | 'SMUG_SMILE' | 'PENSIVE' | 'SURPRISED' | 'AGREE_NOD';

interface CharacterProps {
  pointer: React.MutableRefObject<{ x: number; y: number; vx: number; vy: number }>;
  activeChapter?: number;
  manualEmote?: NPCEmote | null;
  onEmoteChange?: (emote: NPCEmote) => void;
}

function LivingCharacter({ pointer, activeChapter = 0, manualEmote, onEmoteChange }: CharacterProps) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Mesh bindings for facial features and secondary hair physics
  const meshBindings = useRef<{
    eyelashes?: THREE.Object3D;
    eyeline?: THREE.Object3D;
    eyeIris?: THREE.Object3D;
    eyeHighlight?: THREE.Object3D;
    brows?: THREE.Object3D;
    mouth?: THREE.Object3D;
    hairStrands: THREE.Object3D[];
  }>({ hairStrands: [] });

  // Autonomous physiological blink engine
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.2,
    isDoubleBlink: false,
  });

  // Inertial hair secondary spring dynamics
  const hairLag = useRef(0);

  // Autonomous NPC Personality & Emote State Machine
  const npcEngine = useRef({
    currentEmote: 'IDLE' as NPCEmote,
    lastEmote: 'IDLE' as NPCEmote,
    emoteStartTime: 0,
    emoteDuration: 0,
    nextEmoteTime: 4.5,
    // Smoothly interpolated head posture biases
    yawBias: 0,
    pitchBias: 0,
    rollBias: 0,
    targetYawBias: 0,
    targetPitchBias: 0,
    targetRollBias: 0,
  });

  // Calibrate native materials to match Img 3 studio render
  useEffect(() => {
    meshBindings.current.hairStrands = [];

    scene.traverse((child: any) => {
      if (child.isMesh) {
        // Prevent hair bangs from casting dark shadow maps onto eyes
        const isEye = child.name.toLowerCase().includes('eye');
        child.castShadow = !isEye;
        child.receiveShadow = !isEye;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (!mat.name) return;
          const name = mat.name.toLowerCase();

          // 1. Soft Satin White Hair
          if (name.includes('material.006') || name.includes('material.002') || name.includes('material.001')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.88, 0.89, 0.92);
            mat.roughness = 0.48;
            mat.metalness = 0.02;
          } 
          // 2. Signature Teal Bang Streak
          else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.18, 0.88, 0.80);
            mat.roughness = 0.40;
          } 
          // 3. Electric Cyan Eyes with Dark Pupil (Img 3 Match)
          // Uses GLTF emissiveTexture with alpha cutoff to eliminate white fringe edge
          else if (name.includes('eyeiris')) {
            mat.roughness = 0.06;
            mat.metalness = 0.0;
            mat.emissive = new THREE.Color(0x00e5ff);
            mat.emissiveIntensity = 0.60;
            mat.alphaTest = 0.155;
            mat.transparent = true;
            if (mat.map) {
              mat.map.generateMipmaps = true;
              mat.map.minFilter = THREE.LinearMipmapLinearFilter;
              mat.map.anisotropy = 16;
              mat.map.needsUpdate = true;
            }
            if (mat.emissiveMap) {
              mat.emissiveMap.generateMipmaps = true;
              mat.emissiveMap.minFilter = THREE.LinearMipmapLinearFilter;
              mat.emissiveMap.anisotropy = 16;
              mat.emissiveMap.needsUpdate = true;
            }
          }
          // 4. Crisp White Eye Highlights (Sharp specular reflection like Img 3)
          else if (name.includes('eyehighlight')) {
            mat.color.setRGB(1.0, 1.0, 1.0);
            mat.emissive = new THREE.Color('#ffffff');
            mat.emissiveIntensity = 1.0;
            mat.roughness = 0.0;
            mat.metalness = 0.0;
            mat.depthWrite = false;
            mat.transparent = true;
          }
          // 5. Clean Sclera Eye White
          else if (name.includes('eyewhite')) {
            mat.roughness = 0.30;
            mat.color.setRGB(0.96, 0.96, 0.98);
          }
          // 6. 2D Facial Contours (Lashes, Eyeline, Brows)
          else if (name.includes('faceeyelash') || name.includes('faceeyeline') || name.includes('facebrow')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.02;
          } 
          // 7. Modesty Undershirt (Zero chest visibility even when zoomed out)
          else if (name.includes('body_00_skin')) {
            mat.color.setRGB(0.06, 0.06, 0.08);
            mat.roughness = 0.85;
            mat.metalness = 0.0;
          }
          // 8. Soft Natural Anime Face Skin & Cheek Blush (Img 3 Match)
          else if (name.includes('face_00_skin')) {
            mat.roughness = 0.58;
            mat.color.setRGB(1.0, 0.95, 0.95);
            mat.metalness = 0.0;
          } 
          // 9. Soft Interior Mouth Shading (Locked firmly inside the oral cavity)
          else if (name.includes('facemouth')) {
            mat.roughness = 0.65;
            mat.color.setRGB(0.50, 0.20, 0.22);
            mat.metalness = 0.0;
          }
          // 10. Rich Leather Collar
          else if (name.includes('leather')) {
            mat.color.setRGB(0.38, 0.16, 0.12);
            mat.roughness = 0.40;
          } 
          // 11. Polished Gold Buckle
          else if (name.includes('metal') || name.includes('material.008')) {
            mat.color.setRGB(0.95, 0.82, 0.45);
            mat.metalness = 0.85;
            mat.roughness = 0.25;
          } 
          // 12. White Silk Shirt & Bandages
          else if (name.includes('silk') || name.includes('ducktape') || name.includes('material')) {
            mat.color.setRGB(0.90, 0.92, 0.94);
            mat.roughness = 0.48;
          }
        });

        // Cache mesh references and lock anatomical transforms safely
        const objName = child.name;
        if (objName.includes('FaceEyelash')) {
          meshBindings.current.eyelashes = child;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('FaceEyeline')) {
          meshBindings.current.eyeline = child;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('EyeIris')) {
          meshBindings.current.eyeIris = child;
          child.renderOrder = 5;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('EyeHighlight')) {
          meshBindings.current.eyeHighlight = child;
          child.renderOrder = 10;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('EyeWhite')) {
          child.renderOrder = 1;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('FaceBrow')) {
          meshBindings.current.brows = child;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('FaceMouth')) {
          // Strictly locked at origin inside the lips: never translated or scaled to prevent forehead glitch!
          meshBindings.current.mouth = child;
          child.position.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        } else if (objName.includes('Nurbs') || objName.includes('Cylinder.011')) {
          meshBindings.current.hairStrands.push(child);
        }
      }
    });
  }, [scene]);

  // ═════════════════════════════════════════════════════════════════
  // LIVING BIOMECHANICAL ANIMATION LOOP: HEAD IK, BREATH & NPC EMOTES
  // ═════════════════════════════════════════════════════════════════
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // Normalized: -1 to 1
    const mouseY = pointer.current.y; // Normalized: -1 to 1
    const mouseVx = pointer.current.vx; // Mouse velocity

    const npc = npcEngine.current;

    // ─────────────────────────────────────────────────────────────
    // 1. AUTONOMOUS NPC EMOTE STATE MACHINE (HEAD GESTURES & ATTENTION)
    // ─────────────────────────────────────────────────────────────
    const setEmoteTargets = (emote: NPCEmote) => {
      npc.currentEmote = emote;
      npc.emoteStartTime = time;
      onEmoteChange?.(emote);

      switch (emote) {
        case 'CURIOUS':
          npc.emoteDuration = 3.6;
          npc.targetRollBias = 0.065; // Cute curious head tilt
          npc.targetPitchBias = 0.025; // Cocks forward toward cursor
          npc.targetYawBias = 0.0;
          break;

        case 'SMUG_SMILE':
          npc.emoteDuration = 4.0;
          npc.targetRollBias = -0.045; // Confident slight tilt
          npc.targetPitchBias = -0.02;
          npc.targetYawBias = 0.0;
          // Trigger flutter double-blink
          blinkState.current.progress = 0;
          blinkState.current.isDoubleBlink = true;
          break;

        case 'PENSIVE':
          npc.emoteDuration = 4.2;
          npc.targetRollBias = 0.02;
          npc.targetPitchBias = 0.09; // Looks up into distance pensively
          npc.targetYawBias = -0.18; // Glances away from cursor
          break;

        case 'SURPRISED':
          npc.emoteDuration = 2.4;
          npc.targetRollBias = 0.0;
          npc.targetPitchBias = -0.045; // Recoils back in wonder
          npc.targetYawBias = 0.0;
          break;

        case 'AGREE_NOD':
          npc.emoteDuration = 2.8;
          npc.targetRollBias = 0.0;
          npc.targetPitchBias = 0.0;
          npc.targetYawBias = 0.0;
          break;

        case 'IDLE':
        default:
          npc.emoteDuration = 0;
          npc.targetRollBias = 0;
          npc.targetPitchBias = 0;
          npc.targetYawBias = 0;
          break;
      }
    };

    // Manual override from UI
    if (manualEmote && manualEmote !== npc.lastEmote) {
      npc.lastEmote = manualEmote;
      setEmoteTargets(manualEmote);
    } 
    // Otherwise autonomously cycle like an in-game NPC
    else if (!manualEmote && time > npc.nextEmoteTime && npc.currentEmote === 'IDLE') {
      const npcPool: NPCEmote[] = ['CURIOUS', 'SMUG_SMILE', 'PENSIVE', 'SURPRISED', 'AGREE_NOD'];
      const nextChoice = npcPool[Math.floor(Math.random() * npcPool.length)];
      setEmoteTargets(nextChoice);
    }

    // Auto return to IDLE after active emote duration finishes
    if (npc.currentEmote !== 'IDLE' && !manualEmote && time > npc.emoteStartTime + npc.emoteDuration) {
      npc.currentEmote = 'IDLE';
      npc.nextEmoteTime = time + 4.0 + Math.random() * 4.5;
      setEmoteTargets('IDLE');
    }

    // Interpolate emote biases smoothly
    npc.yawBias = THREE.MathUtils.lerp(npc.yawBias, npc.currentEmote === 'IDLE' ? 0 : npc.targetYawBias, 4.0 * delta);
    npc.pitchBias = THREE.MathUtils.lerp(npc.pitchBias, npc.currentEmote === 'IDLE' ? 0 : npc.targetPitchBias, 4.0 * delta);
    npc.rollBias = THREE.MathUtils.lerp(npc.rollBias, npc.currentEmote === 'IDLE' ? 0 : npc.targetRollBias, 4.0 * delta);

    // Nodding wave for AGREE_NOD
    let nodOffset = 0;
    if (npc.currentEmote === 'AGREE_NOD') {
      const nodTime = time - npc.emoteStartTime;
      if (nodTime < 2.2) {
        nodOffset = Math.sin(nodTime * 6.5) * 0.042;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. WHOLE-BODY DIAPHRAGM BREATHING & HEAD ORIENTATION IK
    // ─────────────────────────────────────────────────────────────
    const breathCycle = time * 1.9;
    const breathOffset = (Math.sin(breathCycle) + 0.3 * Math.sin(breathCycle * 2)) * 0.005;
    const breathNod = Math.sin(breathCycle) * 0.012;

    // Head orientation combines cursor tracking, active deck parallax, and NPC emote posture
    const chapterYawBias = activeChapter === 1 ? 0.08 : activeChapter === 2 ? -0.08 : 0.0;
    const targetYaw = Math.PI - mouseX * 0.22 + chapterYawBias + npc.yawBias;
    const targetPitch = mouseY * 0.14 + breathNod + npc.pitchBias + nodOffset;
    const targetRoll = -mouseX * 0.03 + npc.rollBias;

    if (groupRef.current) {
      groupRef.current.position.y = -1.35 + breathOffset;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 4.5 * delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 4.0 * delta);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 3.5 * delta);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. CLEAN ANATOMICAL EYELID BLINKING
    // ─────────────────────────────────────────────────────────────
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.28;
    }

    let blinkScaleY = 1.0;
    let isFullyClosed = false;
    if (blink.progress >= 0) {
      blink.progress += 13.0 * delta;
      if (blink.progress <= 0.42) {
        const t = blink.progress / 0.42;
        blinkScaleY = 1.0 - t * t * 0.92;
      } else if (blink.progress <= 0.52) {
        blinkScaleY = 0.08;
        isFullyClosed = true;
      } else if (blink.progress <= 1.0) {
        const t = (blink.progress - 0.52) / 0.48;
        blinkScaleY = 0.08 + (1.0 - Math.pow(1.0 - t, 2)) * 0.92;
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          blink.nextBlinkTime = time + 2.5 + Math.random() * 3.5;
          blinkScaleY = 1.0;
        }
      }
    }

    // Modulate eyelashes safely without displacing off the skull
    if (meshBindings.current.eyelashes) {
      meshBindings.current.eyelashes.scale.y = blinkScaleY;
    }
    if (meshBindings.current.eyeline) {
      meshBindings.current.eyeline.scale.y = blinkScaleY;
    }
    // Conceal corneal highlight when eyelids shut so it doesn't poke through closed lids
    if (meshBindings.current.eyeHighlight) {
      meshBindings.current.eyeHighlight.visible = !isFullyClosed;
    }

    // ─────────────────────────────────────────────────────────────
    // 4. SECONDARY INERTIAL HAIR STRAND SPRING PHYSICS
    // ─────────────────────────────────────────────────────────────
    hairLag.current = THREE.MathUtils.lerp(
      hairLag.current,
      -mouseVx * 0.14 + Math.sin(time * 2.4) * 0.016,
      6.0 * delta
    );
    meshBindings.current.hairStrands.forEach((strand, idx) => {
      const strandPhase = idx * 0.08;
      strand.rotation.z = hairLag.current * (1.0 + Math.sin(time * 3.0 + strandPhase) * 0.2);
    });
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 0]} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// ═════════════════════════════════════════════════════════════════
// 3D CAMERA CONTROLLER: ANIMATED SCROLL & CHAPTER SPATIAL GLIDE
// ═════════════════════════════════════════════════════════════════
function CameraController({ activeChapter = 0 }: { activeChapter?: number }) {
  useFrame((state, delta) => {
    let targetX = 0.0;
    let targetY = 0.12;
    let targetZ = 0.52;
    let lookAtX = 0.0;
    let lookAtY = 0.10;

    if (activeChapter === 1) {
      targetX = -0.07;
      targetY = 0.11;
      targetZ = 0.50;
      lookAtX = 0.02;
      lookAtY = 0.10;
    } else if (activeChapter === 2) {
      targetX = 0.06;
      targetY = 0.12;
      targetZ = 0.49;
      lookAtX = -0.02;
      lookAtY = 0.10;
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 3.5 * delta);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 3.5 * delta);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 3.5 * delta);
    state.camera.lookAt(lookAtX, lookAtY, 0);
  });

  return null;
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>CALIBRATING BIOMECHANICAL RIG...</span>
      </div>
    </Html>
  );
}

interface HeroCanvasProps {
  activeChapter?: number;
  manualEmote?: NPCEmote | null;
  onEmoteChange?: (emote: NPCEmote) => void;
}

export function HeroCanvas({ activeChapter = 0, manualEmote = null, onEmoteChange }: HeroCanvasProps) {
  const pointer = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const curX = (e.clientX / window.innerWidth) * 2 - 1;
    const curY = -(e.clientY / window.innerHeight) * 2 + 1;

    pointer.current.vx = curX - lastMouse.current.x;
    pointer.current.vy = curY - lastMouse.current.y;
    pointer.current.x = curX;
    pointer.current.y = curY;

    lastMouse.current.x = curX;
    lastMouse.current.y = curY;
  };

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
      style={{
        // Exact dark studio vignette matching Img 3
        background: 'radial-gradient(circle at 50% 40%, #252830 0%, #15171d 55%, #08090c 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        // Exact portrait bust framing matching Img 3
        camera={{ position: [0, 0.12, 0.52], fov: 32 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.98,
        }}
      >
        <CameraController activeChapter={activeChapter} />

        {/* Ambient Studio Radiance */}
        <ambientLight intensity={0.45} color="#282c38" />
        
        {/* 1. Key Studio Light (Front-Right Warm Sun, matching Img 3) */}
        <directionalLight 
          position={[0.35, 1.85, 1.25]} 
          intensity={1.7} 
          color="#ffeedd" 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* 2. Fill Light (Front-Left Cool Soft Tone, matching Img 3) */}
        <directionalLight 
          position={[-1.2, 1.3, 0.9]} 
          intensity={0.45} 
          color="#8cb4e8" 
        />
        
        {/* 3. Hair Rim Light (Top-Back Pure White for hair edge sheen, matching Img 3) */}
        <directionalLight 
          position={[0.0, 2.3, -1.2]} 
          intensity={1.8} 
          color="#ffffff" 
        />

        {/* 4. Top Hair Rim Light */}
        <directionalLight 
          position={[0.0, 2.6, 0.2]} 
          intensity={1.5} 
          color="#ffffff" 
        />
        
        {/* 5. Under-Chin Warm Bounce Light (matching Img 3 soft peach chin shadow) */}
        <directionalLight 
          position={[0.0, 0.6, 0.8]} 
          intensity={0.30} 
          color="#ffd0b0" 
        />

        <Suspense fallback={<Loader />}>
          <LivingCharacter 
            pointer={pointer} 
            activeChapter={activeChapter}
            manualEmote={manualEmote}
            onEmoteChange={onEmoteChange}
          />
        </Suspense>
      </Canvas>

      {/* Gentle bottom fade into void to strictly prevent any lower chest exposure */}
      <div className="absolute inset-x-0 bottom-0 h-48 md:h-60 bg-gradient-to-t from-void via-void/90 to-transparent pointer-events-none z-10" />
    </div>
  );
}
