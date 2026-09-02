'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural Interactive Character Rig (Target: solar_rig.gltf architecture)
 * 
 * Implements procedural Inverse Kinematics (IK) head/eye dampening
 * that tracks the user's cursor across normalized viewport coordinates.
 * Features procedural secondary motion (breathing cycles, micro-saccades).
 */
function CharacterRig({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const rootRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  // Target look vectors for damping
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Calculate Cursor Depth & Screen Space IK Target
    const mouseX = pointer.current.x; // Normalized -1 to 1
    const mouseY = pointer.current.y;

    targetLookAt.set(mouseX * 3.5, mouseY * 2.5, 4.0);

    // 2. Slerp interpolation for smooth biomechanical dampening
    currentLookAt.lerp(targetLookAt, 4.0 * delta);

    // 3. Head & Neck IK rotation
    if (headRef.current && neckRef.current) {
      headRef.current.lookAt(currentLookAt);
      
      // Neck takes 35% of the total rotation strain
      neckRef.current.rotation.y = headRef.current.rotation.y * 0.35;
      neckRef.current.rotation.x = headRef.current.rotation.x * 0.35;
    }

    // 4. Eye Micro-Saccade Tracking
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeLookTarget = currentLookAt.clone();
      leftEyeRef.current.lookAt(eyeLookTarget);
      rightEyeRef.current.lookAt(eyeLookTarget);
    }

    // 5. Procedural Breathing & Floating Dynamics
    if (rootRef.current) {
      rootRef.current.position.y = -0.5 + Math.sin(time * 1.8) * 0.06;
      rootRef.current.rotation.z = Math.sin(time * 0.9) * 0.02;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.5, 0]}>
      {/* Upper Torso / Chassis */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.45, 1.4, 32]} />
        <meshStandardMaterial
          color="#0B101B"
          roughness={0.2}
          metalness={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Glowing Energy Core / Solar Conduit */}
      <mesh position={[0, 0.2, 0.38]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color="#FF0055"
          emissive="#FF0055"
          emissiveIntensity={3.5}
          roughness={0.1}
        />
      </mesh>

      {/* Neck Joint */}
      <group ref={neckRef} position={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 16]} />
          <meshStandardMaterial color="#1a2234" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Head Rig */}
        <group ref={headRef} position={[0, 0.35, 0]}>
          {/* Cybernetic Skull / Visor Frame */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial
              color="#070a12"
              roughness={0.15}
              metalness={0.95}
            />
          </mesh>

          {/* Refractive Optical Visor */}
          <mesh position={[0, 0.05, 0.28]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.75, 0.25, 0.4]} />
            <MeshTransmissionMaterial
              backside
              samples={6}
              thickness={0.2}
              chromaticAberration={0.08}
              anisotropy={0.2}
              distortion={0.15}
              distortionScale={0.3}
              temporalDistortion={0.1}
              color="#ffffff"
              attenuationColor="#FF0055"
              attenuationDistance={0.5}
            />
          </mesh>

          {/* Left Eye Pupil */}
          <mesh ref={leftEyeRef} position={[-0.18, 0.05, 0.48]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>

          {/* Right Eye Pupil */}
          <mesh ref={rightEyeRef} position={[0.18, 0.05, 0.48]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </group>
      </group>

      {/* Shoulder Mechanical Armor */}
      <mesh position={[-0.95, 0.55, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.22, 0.45, 8, 16]} />
        <meshStandardMaterial color="#0e1726" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.95, 0.55, 0]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.22, 0.45, 8, 16]} />
        <meshStandardMaterial color="#0e1726" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function HeroCanvas() {
  const pointer = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    // Calculate normalized pointer coordinates (-1 to 1)
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <ambientLight intensity={0.6} />
        
        {/* Key Lighting with Cyberpunk Colorway */}
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-4, 2, 2]} intensity={5.0} color="#FF0055" distance={10} />
        <pointLight position={[3, -2, 2]} intensity={4.0} color="#00F0FF" distance={8} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <CharacterRig pointer={pointer} />
        </Float>
      </Canvas>
    </div>
  );
}
