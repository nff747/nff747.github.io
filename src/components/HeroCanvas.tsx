'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Pre-warm the GLTF Draco model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

function AnimeCharacter({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Mesh references for procedural eyelid blinking
  const eyelashesRef = useRef<THREE.Object3D | null>(null);
  const eyelineRef = useRef<THREE.Object3D | null>(null);

  // Natural blink cycle state
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.0,
    isDoubleBlink: false,
  });

  // Preserve and enhance the model's native embedded textures and PBR materials
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (!mat.name) return;
          const name = mat.name.toLowerCase();

          // White hair strands - luminous silver sheen
          if (name.includes('material.006') || name.includes('material.002') || name.includes('material.001')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.92, 0.93, 0.95);
            mat.roughness = 0.44;
            mat.metalness = 0.04;
          } 
          // Signature teal hair highlight streak
          else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.18, 0.90, 0.82);
            mat.roughness = 0.38;
          } 
          // 2D anime facial line art (clean alpha rendering, no depth fighting)
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
          // Skin materials - keep native blush and texture intact
          else if (name.includes('face_00_skin') || name.includes('body_00_skin')) {
            mat.roughness = 0.55;
            mat.metalness = 0.0;
          } 
          // Leather collar
          else if (name.includes('leather')) {
            mat.color.setRGB(0.42, 0.18, 0.14);
            mat.roughness = 0.36;
          } 
          // Gold metallic buckle
          else if (name.includes('metal')) {
            mat.color.setRGB(0.95, 0.84, 0.50);
            mat.metalness = 0.88;
            mat.roughness = 0.22;
          } 
          // White silk shirt & bandage tape
          else if (name.includes('silk') || name.includes('material')) {
            mat.color.setRGB(0.94, 0.94, 0.96);
            mat.roughness = 0.50;
          } 
          // Radiant glowing cyan anime eyes
          else if (name.includes('eyeiris')) {
            mat.emissive = new THREE.Color('#00F0FF');
            mat.emissiveIntensity = 0.90;
            mat.roughness = 0.06;
          }
        });

        const objName = child.name;
        if (objName.includes('FaceEyelash')) eyelashesRef.current = child;
        else if (objName.includes('FaceEyeline')) eyelineRef.current = child;
      }
    });
  }, [scene]);

  // Procedural Living Animation Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // -1 (left) to 1 (right)
    const mouseY = pointer.current.y; // -1 (bottom) to 1 (top)

    if (groupRef.current) {
      // 1. Organic diaphragm breathing motion
      const breath = Math.sin(time * 2.2);
      groupRef.current.position.y = -1.35 + breath * 0.005;

      // 2. FORWARD-FACING NEUTRAL BASELINE (Math.PI / 180°):
      // The model's native coordinate origin faces -Z.
      // Rotating by Math.PI turns her face directly forward toward the camera and viewer!
      const BASE_YAW = Math.PI;
      const targetYaw = BASE_YAW - mouseX * 0.22;
      const targetPitch = mouseY * 0.14;
      const targetRoll = -mouseX * 0.03;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.06);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 0.05);
    }

    // 3. Natural non-linear eyelid blinking
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.25;
    }

    if (blink.progress >= 0) {
      blink.progress += 0.18;
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
          blink.nextBlinkTime = time + 2.2 + Math.random() * 3.5;
        }
      }

      if (eyelashesRef.current) eyelashesRef.current.scale.y = eyeScaleY;
      if (eyelineRef.current) eyelineRef.current.scale.y = eyeScaleY;
    }
  });

  return (
    // Rotated by Math.PI (180°) so her face points directly at the camera with native textures
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
        <span>CALIBRATING FORWARD 3D RIG...</span>
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
      style={{
        // Smooth Sketchfab studio backdrop
        background: 'radial-gradient(circle at 50% 36%, #2e3440 0%, #1c2028 48%, #0a0c10 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        // Exact calibrated portrait bust sizing from the user's preferred screenshot
        camera={{ position: [0, 0.05, 0.72], fov: 38 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        {/* Studio 4-Point Lighting matching front orientation */}
        <ambientLight intensity={0.65} color="#282c38" />
        
        {/* Front Key Light */}
        <directionalLight position={[0.35, 1.85, 1.25]} intensity={2.2} color="#ffeedd" />
        
        {/* Cool Front-Left Fill */}
        <directionalLight position={[-1.2, 1.3, 0.9]} intensity={0.8} color="#8cb4e8" />
        
        {/* Warm Bottom Bounce */}
        <directionalLight position={[0, 0.6, 0.8]} intensity={0.4} color="#d0a888" />
        
        {/* Back Hair Rim Light */}
        <directionalLight position={[0, 2.3, -1.2]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[0, 2.6, 0.2]} intensity={2.2} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <AnimeCharacter pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
