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

function LivingCharacter({ pointer }: CharacterProps) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // Mesh bindings for facial feature animation and secondary hair physics
  const meshBindings = useRef<{
    eyelashes?: THREE.Object3D;
    eyeline?: THREE.Object3D;
    eyeIris?: THREE.Object3D;
    eyeHighlight?: THREE.Object3D;
    brows?: THREE.Object3D;
    hairStrands: THREE.Object3D[];
  }>({ hairStrands: [] });

  // Autonomous physiological blink state
  const blinkState = useRef({
    progress: -1,
    nextBlinkTime: 2.2,
    isDoubleBlink: false,
  });

  // Micro-saccade restlessness state (darting eyes like a living being)
  const saccadeState = useRef({
    x: 0,
    y: 0,
    nextTime: 1.0,
  });

  // Base eyelash Y position to drop lid down during blink
  const eyelashBaseY = useRef<number | null>(null);
  const eyelineBaseY = useRef<number | null>(null);

  // Inertial hair secondary spring dynamics
  const hairLag = useRef(0);

  // Calibrate native materials to match Img 3 studio render
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
          // Preserve GLTF native emissiveTexture (Image 2) which has black pupil & black sclera!
          else if (name.includes('eyeiris')) {
            mat.roughness = 0.06;
            mat.metalness = 0.0;
            mat.emissive = new THREE.Color(0x00f0ff);
            mat.emissiveIntensity = 0.70;
          }
          // 4. Crisp White Eye Highlights (Sharp specular reflection like Img 3)
          else if (name.includes('eyehighlight')) {
            mat.color.setRGB(1.0, 1.0, 1.0);
            mat.roughness = 0.15;
            mat.metalness = 0.0;
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0.0;
            mat.depthWrite = false;
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
          // 9. Rich Leather Collar
          else if (name.includes('leather')) {
            mat.color.setRGB(0.38, 0.16, 0.12);
            mat.roughness = 0.40;
          } 
          // 10. Polished Gold Buckle
          else if (name.includes('metal') || name.includes('material.008')) {
            mat.color.setRGB(0.95, 0.82, 0.45);
            mat.metalness = 0.85;
            mat.roughness = 0.25;
          } 
          // 11. White Silk Shirt & Bandages
          else if (name.includes('silk') || name.includes('ducktape') || name.includes('material')) {
            mat.color.setRGB(0.90, 0.92, 0.94);
            mat.roughness = 0.48;
          }
        });

        // Cache mesh references for animation
        const objName = child.name;
        if (objName.includes('FaceEyelash')) {
          meshBindings.current.eyelashes = child;
          if (eyelashBaseY.current === null) eyelashBaseY.current = child.position.y;
        } else if (objName.includes('FaceEyeline')) {
          meshBindings.current.eyeline = child;
          if (eyelineBaseY.current === null) eyelineBaseY.current = child.position.y;
        } else if (objName.includes('EyeIris')) {
          meshBindings.current.eyeIris = child;
        } else if (objName.includes('EyeHighlight')) {
          meshBindings.current.eyeHighlight = child;
        } else if (objName.includes('FaceBrow')) {
          meshBindings.current.brows = child;
        } else if (objName.includes('Nurbs') || objName.includes('Cylinder.011')) {
          meshBindings.current.hairStrands.push(child);
        }
      }
    });
  }, [scene]);

  // ═════════════════════════════════════════════════════════════════
  // LIVING BIOMECHANICAL ANIMATION LOOP: EYES, BREATHING & BLINKING
  // ═════════════════════════════════════════════════════════════════
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // Normalized: -1 to 1
    const mouseY = pointer.current.y; // Normalized: -1 to 1
    const mouseVx = pointer.current.vx; // Mouse velocity

    // 1. Organic Diaphragm Breathing (Natural respiratory frequency ~16 breaths/min)
    const breathCycle = time * 1.9;
    const breathOffset = (Math.sin(breathCycle) + 0.3 * Math.sin(breathCycle * 2)) * 0.005;
    const breathNod = Math.sin(breathCycle) * 0.012;

    // 2. Head Kinematics & Cursor Tracking
    // Base forward orientation facing camera is Math.PI (180°)
    const targetYaw = Math.PI - mouseX * 0.22;
    const targetPitch = mouseY * 0.14 + breathNod;
    const targetRoll = -mouseX * 0.03;

    if (groupRef.current) {
      groupRef.current.position.y = -1.35 + breathOffset;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetYaw, 4.5 * delta);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 4.0 * delta);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRoll, 3.5 * delta);
    }

    // 3. Dynamic Eye Movement (Pupils visibly track cursor + involuntary micro-saccades)
    const saccade = saccadeState.current;
    if (time > saccade.nextTime) {
      // Living eye micro-drift
      saccade.x = (Math.random() - 0.5) * 0.0022;
      saccade.y = (Math.random() - 0.5) * 0.0016;
      saccade.nextTime = time + 0.8 + Math.random() * 1.8;
    }

    // Generous, clearly visible gaze amplitude
    const targetGazeX = -mouseX * 0.0055 + saccade.x;
    const targetGazeY = mouseY * 0.0040 + saccade.y;

    // Move both Iris and Specular Highlights together as a unified eye cluster
    if (meshBindings.current.eyeIris) {
      meshBindings.current.eyeIris.position.x = THREE.MathUtils.lerp(
        meshBindings.current.eyeIris.position.x,
        targetGazeX,
        10.0 * delta
      );
      meshBindings.current.eyeIris.position.y = THREE.MathUtils.lerp(
        meshBindings.current.eyeIris.position.y,
        targetGazeY,
        10.0 * delta
      );
    }

    if (meshBindings.current.eyeHighlight) {
      meshBindings.current.eyeHighlight.position.x = THREE.MathUtils.lerp(
        meshBindings.current.eyeHighlight.position.x,
        targetGazeX,
        10.0 * delta
      );
      meshBindings.current.eyeHighlight.position.y = THREE.MathUtils.lerp(
        meshBindings.current.eyeHighlight.position.y,
        targetGazeY,
        10.0 * delta
      );
    }

    // 4. Physiological Curvilinear Eyelid Blinking
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.28;
    }

    let blinkScaleY = 1.0;
    if (blink.progress >= 0) {
      blink.progress += 14.0 * delta;
      if (blink.progress <= 0.40) {
        // Fast snap close (60ms)
        const t = blink.progress / 0.40;
        blinkScaleY = 1.0 - t * t * 0.98;
      } else if (blink.progress <= 0.52) {
        // Closed hold
        blinkScaleY = 0.02;
      } else if (blink.progress <= 1.0) {
        // Cubic ease-out open (110ms)
        const t = (blink.progress - 0.52) / 0.48;
        blinkScaleY = 0.02 + (1.0 - Math.pow(1.0 - t, 3)) * 0.98;
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

    // Apply lid closure + vertical drop to seal the eye
    const closeAmount = 1.0 - blinkScaleY;
    if (meshBindings.current.eyelashes && eyelashBaseY.current !== null) {
      meshBindings.current.eyelashes.scale.y = blinkScaleY;
      meshBindings.current.eyelashes.position.y = eyelashBaseY.current - closeAmount * 0.004;
    }
    if (meshBindings.current.eyeline && eyelineBaseY.current !== null) {
      meshBindings.current.eyeline.scale.y = blinkScaleY;
      meshBindings.current.eyeline.position.y = eyelineBaseY.current - closeAmount * 0.004;
    }

    // 5. Eyebrow Expressive Elevation
    const targetBrowY = Math.max(0, mouseY) * 0.0020 - closeAmount * 0.0010;
    if (meshBindings.current.brows) {
      meshBindings.current.brows.position.y = THREE.MathUtils.lerp(
        meshBindings.current.brows.position.y,
        targetBrowY,
        6.0 * delta
      );
    }

    // 6. Secondary Mass-Spring Physics on Hair Strands
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

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING CINEMATIC SHADERS...</span>
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
        // Exact dark studio vignette matching Img 3
        background: 'radial-gradient(circle at 50% 40%, #252830 0%, #15171d 55%, #08090c 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        // Exact portrait bust framing matching Img 3
        camera={{ position: [0, 0.11, 0.60], fov: 35 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.98,
        }}
      >
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
          <LivingCharacter pointer={pointer} />
        </Suspense>
      </Canvas>

      {/* Gentle bottom fade into void to strictly prevent any lower chest exposure */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-void via-void/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}
