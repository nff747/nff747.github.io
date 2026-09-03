'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Preload the Draco anime model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

function SketchfabAnimeCharacter({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Facial feature mesh refs for real-time procedural facial animation
  const eyelashesRef = useRef<THREE.Object3D | null>(null);
  const eyelineRef = useRef<THREE.Object3D | null>(null);
  const eyeIrisRef = useRef<THREE.Object3D | null>(null);
  const browsRef = useRef<THREE.Object3D | null>(null);
  const mouthRef = useRef<THREE.Object3D | null>(null);

  // Base positions for relative morphing
  const initialGaze = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialBrows = useRef<THREE.Vector3>(new THREE.Vector3());

  // Autonomous blink cycle state
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.2,
    isDoubleBlink: false,
  });

  // Load and bind exact Sketchfab textures and calibrated PBR shaders
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    // 1. High-Fidelity Rosy Blush Face Texture
    const faceBlushTex = textureLoader.load('/textures/face_blush.png');
    faceBlushTex.flipY = false;
    faceBlushTex.colorSpace = THREE.SRGBColorSpace;

    // 2. High-Res Anime Glowing Iris
    const eyeIrisTex = textureLoader.load('/textures/eye_iris.jpg');
    eyeIrisTex.flipY = false;
    eyeIrisTex.colorSpace = THREE.SRGBColorSpace;

    // 3. Cheek Bandage / Ducktape
    const bandaidTex = textureLoader.load('/textures/bandaid.jpg');
    bandaidTex.flipY = false;
    bandaidTex.colorSpace = THREE.SRGBColorSpace;

    // 4. Collar Leather
    const leatherTex = textureLoader.load('/textures/leather.jpg');
    leatherTex.flipY = false;
    leatherTex.colorSpace = THREE.SRGBColorSpace;

    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (!mat.name) return;
          const name = mat.name.toLowerCase();

          // FACE SKIN - Apply high-res rosy blush texture & soft skin subsurface
          if (name.includes('face_00_skin')) {
            mat.map = faceBlushTex;
            mat.color.setRGB(1.0, 1.0, 1.0); // Keep original texture blush intact
            mat.roughness = 0.52;
            mat.metalness = 0.02;
            mat.needsUpdate = true;
          }
          // BODY SKIN
          else if (name.includes('body_00_skin')) {
            mat.color.setRGB(1.0, 0.96, 0.95);
            mat.roughness = 0.58;
            mat.metalness = 0.02;
          }
          // CHEEK BAND-AID (Ducktape_02)
          else if (name.includes('ducktape') || name.includes('tape')) {
            mat.map = bandaidTex;
            mat.color.set('#d8b894'); // Warm clinical band-aid beige
            mat.roughness = 0.75;
            mat.metalness = 0.0;
            mat.needsUpdate = true;
          }
          // RADIANT CYAN ANIME EYES
          else if (name.includes('eyeiris')) {
            mat.map = eyeIrisTex;
            mat.emissiveMap = eyeIrisTex;
            mat.emissive = new THREE.Color('#00F0FF');
            mat.emissiveIntensity = 0.95;
            mat.roughness = 0.08;
            mat.metalness = 0.1;
            mat.needsUpdate = true;
          }
          else if (name.includes('eyehighlight')) {
            mat.transparent = true;
            mat.opacity = 0.95;
            mat.roughness = 0.02;
          }
          // CLEAN 2D CEL-SHADED CONTOURS (Eyebrows, Eyelashes, Eyeliner, Mouth)
          else if (name.includes('faceeyelash') || name.includes('faceeyeline') || name.includes('facebrow')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.05;
          }
          else if (name.includes('facemouth')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.05;
            mat.color.setRGB(0.75, 0.35, 0.35); // Soft inner lip tone
          }
          // WHITE/SILVER BRAIDED HAIR
          else if (name.includes('material.006') || name.includes('material.002') || name.includes('material.001')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.92, 0.93, 0.95); // Luminous white-silver
            mat.roughness = 0.42;
            mat.metalness = 0.06;
          }
          // VIBRANT TEAL / CYAN-GREEN HAIR STREAK
          else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.18, 0.92, 0.82); // Vibrant Sketchfab teal
            mat.roughness = 0.38;
            mat.metalness = 0.05;
          }
          // BROWN LEATHER CHOKER / COLLAR
          else if (name.includes('leather')) {
            mat.map = leatherTex;
            mat.color.setRGB(0.55, 0.22, 0.16); // Rich warm leather brown
            mat.roughness = 0.35;
            mat.metalness = 0.05;
            mat.needsUpdate = true;
          }
          // GOLD/BRASS BUCKLE
          else if (name.includes('metal')) {
            mat.color.setRGB(0.95, 0.84, 0.50);
            mat.metalness = 0.88;
            mat.roughness = 0.22;
          }
          // WHITE SILK SHIRT & CHEST BANDAGE
          else if (name.includes('silk') || name.includes('material')) {
            mat.color.setRGB(0.95, 0.95, 0.96);
            mat.roughness = 0.55;
            mat.metalness = 0.02;
          }
        });

        // Cache facial component object references
        const objName = child.name;
        if (objName.includes('FaceEyelash')) eyelashesRef.current = child;
        else if (objName.includes('FaceEyeline')) eyelineRef.current = child;
        else if (objName.includes('EyeIris')) {
          eyeIrisRef.current = child;
          initialGaze.current.copy(child.position);
        }
        else if (objName.includes('FaceBrow')) {
          browsRef.current = child;
          initialBrows.current.copy(child.position);
        }
        else if (objName.includes('FaceMouth')) mouthRef.current = child;
      }
    });
  }, [scene]);

  // Dynamic Real-Time Facial Animation Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x;
    const mouseY = pointer.current.y;

    // 1. Organic Whole-Body Breathing Cycle
    const breath = Math.sin(time * 2.2);
    if (groupRef.current) {
      groupRef.current.position.y = -1.37 + breath * 0.005;

      // Smooth Head Tracking (Pitch, Yaw, Roll)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.32 + Math.sin(time * 0.8) * 0.015,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.18 + breath * 0.01,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mouseX * 0.06 + Math.cos(time * 1.1) * 0.01,
        0.05
      );
    }

    // 2. Realistic Eyelid Blink Engine (Single & Double Blinks)
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.28;
    }

    let eyeScaleY = 1.0;
    if (blink.progress >= 0) {
      blink.progress += 0.18;
      if (blink.progress <= 0.5) {
        eyeScaleY = 1.0 - (blink.progress / 0.5) * 0.96;
      } else if (blink.progress <= 1.0) {
        eyeScaleY = 0.04 + ((blink.progress - 0.5) / 0.5) * 0.96;
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          blink.nextBlinkTime = time + 2.0 + Math.random() * 3.5;
        }
      }
    }

    if (eyelashesRef.current) eyelashesRef.current.scale.y = eyeScaleY;
    if (eyelineRef.current) eyelineRef.current.scale.y = eyeScaleY;

    // 3. Reactive Pupil Gaze Tracking & Micro-Saccades
    if (eyeIrisRef.current) {
      // Subtle gaze tracking towards cursor + rapid micro-saccades
      const saccadeX = Math.sin(time * 3.8) * 0.0003;
      const saccadeY = Math.cos(time * 3.1) * 0.0002;
      eyeIrisRef.current.position.x = initialGaze.current.x + mouseX * 0.0018 + saccadeX;
      eyeIrisRef.current.position.y = initialGaze.current.y + mouseY * 0.0014 + saccadeY;
      
      // Slight pupil contraction on blink
      if (eyeScaleY < 0.5) {
        eyeIrisRef.current.scale.y = eyeScaleY * 1.5;
      } else {
        eyeIrisRef.current.scale.y = 1.0;
      }
    }

    // 4. Expressive Eyebrow Micro-Gestures
    if (browsRef.current) {
      const emotionalArch = Math.max(0, mouseY) * 0.0015;
      const breathingWave = Math.sin(time * 1.4) * 0.0008;
      browsRef.current.position.y = initialBrows.current.y + emotionalArch + breathingWave;
      browsRef.current.rotation.z = Math.sin(time * 0.7) * 0.008;
    }

    // 5. Delicate Mouth Micro-Parting / Breathing
    if (mouthRef.current) {
      const mouthPart = Math.max(0, Math.sin(time * 2.2)) * 0.12;
      mouthRef.current.scale.y = 1.0 + mouthPart;
      mouthRef.current.scale.x = 1.0 + Math.sin(time * 1.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.37, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>CALIBRATING SKETCHFAB SHADERS...</span>
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
        // Exact Sketchfab Studio Vignette Background
        background: 'radial-gradient(circle at 50% 36%, #2e3440 0%, #1c2028 48%, #0a0c10 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0.03, 0.76], fov: 36 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* Ambient base fill */}
        <ambientLight intensity={0.45} color="#2c303c" />
        
        {/* 1. Key Spot/Directional Light (Top-Front-Right) - Casts soft shadows under bangs and chin */}
        <directionalLight 
          position={[0.42, 1.9, 1.1]} 
          intensity={2.4} 
          color="#fff2e3" 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* 2. Soft Cool Fill Light (Front-Left) */}
        <directionalLight position={[-0.75, 1.45, 0.85]} intensity={0.7} color="#a0c4f8" />
        
        {/* 3. Under-Chin Bounce Light */}
        <directionalLight position={[0.0, 0.7, 0.75]} intensity={0.35} color="#f5e4d5" />
        
        {/* 4. Crest / Top Rim Light (Silver hair shine outline) */}
        <directionalLight position={[0.0, 2.35, -0.9]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[0.0, 2.7, 0.2]} intensity={2.0} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <SketchfabAnimeCharacter pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
