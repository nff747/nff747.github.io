'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Pre-warm the character model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

interface CharacterProps {
  pointer: React.MutableRefObject<{ x: number; y: number; vx: number; vy: number }>;
}

function InteractiveCharacter({ pointer }: CharacterProps) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Mesh bindings for facial feature animation and secondary hair physics
  const meshBindings = useRef<{
    eyelashes?: THREE.Object3D;
    eyeline?: THREE.Object3D;
    eyeIris?: THREE.Object3D;
    brows?: THREE.Object3D;
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

  // Inertial hair secondary spring dynamics
  const hairLag = useRef(0);

  // Calibrate native materials on load & cache mesh references
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

          // White hair strands
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
          // 2D facial contours
          else if (name.includes('faceeyelash') || name.includes('faceeyeline') || name.includes('facebrow')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.02;
          } 
          // Native face skin
          else if (name.includes('face_00_skin')) {
            mat.roughness = 0.55;
            mat.metalness = 0.0;
          } 
          // Body skin: Black modesty undershirt (zero chest skin visible)
          else if (name.includes('body_00_skin')) {
            mat.map = null;
            mat.color.setRGB(0.03, 0.04, 0.06);
            mat.roughness = 0.95;
            mat.metalness = 0.0;
            mat.needsUpdate = true;
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
        else if (objName.includes('Nurbs') || objName.includes('Cylinder.011')) {
          meshBindings.current.hairStrands.push(child);
        }
      }
    });
  }, [scene]);

  // ═════════════════════════════════════════════════════════════════
  // PROCEDURAL IK & BIOMECHANICAL KINEMATICS LOOP
  // ═════════════════════════════════════════════════════════════════
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // -1 to 1
    const mouseY = pointer.current.y; // -1 to 1
    const mouseVx = pointer.current.vx; // velocity

    // 1. Gentle Diaphragm Respiration (locked strictly to upper bust)
    const breath = Math.sin(time * 1.8) * 0.002;

    // 2. Multi-Joint Inverse Kinematics (IK) Head & Eye Orientation
    // Base forward orientation facing camera is Math.PI (180°)
    const targetYaw = Math.PI - mouseX * 0.20;
    // Clamped strictly to prevent any lower body exposure
    const targetPitch = THREE.MathUtils.clamp(mouseY * 0.10, -0.08, 0.10);
    const targetRoll = -mouseX * 0.025;

    // 3. Smooth Damped Multi-Joint Kinematics on Root Group
    if (groupRef.current) {
      groupRef.current.position.y = -1.35 + breath;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 4.2 * delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 4.0 * delta);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 3.5 * delta);
    }

    // 4. Secondary Mass-Spring Physics on Hair Strands
    hairLag.current = THREE.MathUtils.lerp(
      hairLag.current,
      -mouseVx * 0.12 + Math.sin(time * 2.4) * 0.014,
      6.0 * delta
    );
    meshBindings.current.hairStrands.forEach((strand, idx) => {
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
        const t = blink.progress / 0.45;
        blinkScaleY = 1.0 - t * t * 0.96;
      } else if (blink.progress <= 0.55) {
        blinkScaleY = 0.04;
      } else if (blink.progress <= 1.0) {
        const t = (blink.progress - 0.55) / 0.45;
        blinkScaleY = 0.04 + (1.0 - Math.pow(1.0 - t, 3)) * 0.96;
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          blink.nextBlinkTime = time + 2.5 + Math.random() * 3.5;
        }
      }
    }

    if (meshBindings.current.eyelashes) meshBindings.current.eyelashes.scale.y = blinkScaleY;
    if (meshBindings.current.eyeline) meshBindings.current.eyeline.scale.y = blinkScaleY;

    // 6. Optical Saccadic Look-At IK (Eyes track cursor with micro-saccades)
    const saccade = saccadeState.current;
    if (time > saccade.nextTime) {
      saccade.x = (Math.random() - 0.5) * 0.0006;
      saccade.y = (Math.random() - 0.5) * 0.0004;
      saccade.nextTime = time + 0.9 + Math.random() * 1.5;
    }

    const targetGazeX = -mouseX * 0.0022;
    const targetGazeY = mouseY * 0.0016;

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

    // 7. Eyebrow Emotional Flexors
    const targetBrowY = Math.max(0, mouseY) * 0.0015;
    if (meshBindings.current.brows) {
      meshBindings.current.brows.position.y = THREE.MathUtils.lerp(
        meshBindings.current.brows.position.y,
        targetBrowY,
        6.0 * delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 0]} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING GPU HERO RUNTIME...</span>
      </div>
    </Html>
  );
}

export function HeroCanvas() {
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
        background: 'radial-gradient(circle at 50% 36%, #2e3440 0%, #1c2028 48%, #0a0c10 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0.12, 0.58], fov: 36 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* Studio 4-Point Lighting */}
        <ambientLight intensity={0.65} color="#282c38" />
        
        {/* Key Studio Light */}
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
        
        {/* Under-Chin Warm Bounce Light */}
        <directionalLight position={[0, 0.6, 0.8]} intensity={0.4} color="#d0a888" />
        
        {/* Hair Crest Rim Lights */}
        <directionalLight position={[0, 2.3, -1.2]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[0, 2.6, 0.2]} intensity={2.2} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <InteractiveCharacter pointer={pointer} />
        </Suspense>
      </Canvas>

      {/* Gentle bottom vignette to cleanly anchor the portrait bust */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-void via-void/70 to-transparent pointer-events-none z-10" />
    </div>
  );
}
