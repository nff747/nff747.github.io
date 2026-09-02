'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Pre-warm the GLTF Draco model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

function AnimeCharacter({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Mesh references for procedural animations
  const eyelashesRef = useRef<THREE.Object3D | null>(null);
  const eyesRef = useRef<THREE.Object3D | null>(null);

  // Blink state
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.0,
    isDoubleBlink: false,
  });

  // Calibrate materials on load to match the studio anime render
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (!mat.name) return;
          const name = mat.name.toLowerCase();

          if (name.includes('material.006') || name.includes('material.002') || name.includes('material.001')) {
            // White braided & flowing anime hair
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.88, 0.89, 0.92);
            mat.roughness = 0.48;
            mat.metalness = 0.04;
          } else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.2, 0.9, 0.85);
            mat.roughness = 0.4;
          } else if (name.includes('facemouth') || name.includes('faceeyelash') || name.includes('faceeyeline') || name.includes('facebrow')) {
            // Clean 2D cel-shaded facial contours
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.02;
          } else if (name.includes('face_00_skin') || name.includes('body_00_skin')) {
            mat.roughness = 0.62;
            mat.color.setRGB(1.0, 0.95, 0.95);
          } else if (name.includes('leather')) {
            mat.color.setRGB(0.38, 0.16, 0.12);
            mat.roughness = 0.38;
          } else if (name.includes('metal')) {
            mat.color.setRGB(0.95, 0.82, 0.45);
            mat.metalness = 0.85;
            mat.roughness = 0.25;
          } else if (name.includes('silk')) {
            mat.color.setRGB(0.92, 0.93, 0.95);
            mat.roughness = 0.45;
          } else if (name.includes('eyeiris')) {
            // Radiant glowing cyan anime eyes
            mat.emissive = new THREE.Color('#00F0FF');
            mat.emissiveIntensity = 0.85;
            mat.roughness = 0.06;
          }
        });

        const objName = child.name;
        if (objName.includes('FaceEyelash')) eyelashesRef.current = child;
        else if (objName.includes('EyeIris')) eyesRef.current = child;
      }
    });
  }, [scene]);

  // Procedural Living Animation Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x;
    const mouseY = pointer.current.y;

    if (groupRef.current) {
      // 1. Procedural breathing
      const breath = Math.sin(time * 2.2);
      groupRef.current.position.y = -1.35 + breath * 0.008;

      // 2. Cursor tracking with smooth slerp dampening
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.35, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.2, 0.05);

      // Subtle chest sway
      groupRef.current.rotation.z = Math.sin(time * 1.1) * 0.01;
    }

    // 3. Natural non-linear eyelid blinking
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.25;
    }

    if (blink.progress >= 0) {
      blink.progress += 0.16;
      let eyeScaleY = 1.0;
      if (blink.progress <= 0.5) {
        eyeScaleY = 1.0 - (blink.progress / 0.5) * 0.95;
      } else if (blink.progress <= 1.0) {
        eyeScaleY = 0.05 + ((blink.progress - 0.5) / 0.5) * 0.95;
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          blink.nextBlinkTime = time + 2.5 + Math.random() * 3.5;
        }
      }

      if (eyelashesRef.current) eyelashesRef.current.scale.y = eyeScaleY;
      if (eyesRef.current) eyesRef.current.scale.y = eyeScaleY;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING NEURAL 3D RIG...</span>
      </div>
    </Html>
  );
}

export function HeroCanvas() {
  const pointer = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0.05, 0.72], fov: 38 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        {/* Calibrated Studio 3-Point + Dual Rim Lighting */}
        <ambientLight intensity={0.65} color="#282c38" />
        
        {/* Warm Studio Key Light */}
        <directionalLight position={[0.35, 1.85, 1.25]} intensity={2.0} color="#ffeedd" />
        
        {/* Cool Cyan Fill Light */}
        <directionalLight position={[-1.2, 1.3, 0.9]} intensity={0.8} color="#8cb4e8" />
        
        {/* Warm Bottom Bounce */}
        <directionalLight position={[0, 0.6, 0.8]} intensity={0.4} color="#d0a888" />
        
        {/* Brilliant Hair Rim Lighting */}
        <directionalLight position={[0, 2.3, -1.2]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[0, 2.6, 0.2]} intensity={2.2} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <AnimeCharacter pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
