---
name: webgl-cinematic-character-animation
description: >-
  Production guidelines for orchestrating real-time cinematic character animations, interactive emotional state
  machines, secondary hair dynamics, and lifelike responsiveness in WebGL and React Three Fiber.
---

# WebGL Cinematic Character Animation & State Machine Standard

This skill establishes the architecture for driving living, interactive 3D character performances in WebGL, React Three Fiber, and Three.js.

---

## 1. Living State Machine Architecture

A character should never be frozen in a repetitive static loop. The runtime controller manages transitions across five dynamic behavioral states:

State            | Head Dynamics                                | Facial Expression              | Eye Behavior
:--------------- | :------------------------------------------- | :----------------------------- | :------------------------------
`IDLE_LIVING`    | Diaphragm breathing, subtle organic drift    | Relaxed, gentle micro-parting  | Active cursor tracking, saccades
`HAPPY_GREET`    | Inquisitive tilt ($+14^\circ$), rhythmic nod | Eyebrows arch, subtle smile    | Warm squint (0.65 eyelid scale)
`SPEECH_CADENCE` | Rhythmic vocal emphasis nodding              | Lip viseme motion, mobile jaw  | Direct interactive eye contact
`CONTEMPLATIVE`  | Tilted up-right ($+8^\circ$), slowed breath  | Asymmetric furrowed brow       | Wandering upper gaze saccades
`TURNTABLE_360`  | Continuous $360^\circ$ inspection yaw        | Neutral focused posture        | Forward-locked gaze

---

## 2. Interactive Gesture Blending & Kinematics

All skeletal transitions between states must utilize smooth spherical linear interpolation (SLERP) with critical damping ($\zeta = 1.0$) to avoid snapping or sudden mechanical shifts:
$$\mathbf{q}(t) = \text{slerp}(\mathbf{q}_{current}, \mathbf{q}_{target}, 1 - e^{-\lambda \Delta t})$$

---

## 3. Secondary Mass-Spring Physics for Hair Strands

In Three.js `useFrame`:
```typescript
// Inertial lag on hair mesh groups
const targetHairLag = -pointerVelocityX * 0.15 + Math.sin(time * 2.8) * 0.02;
currentHairRotation.z = THREE.MathUtils.lerp(currentHairRotation.z, targetHairLag, 8.0 * delta);
```
