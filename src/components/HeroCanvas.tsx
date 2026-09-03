'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Pre-warm the GLTF Draco anime model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

// ═══════════════════════════════════════════════════════════════════
// TOP-GRADE CYBERPUNK EXOSKELETON RIG
// Features: Titanium Clavicle Yoke, Quantum Micro-Reactor,
// Dual Hydraulic Actuators, Carbon-Fiber Pauldrons, Articulated
// Cervical Spine Vertebrae, Temporal Neural Rig & Pulsing Conduits.
// ═══════════════════════════════════════════════════════════════════
function ExoskeletonRig() {
  const reactorCoreRef = useRef<THREE.Mesh>(null);
  const leftPistonRef = useRef<THREE.Group>(null);
  const rightPistonRef = useRef<THREE.Group>(null);
  const conduitMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const telemetryRingRef = useRef<THREE.Mesh>(null);

  // High-Grade Materials
  const materials = useMemo(() => {
    return {
      // 1. Brushed Gunmetal Titanium Chassis
      titanium: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e242e'),
        roughness: 0.22,
        metalness: 0.94,
        envMapIntensity: 1.5,
      }),
      // 2. Dark Carbon-Fiber Composite Plates
      carbon: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#101318'),
        roughness: 0.38,
        metalness: 0.25,
      }),
      // 3. Mirror-Polished Chrome Piston Shafts
      chrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ffffff'),
        roughness: 0.05,
        metalness: 1.0,
      }),
      // 4. Radiant Quantum Cyan Plasma (Core & Conduits)
      plasma: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#00F0FF'),
        emissive: new THREE.Color('#00F0FF'),
        emissiveIntensity: 2.8,
        roughness: 0.1,
        metalness: 0.1,
      }),
      // 5. Warning Amber Micro-LEDs
      amberLED: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#ff9900'),
        emissive: new THREE.Color('#ff9900'),
        emissiveIntensity: 2.2,
        roughness: 0.2,
      }),
      // 6. Gold/Brass Actuator Couplers & Rivets
      brass: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e0b85a'),
        roughness: 0.24,
        metalness: 0.90,
      }),
    };
  }, []);

  // Dynamic Exoskeleton Telemetry & Hydraulics Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Quantum Reactor Heartbeat & Plasma Conduit Pulse
    const pulse = 2.4 + Math.sin(time * 3.6) * 1.2;
    if (reactorCoreRef.current) {
      (reactorCoreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
    if (conduitMatRef.current) {
      conduitMatRef.current.emissiveIntensity = 2.0 + Math.sin(time * 3.0) * 0.9;
    }

    // 2. Hydraulic Piston Compression/Extension with Respiratory Diaphragm
    const breathShift = Math.sin(time * 2.2) * 0.003;
    if (leftPistonRef.current) {
      leftPistonRef.current.position.y = breathShift;
      leftPistonRef.current.scale.y = 1.0 + breathShift * 8.0;
    }
    if (rightPistonRef.current) {
      rightPistonRef.current.position.y = breathShift;
      rightPistonRef.current.scale.y = 1.0 + breathShift * 8.0;
    }

    // 3. Temporal Neural Telemetry Ring Rotation
    if (telemetryRingRef.current) {
      telemetryRingRef.current.rotation.z = time * 0.75;
    }
  });

  return (
    <group name="Exoskeleton_Master_Rig">
      {/* ═════════════════════════════════════════════════════════════
          1. PECTORAL QUANTUM REACTOR CORE & CLAVICLE YOKE
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 1.28, 0.065]}>
        {/* Central Hexagonal Core Housing */}
        <mesh material={materials.titanium} castShadow>
          <cylinderGeometry args={[0.024, 0.028, 0.016, 6]} />
        </mesh>

        {/* Outer Titanium Bezel Ring */}
        <mesh position={[0, 0, 0.009]} material={materials.carbon}>
          <ringGeometry args={[0.015, 0.024, 6]} />
        </mesh>

        {/* Glowing Cyan Quantum Reactor Lens */}
        <mesh ref={reactorCoreRef} position={[0, 0, 0.008]} material={materials.plasma}>
          <circleGeometry args={[0.014, 32]} />
        </mesh>

        {/* Micro Diagnostic Status LEDs (Left Cyan / Right Amber) */}
        <mesh position={[-0.019, 0.002, 0.008]} material={materials.plasma}>
          <sphereGeometry args={[0.0018, 12, 12]} />
        </mesh>
        <mesh position={[0.019, 0.002, 0.008]} material={materials.amberLED}>
          <sphereGeometry args={[0.0018, 12, 12]} />
        </mesh>

        {/* Clavicle Reinforcement Wings (Left & Right) */}
        <group position={[-0.055, 0.012, -0.008]} rotation={[0, 0.22, 0.12]}>
          <mesh material={materials.titanium} castShadow>
            <boxGeometry args={[0.075, 0.014, 0.012]} />
          </mesh>
          <mesh position={[0, 0.008, 0]} material={materials.carbon}>
            <boxGeometry args={[0.065, 0.004, 0.010]} />
          </mesh>
        </group>
        <group position={[0.055, 0.012, -0.008]} rotation={[0, -0.22, -0.12]}>
          <mesh material={materials.titanium} castShadow>
            <boxGeometry args={[0.075, 0.014, 0.012]} />
          </mesh>
          <mesh position={[0, 0.008, 0]} material={materials.carbon}>
            <boxGeometry args={[0.065, 0.004, 0.010]} />
          </mesh>
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          2. DUAL HYDRAULIC ACTUATOR PISTONS (CLAVICLE TO SHOULDERS)
          ═════════════════════════════════════════════════════════════ */}
      {/* Left Hydraulic Damper */}
      <group position={[-0.105, 1.285, 0.045]} rotation={[0.15, 0.35, 0.55]}>
        {/* Outer Cylinder Housing */}
        <mesh material={materials.titanium} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.038, 16]} />
        </mesh>
        <mesh position={[0, 0.019, 0]} material={materials.brass}>
          <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
        </mesh>
        {/* Dynamic Telescoping Chrome Piston Rod */}
        <group ref={leftPistonRef} position={[0, -0.018, 0]}>
          <mesh material={materials.chrome}>
            <cylinderGeometry args={[0.0045, 0.0045, 0.032, 16]} />
          </mesh>
        </group>
      </group>

      {/* Right Hydraulic Damper */}
      <group position={[0.105, 1.285, 0.045]} rotation={[0.15, -0.35, -0.55]}>
        <mesh material={materials.titanium} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.038, 16]} />
        </mesh>
        <mesh position={[0, 0.019, 0]} material={materials.brass}>
          <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
        </mesh>
        <group ref={rightPistonRef} position={[0, -0.018, 0]}>
          <mesh material={materials.chrome}>
            <cylinderGeometry args={[0.0045, 0.0045, 0.032, 16]} />
          </mesh>
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          3. ARTICULATED STEALTH SHOULDER PAULDRONS (LEFT & RIGHT)
          ═════════════════════════════════════════════════════════════ */}
      {/* Left Shoulder Armor Unit */}
      <group position={[-0.178, 1.295, 0.015]} rotation={[0.1, 0.25, -0.25]}>
        {/* Primary Upper Pauldron Plate */}
        <mesh material={materials.titanium} castShadow>
          <boxGeometry args={[0.055, 0.024, 0.085]} />
        </mesh>
        {/* Secondary Stealth Chamfer */}
        <mesh position={[-0.015, -0.012, 0]} rotation={[0, 0, 0.35]} material={materials.carbon}>
          <boxGeometry args={[0.045, 0.016, 0.075]} />
        </mesh>
        {/* Exhaust Vent Slots */}
        <mesh position={[0.012, 0.013, -0.015]} material={materials.plasma}>
          <boxGeometry args={[0.018, 0.003, 0.006]} />
        </mesh>
        <mesh position={[0.012, 0.013, 0.015]} material={materials.plasma}>
          <boxGeometry args={[0.018, 0.003, 0.006]} />
        </mesh>
        {/* Titanium Joint Bolting */}
        <mesh position={[0, 0, 0.045]} material={materials.brass}>
          <cylinderGeometry args={[0.005, 0.005, 0.026, 12]} />
        </mesh>
      </group>

      {/* Right Shoulder Armor Unit */}
      <group position={[0.178, 1.295, 0.015]} rotation={[0.1, -0.25, 0.25]}>
        <mesh material={materials.titanium} castShadow>
          <boxGeometry args={[0.055, 0.024, 0.085]} />
        </mesh>
        <mesh position={[0.015, -0.012, 0]} rotation={[0, 0, -0.35]} material={materials.carbon}>
          <boxGeometry args={[0.045, 0.016, 0.075]} />
        </mesh>
        <mesh position={[-0.012, 0.013, -0.015]} material={materials.plasma}>
          <boxGeometry args={[0.018, 0.003, 0.006]} />
        </mesh>
        <mesh position={[-0.012, 0.013, 0.015]} material={materials.plasma}>
          <boxGeometry args={[0.018, 0.003, 0.006]} />
        </mesh>
        <mesh position={[0, 0, 0.045]} material={materials.brass}>
          <cylinderGeometry args={[0.005, 0.005, 0.026, 12]} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          4. ARTICULATED CERVICAL SPINE VERTEBRAE (C1 - C5)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 1.335, -0.062]}>
        {/* Dual Titanium Spinal Stabilizer Rails */}
        <mesh position={[-0.014, 0.045, 0]} material={materials.titanium}>
          <cylinderGeometry args={[0.0028, 0.0028, 0.11, 12]} />
        </mesh>
        <mesh position={[0.014, 0.045, 0]} material={materials.titanium}>
          <cylinderGeometry args={[0.0028, 0.0028, 0.11, 12]} />
        </mesh>

        {/* Central Luminous Cyber-Spine Conduit */}
        <mesh position={[0, 0.045, 0.003]} material={materials.plasma}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.105, 16]} />
        </mesh>

        {/* 5 Stacked Articulating Titanium Vertebrae Brackets */}
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} position={[0, i * 0.022, 0]}>
            {/* Vertebra Body */}
            <mesh material={materials.carbon} castShadow>
              <boxGeometry args={[0.038, 0.012, 0.016]} />
            </mesh>
            {/* Lateral Wing Spinous Process */}
            <mesh position={[-0.019, 0, -0.004]} material={materials.titanium}>
              <boxGeometry args={[0.008, 0.008, 0.018]} />
            </mesh>
            <mesh position={[0.019, 0, -0.004]} material={materials.titanium}>
              <boxGeometry args={[0.008, 0.008, 0.018]} />
            </mesh>
            {/* Hinge Rivets */}
            <mesh position={[0, 0, -0.009]} material={materials.brass}>
              <sphereGeometry args={[0.0022, 8, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═════════════════════════════════════════════════════════════
          5. TEMPORAL NEURAL SENSOR & CYBER-VISOR INTERFACE (LEFT)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0.084, 1.455, 0.025]} rotation={[0.05, -0.22, 0.1]}>
        {/* Cranial Ear-Cuff Terminal */}
        <mesh material={materials.titanium} castShadow>
          <cylinderGeometry args={[0.012, 0.014, 0.016, 16]} />
        </mesh>
        <mesh position={[0, 0, 0.009]} material={materials.carbon}>
          <cylinderGeometry args={[0.009, 0.009, 0.004, 16]} />
        </mesh>

        {/* Rotating Holographic Telemetry Indicator Ring */}
        <mesh ref={telemetryRingRef} position={[0, 0, 0.012]} material={materials.plasma}>
          <ringGeometry args={[0.006, 0.009, 16]} />
        </mesh>

        {/* Sleek Sensor Stylus / Acoustic Boom along Jawline */}
        <group position={[0.004, -0.022, 0.015]} rotation={[-0.35, 0.15, -0.2]}>
          <mesh material={materials.titanium}>
            <cylinderGeometry args={[0.0018, 0.0012, 0.048, 8]} />
          </mesh>
          {/* Cyan Micro-Sensor Tip */}
          <mesh position={[0, -0.025, 0]} material={materials.plasma}>
            <sphereGeometry args={[0.0022, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          6. BRAIDED PLASMA CONDUIT POWER LINES (CORE TO SPINE)
          ═════════════════════════════════════════════════════════════ */}
      {/* Left Power Conduit */}
      <mesh position={[-0.075, 1.305, 0.015]} rotation={[0.65, -0.45, 0.65]}>
        <cylinderGeometry args={[0.0032, 0.0032, 0.11, 12]} />
        <primitive object={materials.plasma} ref={conduitMatRef} attach="material" />
      </mesh>
      {/* Right Power Conduit */}
      <mesh position={[0.075, 1.305, 0.015]} rotation={[0.65, 0.45, -0.65]} material={materials.plasma}>
        <cylinderGeometry args={[0.0032, 0.0032, 0.11, 12]} />
      </mesh>
    </group>
  );
}

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

  // Preserve and calibrate native model shaders
  useEffect(() => {
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
          // Teal hair streak
          else if (name.includes('material.007')) {
            mat.transparent = false;
            mat.depthWrite = true;
            mat.color.setRGB(0.18, 0.90, 0.82);
            mat.roughness = 0.38;
          } 
          // 2D facial line art
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
          // Skin
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
    const mouseX = pointer.current.x; // -1 to 1
    const mouseY = pointer.current.y; // -1 to 1

    if (groupRef.current) {
      // 1. Organic diaphragm breathing motion
      const breath = Math.sin(time * 2.2);
      groupRef.current.position.y = -1.35 + breath * 0.005;

      // 2. Forward-Facing Neutral Orientation (Math.PI / 180°)
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
    // Model and Exoskeleton both live inside this forward-facing group
    <group ref={groupRef} position={[0, -1.35, 0]} rotation={[0, Math.PI, 0]}>
      {/* 1. Native High-Fidelity Anime Character */}
      <primitive object={scene} />

      {/* 2. Top-Grade Cyberpunk Exoskeleton Rig */}
      <ExoskeletonRig />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>CALIBRATING CYBER-EXOSKELETON RIG...</span>
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
        background: 'radial-gradient(circle at 50% 36%, #2e3440 0%, #1c2028 48%, #0a0c10 100%)',
      }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
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
        
        {/* Front Key Light with Soft Cast Shadows */}
        <directionalLight 
          position={[0.35, 1.85, 1.25]} 
          intensity={2.3} 
          color="#ffeedd" 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Cool Front-Left Fill */}
        <directionalLight position={[-1.2, 1.3, 0.9]} intensity={0.8} color="#8cb4e8" />
        
        {/* Warm Bottom Bounce Light */}
        <directionalLight position={[0, 0.6, 0.8]} intensity={0.4} color="#d0a888" />
        
        {/* Dual Back Hair & Titanium Rim Lights */}
        <directionalLight position={[0, 2.3, -1.2]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[0, 2.6, 0.2]} intensity={2.2} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <AnimeCharacter pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
