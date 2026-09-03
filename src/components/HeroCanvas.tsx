'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, MessageSquare, RotateCw, Smile, Brain, Play } from 'lucide-react';

// Pre-warm the GLTF Draco model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

type AnimationState = 'idle' | 'greet' | 'talk' | 'think' | 'inspect';

interface AnimeRigProps {
  pointer: React.MutableRefObject<{ x: number; y: number; vx: number; vy: number }>;
  animState: AnimationState;
  setAnimState: (state: AnimationState) => void;
}

function CinematicAnimeCharacter({ pointer, animState, setAnimState }: AnimeRigProps) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Mesh bindings for facial feature animation and secondary hair physics
  const meshBindings = useRef<{
    eyelashes?: THREE.Object3D;
    eyeline?: THREE.Object3D;
    eyeIris?: THREE.Object3D;
    brows?: THREE.Object3D;
    mouth?: THREE.Object3D;
    hairStrands: THREE.Object3D[];
  }>({ hairStrands: [] });

  // Autonomous physiological blink state
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.0,
    isDoubleBlink: false,
  });

  // Micro-saccade restlessness state
  const saccadeState = useRef({
    x: 0,
    y: 0,
    nextTime: 1.0,
  });

  // State timer for auto-reverting temporary emotes
  const stateTimer = useRef(0);
  const turntableAngle = useRef(Math.PI);

  // Inertial hair secondary spring dynamics
  const hairLag = useRef(0);

  // Calibrate native materials on load & map meshes
  useEffect(() => {
    meshBindings.current.hairStrands = [];

    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (!mat.name) return;
          const name = mat.name.toLowerCase();

          // White braided & flowing hair
          if (name.includes('material.006') || name.includes('material.002') || name.includes('material.001')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.92, 0.93, 0.95);
            mat.roughness = 0.44;
            mat.metalness = 0.04;
          } 
          // Signature teal hair streak
          else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.18, 0.90, 0.82);
            mat.roughness = 0.38;
          } 
          // 2D facial contours (clean alpha)
          else if (name.includes('faceeyelash') || name.includes('faceeyeline') || name.includes('facebrow')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.02;
          } 
          else if (name.includes('facemouth')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.02;
          } 
          // Native skin
          else if (name.includes('face_00_skin') || name.includes('body_00_skin')) {
            mat.roughness = 0.55;
            mat.metalness = 0.0;
          } 
          // Leather collar
          else if (name.includes('leather')) {
            mat.color.setRGB(0.42, 0.18, 0.14);
            mat.roughness = 0.36;
          } 
          // Gold buckle
          else if (name.includes('metal')) {
            mat.color.setRGB(0.95, 0.84, 0.50);
            mat.metalness = 0.88;
            mat.roughness = 0.22;
          } 
          // White silk shirt
          else if (name.includes('silk') || name.includes('material')) {
            mat.color.setRGB(0.94, 0.94, 0.96);
            mat.roughness = 0.50;
          } 
          // Glowing cyan anime eyes
          else if (name.includes('eyeiris')) {
            mat.emissive = new THREE.Color('#00F0FF');
            mat.emissiveIntensity = 0.90;
            mat.roughness = 0.06;
          }
        });

        // Cache mesh references
        const objName = child.name;
        if (objName.includes('FaceEyelash')) meshBindings.current.eyelashes = child;
        else if (objName.includes('FaceEyeline')) meshBindings.current.eyeline = child;
        else if (objName.includes('EyeIris')) meshBindings.current.eyeIris = child;
        else if (objName.includes('FaceBrow')) meshBindings.current.brows = child;
        else if (objName.includes('FaceMouth')) meshBindings.current.mouth = child;
        else if (objName.includes('Nurbs') || objName.includes('Cylinder.011')) {
          meshBindings.current.hairStrands.push(child);
        }
      }
    });
  }, [scene]);

  // ═════════════════════════════════════════════════════════════════
  // CINEMATIC LIVING KINEMATICS & BEHAVIORAL STATE MACHINE
  // ═════════════════════════════════════════════════════════════════
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // -1 to 1
    const mouseY = pointer.current.y; // -1 to 1
    const mouseVx = pointer.current.vx; // velocity

    // 1. Asymmetric Diaphragm Breathing
    const breath = (Math.sin(time * 1.8) + 0.35 * Math.sin(time * 3.6)) * 0.0035;

    // 2. Behavioral State Kinematic Offsets
    let targetYaw = Math.PI - mouseX * 0.22;
    let targetPitch = mouseY * 0.14;
    let targetRoll = -mouseX * 0.03;
    let targetGazeX = -mouseX * 0.0022;
    let targetGazeY = mouseY * 0.0016;
    let targetBrowY = Math.max(0, mouseY) * 0.0015;
    let targetMouthY = 1.0;
    let eyeSquintFactor = 1.0;

    // Handle Active Animation State
    if (animState === 'inspect') {
      // Smooth continuous 360° turntable presentation
      turntableAngle.current += delta * 0.75;
      targetYaw = turntableAngle.current;
      targetPitch = 0.02 + Math.sin(time * 1.5) * 0.015;
      targetRoll = 0;
      targetGazeX = 0;
      targetGazeY = 0;
    } 
    else if (animState === 'greet') {
      // Cheerful inquisitive head tilt, playful nod & warm squint
      stateTimer.current += delta;
      const greetProgress = Math.min(1.0, stateTimer.current / 2.8);
      const nod = Math.sin(greetProgress * Math.PI * 2.5) * 0.06;
      const tilt = Math.sin(greetProgress * Math.PI * 1.5) * 0.08;

      targetPitch += nod;
      targetRoll += tilt;
      targetYaw += tilt * 0.5;
      eyeSquintFactor = 0.65; // Happy anime eye squint
      targetBrowY += 0.003;

      if (stateTimer.current > 3.0) {
        stateTimer.current = 0;
        setAnimState('idle');
      }
    } 
    else if (animState === 'talk') {
      // Speech cadence: rhythmic nodding, lip movement, brow emphasis
      stateTimer.current += delta;
      const speechCadence = Math.sin(time * 6.5) * 0.025 + Math.cos(time * 3.2) * 0.015;
      targetPitch += speechCadence;
      targetBrowY += Math.sin(time * 4.0) * 0.002;
      // Speech lip parting
      const viseme = Math.abs(Math.sin(time * 7.0)) * 0.18 + Math.abs(Math.cos(time * 4.5)) * 0.12;
      targetMouthY = 1.0 + viseme;

      if (stateTimer.current > 4.5) {
        stateTimer.current = 0;
        setAnimState('idle');
      }
    } 
    else if (animState === 'think') {
      // Contemplative upward gaze tilt
      stateTimer.current += delta;
      targetPitch += 0.08;
      targetRoll -= 0.05;
      targetYaw += 0.07;
      targetGazeX -= 0.0025;
      targetGazeY += 0.0035;
      targetBrowY += 0.004;

      if (stateTimer.current > 3.8) {
        stateTimer.current = 0;
        setAnimState('idle');
      }
    } 
    else {
      // Default Living Idle: Natural curiosity & subtle idle head wander
      const idleSway = Math.sin(time * 0.8) * 0.012;
      targetYaw += idleSway;
      targetPitch += Math.cos(time * 1.1) * 0.008;
      targetRoll += Math.sin(time * 0.6) * 0.006;
    }

    // 3. Smooth Damped Multi-Joint Kinematics on Root Group
    if (groupRef.current) {
      groupRef.current.position.y = -1.35 + breath;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 4.5 * delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 4.0 * delta);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 3.5 * delta);
    }

    // 4. Secondary Mass-Spring Physics on Hair Strands
    // Hair responds with harmonic inertial lag to head angular velocity
    hairLag.current = THREE.MathUtils.lerp(
      hairLag.current,
      -mouseVx * 0.12 + Math.sin(time * 2.4) * 0.015,
      6.0 * delta
    );
    meshBindings.current.hairStrands.forEach((strand, idx) => {
      // Offset phase for organic cascade
      const strandPhase = idx * 0.08;
      strand.rotation.z = hairLag.current * (1.0 + Math.sin(time * 3.0 + strandPhase) * 0.2);
    });

    // 5. Physiological Curvilinear Eyelid Blinking
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.28;
    }

    let blinkScaleY = 1.0;
    if (blink.progress >= 0) {
      blink.progress += 14.0 * delta;
      if (blink.progress <= 0.45) {
        // Accelerating closing phase (t^2)
        const t = blink.progress / 0.45;
        blinkScaleY = 1.0 - t * t * 0.96;
      } else if (blink.progress <= 0.55) {
        // Hold frame closed
        blinkScaleY = 0.04;
      } else if (blink.progress <= 1.0) {
        // Cubic ease-out opening phase
        const t = (blink.progress - 0.55) / 0.45;
        blinkScaleY = 0.04 + (1.0 - Math.pow(1.0 - t, 3)) * 0.96;
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          blink.nextBlinkTime = time + 2.4 + Math.random() * 3.5;
        }
      }
    }

    // Combine blink with emotion squint
    const finalEyelidScaleY = Math.min(blinkScaleY, eyeSquintFactor);
    if (meshBindings.current.eyelashes) meshBindings.current.eyelashes.scale.y = finalEyelidScaleY;
    if (meshBindings.current.eyeline) meshBindings.current.eyeline.scale.y = finalEyelidScaleY;

    // 6. Optical Saccadic Look-At IK
    const saccade = saccadeState.current;
    if (time > saccade.nextTime) {
      saccade.x = (Math.random() - 0.5) * 0.0006;
      saccade.y = (Math.random() - 0.5) * 0.0004;
      saccade.nextTime = time + 0.9 + Math.random() * 1.5;
    }

    if (meshBindings.current.eyeIris) {
      meshBindings.current.eyeIris.position.x = THREE.MathUtils.lerp(
        meshBindings.current.eyeIris.position.x,
        targetGazeX + saccade.x,
        8.0 * delta
      );
      meshBindings.current.eyeIris.position.y = THREE.MathUtils.lerp(
        meshBindings.current.eyeIris.position.y,
        targetGazeY + saccade.y,
        8.0 * delta
      );
    }

    // 7. Eyebrow Flexor Movements
    if (meshBindings.current.brows) {
      meshBindings.current.brows.position.y = THREE.MathUtils.lerp(
        meshBindings.current.brows.position.y,
        targetBrowY,
        6.0 * delta
      );
    }

    // 8. Delicate Mouth Parting
    if (meshBindings.current.mouth) {
      meshBindings.current.mouth.scale.y = THREE.MathUtils.lerp(
        meshBindings.current.mouth.scale.y,
        targetMouthY,
        10.0 * delta
      );
    }
  });

  // Clicking the character triggers cheerful greeting reaction
  const handleCharacterClick = () => {
    stateTimer.current = 0;
    setAnimState('greet');
  };

  return (
    <group 
      ref={groupRef} 
      position={[0, -1.35, 0]} 
      rotation={[0, Math.PI, 0]}
      onClick={handleCharacterClick}
    >
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING CINEMATIC EMOTE ENGINE...</span>
      </div>
    </Html>
  );
}

