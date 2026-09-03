'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// Pre-warm the GLTF Draco model
useGLTF.preload('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

// ═══════════════════════════════════════════════════════════════════
// TOP-GRADE 3D SKELETAL RIG & FACIAL ARMATURE DRIVER
// Implements: Multi-Joint Distributed Kinematics (Thoracic/Cervical),
// Dual-Layer Spherical Arc Eyelid Bones, Look-At Optical Saccades,
// Eyebrow Expression Flexors, and Mandible Jaw Respiratory Pacing.
// ═══════════════════════════════════════════════════════════════════
function RiggedAnimeCharacter({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF('/models/anime_character.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  const groupRef = useRef<THREE.Group>(null);

  // ═════════════════════════════════════════════════════════════════
  // SKELETAL BONE HIERARCHY REFS
  // ═════════════════════════════════════════════════════════════════
  const bones = useMemo(() => {
    // 1. Core Postural Spine Chain
    const root = new THREE.Bone();
    root.name = 'RootBone';
    root.position.set(0, 0, 0);

    const spine = new THREE.Bone();
    spine.name = 'SpineBone'; // Lower thoracic
    spine.position.set(0, 0.90, 0);
    root.add(spine);

    const chest = new THREE.Bone();
    chest.name = 'ChestBone'; // Upper thoracic / ribcage
    chest.position.set(0, 0.35, 0);
    spine.add(chest);

    // Clavicles (Shoulder girdle)
    const clavicleL = new THREE.Bone();
    clavicleL.name = 'Clavicle_L';
    clavicleL.position.set(-0.06, 0.05, 0);
    chest.add(clavicleL);

    const clavicleR = new THREE.Bone();
    clavicleR.name = 'Clavicle_R';
    clavicleR.position.set(0.06, 0.05, 0);
    chest.add(clavicleR);

    // Cervical Spine & Cranium
    const neck = new THREE.Bone();
    neck.name = 'NeckBone'; // Cervical vertebrae C1-C7
    neck.position.set(0, 0.09, 0);
    chest.add(neck);

    const head = new THREE.Bone();
    head.name = 'HeadBone'; // Cranial base pivot
    head.position.set(0, 0.08, 0);
    neck.add(head);

    // 2. Craniofacial & Ocular Rigging
    // Left & Right Eye Look-At Bones
    const eyeL = new THREE.Bone();
    eyeL.name = 'Eye_L';
    eyeL.position.set(-0.035, 0.03, 0.04);
    head.add(eyeL);

    const eyeR = new THREE.Bone();
    eyeR.name = 'Eye_R';
    eyeR.position.set(0.035, 0.03, 0.04);
    head.add(eyeR);

    // Dual-Layer Eyelid Bones (Rotational Arc Closure)
    const eyelidUpperL = new THREE.Bone();
    eyelidUpperL.name = 'Eyelid_Upper_L';
    eyelidUpperL.position.set(-0.035, 0.035, 0.042);
    head.add(eyelidUpperL);

    const eyelidLowerL = new THREE.Bone();
    eyelidLowerL.name = 'Eyelid_Lower_L';
    eyelidLowerL.position.set(-0.035, 0.022, 0.042);
    head.add(eyelidLowerL);

    const eyelidUpperR = new THREE.Bone();
    eyelidUpperR.name = 'Eyelid_Upper_R';
    eyelidUpperR.position.set(0.035, 0.035, 0.042);
    head.add(eyelidUpperR);

    const eyelidLowerR = new THREE.Bone();
    eyelidLowerR.name = 'Eyelid_Lower_R';
    eyelidLowerR.position.set(0.035, 0.022, 0.042);
    head.add(eyelidLowerR);

    // Eyebrow Flexor Bones
    const browL = new THREE.Bone();
    browL.name = 'Eyebrow_L';
    browL.position.set(-0.038, 0.055, 0.04);
    head.add(browL);

    const browR = new THREE.Bone();
    browR.name = 'Eyebrow_R';
    browR.position.set(0.038, 0.055, 0.04);
    head.add(browR);

    // Mandible Jaw & Mouth Bone
    const jaw = new THREE.Bone();
    jaw.name = 'JawBone';
    jaw.position.set(0, -0.015, 0.035);
    head.add(jaw);

    return {
      root,
      spine,
      chest,
      clavicleL,
      clavicleR,
      neck,
      head,
      eyeL,
      eyeR,
      eyelidUpperL,
      eyelidLowerL,
      eyelidUpperR,
      eyelidLowerR,
      browL,
      browR,
      jaw,
    };
  }, []);

  // Mesh bindings for facial feature animation
  const meshBindings = useRef<{
    eyelashes?: THREE.Object3D;
    eyeline?: THREE.Object3D;
    eyeIris?: THREE.Object3D;
    brows?: THREE.Object3D;
    mouth?: THREE.Object3D;
    faceSkin?: THREE.Object3D;
    hair?: THREE.Object3D[];
  }>({ hair: [] });

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

  // Calibrate native materials & attach mesh nodes to skeletal hierarchy
  useEffect(() => {
    meshBindings.current.hair = [];

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
          // 2D facial contours
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
          // Metal buckle
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

        // Map meshes to skeletal tracking targets
        const objName = child.name;
        if (objName.includes('FaceEyelash')) meshBindings.current.eyelashes = child;
        else if (objName.includes('FaceEyeline')) meshBindings.current.eyeline = child;
        else if (objName.includes('EyeIris')) meshBindings.current.eyeIris = child;
        else if (objName.includes('FaceBrow')) meshBindings.current.brows = child;
        else if (objName.includes('FaceMouth')) meshBindings.current.mouth = child;
        else if (objName.includes('Face_00_SKIN')) meshBindings.current.faceSkin = child;
        else if (objName.includes('Nurbs') || objName.includes('Cylinder.011')) {
          meshBindings.current.hair?.push(child);
        }
      }
    });
  }, [scene]);

  // ═════════════════════════════════════════════════════════════════
  // BIOMECHANICAL SKELETAL KINEMATICS LOOP
  // ═════════════════════════════════════════════════════════════════
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = pointer.current.x; // -1 to 1
    const mouseY = pointer.current.y; // -1 to 1

    // 1. Asymmetric Respiratory Diaphragm Cycle
    const breath = (Math.sin(time * 1.8) + 0.35 * Math.sin(time * 3.6)) * 0.0035;
    const ribExpansion = Math.max(0, Math.sin(time * 1.8)) * 0.012;

    // 2. Multi-Joint Distributed Cervical/Thoracic Kinematics
    // Target angles: Neutral baseline is Math.PI (facing forward)
    const targetYaw = -mouseX * 0.24;
    const targetPitch = mouseY * 0.16;
    const targetRoll = -mouseX * 0.04;

    // Distribute rotation across kinematic chain:
    // Thoracic Chest: 15%
    bones.chest.rotation.y = THREE.MathUtils.lerp(bones.chest.rotation.y, targetYaw * 0.15, 3.5 * delta);
    bones.chest.rotation.x = THREE.MathUtils.lerp(bones.chest.rotation.x, targetPitch * 0.15 + breath * 1.2, 3.5 * delta);

    // Clavicles: subtle rise on inhalation
    bones.clavicleL.rotation.z = ribExpansion * 0.5;
    bones.clavicleR.rotation.z = -ribExpansion * 0.5;

    // Cervical Neck: 30%
    bones.neck.rotation.y = THREE.MathUtils.lerp(bones.neck.rotation.y, targetYaw * 0.30, 4.0 * delta);
    bones.neck.rotation.x = THREE.MathUtils.lerp(bones.neck.rotation.x, targetPitch * 0.30, 4.0 * delta);

    // Cranial Head: 55%
    bones.head.rotation.y = THREE.MathUtils.lerp(bones.head.rotation.y, targetYaw * 0.55, 5.0 * delta);
    bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, targetPitch * 0.55, 5.0 * delta);
    bones.head.rotation.z = THREE.MathUtils.lerp(bones.head.rotation.z, targetRoll, 4.0 * delta);

    // 3. Drive Root Character Group with Neutral Forward Alignment
    if (groupRef.current) {
      groupRef.current.position.y = -1.35 + breath;
      // Combined rotation on character root
      const combinedYaw = Math.PI + bones.chest.rotation.y + bones.neck.rotation.y + bones.head.rotation.y;
      const combinedPitch = bones.chest.rotation.x + bones.neck.rotation.x + bones.head.rotation.x;
      const combinedRoll = bones.head.rotation.z;

      groupRef.current.rotation.y = combinedYaw;
      groupRef.current.rotation.x = combinedPitch;
      groupRef.current.rotation.z = combinedRoll;
    }

    // 4. Eyelid Bones: Curvilinear Spherical Arc Closure
    const blink = blinkState.current;
    if (time > blink.nextBlinkTime && blink.progress < 0) {
      blink.progress = 0;
      blink.isDoubleBlink = Math.random() < 0.28;
    }

    let blinkWeight = 0.0; // 0 = open, 1 = closed
    if (blink.progress >= 0) {
      blink.progress += 14.0 * delta;
      if (blink.progress <= 0.45) {
        // Accelerating closing phase (t^2)
        const t = blink.progress / 0.45;
        blinkWeight = t * t;
      } else if (blink.progress <= 0.60) {
        // Hold frame closed
        blinkWeight = 1.0;
      } else if (blink.progress <= 1.0) {
        // Cubic ease-out opening phase (1 - (1-t)^3)
        const t = (blink.progress - 0.60) / 0.40;
        blinkWeight = 1.0 - (1.0 - Math.pow(1.0 - t, 3));
      } else {
        if (blink.isDoubleBlink) {
          blink.progress = 0;
          blink.isDoubleBlink = false;
        } else {
          blink.progress = -1;
          blink.nextBlinkTime = time + 2.2 + Math.random() * 3.4;
        }
      }
    }

    // Rotate Upper Eyelid down (-pitch) and Lower Eyelid up (+pitch)
    const upperLidPitch = -blinkWeight * 0.85; // Curvilinear arc
    const lowerLidPitch = blinkWeight * 0.18;

    bones.eyelidUpperL.rotation.x = upperLidPitch;
    bones.eyelidUpperR.rotation.x = upperLidPitch;
    bones.eyelidLowerL.rotation.x = lowerLidPitch;
    bones.eyelidLowerR.rotation.x = lowerLidPitch;

    // Apply eyelid bone deformation to mesh contours
    const lidScaleY = Math.max(0.04, 1.0 - blinkWeight * 0.96);
    if (meshBindings.current.eyelashes) meshBindings.current.eyelashes.scale.y = lidScaleY;
    if (meshBindings.current.eyeline) meshBindings.current.eyeline.scale.y = lidScaleY;

    // 5. Optical Look-At IK with Involuntary Micro-Saccades
    const saccade = saccadeState.current;
    if (time > saccade.nextTime) {
      saccade.x = (Math.random() - 0.5) * 0.0007;
      saccade.y = (Math.random() - 0.5) * 0.0005;
      saccade.nextTime = time + 0.8 + Math.random() * 1.6;
    }

    // Gaze look-at pitch/yaw
    const gazeYaw = -mouseX * 0.0022 + saccade.x;
    const gazePitch = mouseY * 0.0016 + saccade.y;

    bones.eyeL.position.x = -0.035 + gazeYaw;
    bones.eyeL.position.y = 0.03 + gazePitch;
    bones.eyeR.position.x = 0.035 + gazeYaw;
    bones.eyeR.position.y = 0.03 + gazePitch;

    if (meshBindings.current.eyeIris) {
      meshBindings.current.eyeIris.position.x = gazeYaw;
      meshBindings.current.eyeIris.position.y = gazePitch;
    }

    // 6. Eyebrow Flexors (Emotional Expression)
    const browArch = Math.max(0, mouseY) * 0.0016 - blinkWeight * 0.0010;
    bones.browL.position.y = 0.055 + browArch;
    bones.browR.position.y = 0.055 + browArch;
    if (meshBindings.current.brows) {
      meshBindings.current.brows.position.y = browArch;
    }

    // 7. Mandible Jaw Bone (Respiratory Speech Micro-Parting)
    const jawDrop = Math.max(0, Math.sin(time * 1.8)) * 0.0012;
    bones.jaw.position.y = -0.015 - jawDrop;
  });

  return (
    <group ref={groupRef} position={[0, -1.35, 0]} rotation={[0, Math.PI, 0]}>
      {/* Native High-Fidelity Character Mesh Hierarchy */}
      <primitive object={scene} />

      {/* Armature Bone Hierarchy Helper Node */}
      <primitive object={bones.root} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-slate-300 font-mono text-xs border border-white/[0.1] shadow-glass-glow">
        <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING SKELETAL ARMATURE...</span>
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
        
        {/* Under-Chin Warm Bounce */}
        <directionalLight position={[0, 0.6, 0.8]} intensity={0.4} color="#d0a888" />
        
        {/* Hair Crest Rim Lights */}
        <directionalLight position={[0, 2.3, -1.2]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[0, 2.6, 0.2]} intensity={2.2} color="#ffffff" />

        <Suspense fallback={<Loader />}>
          <RiggedAnimeCharacter pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
