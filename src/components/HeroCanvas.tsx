'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Preload the Draco anime model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

function LivingAnimeCharacter({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Facial feature mesh refs for real-time procedural micro-animations
  const eyelashesRef = useRef<THREE.Object3D | null>(null);
  const eyelineRef = useRef<THREE.Object3D | null>(null);
  const eyeIrisRef = useRef<THREE.Object3D | null>(null);
  const browsRef = useRef<THREE.Object3D | null>(null);
  const mouthRef = useRef<THREE.Object3D | null>(null);

  // Base neutral transforms
  const initialGaze = useRef(new THREE.Vector3());
  const initialBrows = useRef(new THREE.Vector3());
  const currentEyeGaze = useRef(new THREE.Vector2(0, 0));

  // Autonomous blink cycle state
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.2,
    isDoubleBlink: false,
  });

  // Micro-saccade state for biological eye restlessness
  const saccadeState = useRef({
    x: 0,
    y: 0,
    nextSaccadeTime: 1.0,
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

          // FACE SKIN - Rosy blush across cheeks and nose bridge
          if (name.includes('face_00_skin')) {
            mat.map = faceBlushTex;
            mat.color.setRGB(1.0, 1.0, 1.0);
            mat.roughness = 0.50;
            mat.metalness = 0.02;
            mat.needsUpdate = true;
          }
          // BODY SKIN
          else if (name.includes('body_00_skin')) {
            mat.color.setRGB(1.0, 0.96, 0.95);
            mat.roughness = 0.56;
            mat.metalness = 0.02;
          }
          // CHEEK BAND-AID (Ducktape_02)
          else if (name.includes('ducktape') || name.includes('tape')) {
            mat.map = bandaidTex;
            mat.color.set('#d8b894');
            mat.roughness = 0.72;
            mat.metalness = 0.0;
            mat.needsUpdate = true;
          }
          // RADIANT CYAN ANIME EYES - Deep moist specular gloss
          else if (name.includes('eyeiris')) {
            mat.map = eyeIrisTex;
            mat.emissiveMap = eyeIrisTex;
            mat.emissive = new THREE.Color('#00E5FF');
            mat.emissiveIntensity = 1.1;
            mat.roughness = 0.05;
            mat.metalness = 0.08;
            mat.needsUpdate = true;
          }
          else if (name.includes('eyehighlight')) {
            mat.transparent = true;
            mat.opacity = 0.95;
            mat.roughness = 0.02;
          }
          // CLEAN 2D CEL-SHADED CONTOURS
          else if (name.includes('faceeyelash') || name.includes('faceeyeline') || name.includes('facebrow')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.05;
          }
          else if (name.includes('facemouth')) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.alphaTest = 0.05;
            mat.color.setRGB(0.72, 0.32, 0.32);
          }
          // WHITE/SILVER BRAIDED HAIR
          else if (name.includes('material.006') || name.includes('material.002') || name.includes('material.001')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.93, 0.94, 0.96);
            mat.roughness = 0.40;
            mat.metalness = 0.05;
          }
          // VIBRANT TEAL / CYAN-GREEN HAIR STREAK
          else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.18, 0.92, 0.82);
            mat.roughness = 0.36;
            mat.metalness = 0.05;
          }
          // BROWN LEATHER CHOKER / COLLAR
          else if (name.includes('leather')) {
            mat.map = leatherTex;
            mat.color.setRGB(0.55, 0.22, 0.16);
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
            mat.roughness = 0.52;
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

  // Living Biological Animation Loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // Normalized screen -1 to 1
    const mouseY = pointer.current.y;

    // 1. Organic Whole-Body Breathing Mechanics (Asymmetric Inhale/Exhale)
    // Faster inhalation (25%), slower relaxation (75%) for lifelike diaphragm motion
    const breath = (Math.sin(time * 1.8) + 0.35 * Math.sin(time * 3.6)) * 0.0035;
    const breathChest = Math.max(0, Math.sin(time * 1.8)) * 0.005;

    if (groupRef.current) {
      // Anchored vertical positioning matching requested portrait sizing
      groupRef.current.position.y = -1.37 + breath;
      groupRef.current.position.z = breathChest;

      // FORWARD-FACING ALIGNMENT WITH ORGANIC EYE-CONTACT DYNAMICS:
      // Neutral baseline is 0.0 (directly facing forward into the camera).
      // Cursor tracking introduces subtle, conscious orientation towards the viewer.
      const targetYaw = mouseX * 0.20 + Math.sin(time * 0.6) * 0.008;
      const targetPitch = -mouseY * 0.12 - breath * 0.8;
      const targetRoll = mouseX * 0.04 + Math.cos(time * 0.8) * 0.006;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 3.5 * delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 3.5 * delta);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 3.0 * delta);
    }

    // 2. Eye-Lead Kinematics & Biological Micro-Saccades
    // In living beings, eyes dart toward the target first before the head turns
    const saccade = saccadeState.current;
    if (time > saccade.nextSaccadeTime) {
      // Rapid involuntary microscopic gaze shift (0.2-0.5mm)
      saccade.x = (Math.random() - 0.5) * 0.0006;
      saccade.y = (Math.random() - 0.5) * 0.0004;
      saccade.nextSaccadeTime = time + 0.8 + Math.random() * 1.6;
    }

    // Eyes respond quickly with high tracking affinity
    currentEyeGaze.current.x = THREE.MathUtils.lerp(
      currentEyeGaze.current.x,
      mouseX * 0.0028 + saccade.x,
      8.0 * delta
    );
    currentEyeGaze.current.y = THREE.MathUtils.lerp(
      currentEyeGaze.current.y,
      mouseY * 0.0022 + saccade.y,
      8.0 * delta
    );

    if (eyeIrisRef.current) {
      eyeIrisRef.current.position.x = initialGaze.current.x + currentEyeGaze.current.x;
      eyeIrisRef.current.position.y = initialGaze.current.y + currentEyeGaze.current.y;
    }

    // 3. Realistic Autonomous Eyelid Blink Engine
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.25;
    }

    let eyeScaleY = 1.0;
    if (blink.progress >= 0) {
      blink.progress += 12.0 * delta; // Crisp, rapid physiological blink
      if (blink.progress <= 0.5) {
        // Fast snap down
        eyeScaleY = 1.0 - (blink.progress / 0.5) * 0.96;
      } else if (blink.progress <= 1.0) {
        // Smooth snap up
        eyeScaleY = 0.04 + ((blink.progress - 0.5) / 0.5) * 0.96;
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          // Random natural cadence (every 2.5 to 5.5 seconds)
          blink.nextBlinkTime = time + 2.4 + Math.random() * 3.2;
        }
      }
    }

    if (eyelashesRef.current) eyelashesRef.current.scale.y = eyeScaleY;
    if (eyelineRef.current) eyelineRef.current.scale.y = eyeScaleY;

    // 4. Expressive Eyebrow Micro-Gestures
    if (browsRef.current) {
      // Inquisitive subtle brow raise when cursor is above eye level
      const emotionalArch = Math.max(0, mouseY) * 0.0018;
      // Slight eyebrow relaxation during blink
      const blinkBrowDip = (1.0 - eyeScaleY) * 0.0012;
      const breathingWave = Math.sin(time * 1.8) * 0.0006;
      
      browsRef.current.position.y = initialBrows.current.y + emotionalArch - blinkBrowDip + breathingWave;
      browsRef.current.rotation.z = Math.sin(time * 0.9) * 0.006;
    }

    // 5. Delicate Mouth Micro-Parting / Respiration
    if (mouthRef.current) {
      // Subtle natural breathing parting on inhale
      const respirationPart = Math.max(0, Math.sin(time * 1.8)) * 0.08;
      mouthRef.current.scale.y = 1.0 + respirationPart;
      mouthRef.current.scale.x = 1.0 + Math.sin(time * 0.9) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.37, 0]} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING LIVING CHARACTER MATRIX...</span>
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
        // Calibrated camera placement preserving exact portrait sizing from screenshot
        camera={{ position: [0, 0.02, 0.84], fov: 35 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.06,
        }}
      >
        {/* Ambient base fill */}
        <ambientLight intensity={0.48} color="#2c303c" />
        
        {/* 1. Key Spot/Directional Light (Top-Front-Right) - Bangs and chin cast shadows */}
        <directionalLight 
          position={[0.40, 1.85, 1.15]} 
          intensity={2.3} 
          color="#fff2e3" 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* 2. Soft Cool Fill Light (Front-Left) */}
        <directionalLight position={[-0.70, 1.40, 0.85]} intensity={0.7} color="#a0c4f8" />
        
        {/* 3. Under-Chin Warm Bounce */}
        <directionalLight position={[0.0, 0.65, 0.75]} intensity={0.35} color="#f5e4d5" />
        
        {/* 4. Crest / Top Rim Light (Silver hair shine outline) */}
        <directionalLight position={[0.0, 2.30, -0.85]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[0.0, 2.65, 0.20]} intensity={2.0} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <LivingAnimeCharacter pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