export function HeroCanvas() {
  const pointer = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  const [animState, setAnimState] = useState<AnimationState>('idle');

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
        background: 'radial-gradient(circle at 50% 36%, #2e3440 0%, #1c2028 48%, #0a0c10 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        // Exact locked portrait bust framing from screenshot
        camera={{ position: [0, 0.05, 0.72], fov: 38 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* Studio Lighting */}
        <ambientLight intensity={0.65} color="#282c38" />
        
        {/* Key Light */}
        <directionalLight 
          position={[0.35, 1.85, 1.25]} 
          intensity={2.3} 
          color="#ffeedd" 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <directionalLight position={[-1.2, 1.3, 0.9]} intensity={0.8} color="#8cb4e8" />
        
        {/* Bounce Light */}
        <directionalLight position={[0, 0.6, 0.8]} intensity={0.4} color="#d0a888" />
        
        {/* Hair Crest Rim Lights */}
        <directionalLight position={[0, 2.3, -1.2]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[0, 2.6, 0.2]} intensity={2.2} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <CinematicAnimeCharacter 
            pointer={pointer} 
            animState={animState} 
            setAnimState={setAnimState} 
          />
        </Suspense>
      </Canvas>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE CYBER HUD EMOTE CONTROLLER
          Allows the user to trigger top-notch cinematic animations
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-28 right-6 z-20 hidden md:flex flex-col gap-2 pointer-events-auto">
        <div className="glass-panel p-2.5 rounded-xl border border-white/[0.08] shadow-glass-card flex flex-col gap-1.5 backdrop-blur-xl">
          <div className="text-[10px] font-mono tracking-widest text-slate-400 px-2 py-1 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span>RIG ACTIONS</span>
          </div>

          <button
            onClick={() => setAnimState('idle')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all text-left ${
              animState === 'idle'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-glow'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>01 // LIVING IDLE</span>
          </button>

          <button
            onClick={() => setAnimState('greet')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all text-left ${
              animState === 'greet'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-glow'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>02 // GREET & TILT</span>
          </button>

          <button
            onClick={() => setAnimState('talk')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all text-left ${
              animState === 'talk'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-glow'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>03 // SPEECH CADENCE</span>
          </button>

          <button
            onClick={() => setAnimState('think')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all text-left ${
              animState === 'think'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-glow'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>04 // CONTEMPLATE</span>
          </button>

          <button
            onClick={() => setAnimState(animState === 'inspect' ? 'idle' : 'inspect')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all text-left ${
              animState === 'inspect'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-glow'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>05 // 360° INSPECT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
