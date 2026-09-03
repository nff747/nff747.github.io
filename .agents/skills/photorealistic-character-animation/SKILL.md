---
name: photorealistic-character-animation
description: >-
  Advanced procedural and mocap-grade biomechanical animation and Cycles photorealistic rendering system
  for 3D anime and humanoid characters.
---

# Photorealistic 3D Character Animation & Biomechanical Motion System

This skill specifies the mathematical models, multi-joint skeletal kinematics, secondary spring dynamics, and raytraced studio rendering pipelines required to produce lifelike, photorealistic 3D character animations.

---

## 1. Biomechanical Skeletal Motion Rules
* **Multi-Joint Distributed Articulation**: Human movement never pivots around a single bone. Head turns must distribute rotation:
  - 55% Cranial Head bone
  - 30% Cervical Spine (Neck)
  - 15% Thoracic Spine (Upper Chest)
* **Anticipation & Harmonic Overshoot**: Every major postural gesture must include a 2-frame anticipation in the opposite direction and a 3-frame dampened harmonic overshoot:
  $$\theta(t) = \theta_{target} + A \cdot e^{-k t} \cdot \sin(\omega t)$$
* **Physiological Eye Blinking Timing**:
  - Closing phase: 60ms (accelerating quadratic curve $t^2$)
  - Hold phase: 25ms closed
  - Opening phase: 110ms (cubic ease-out curve $1 - (1-t)^3$)
  - Cadence: Random stochastic interval between 2.2s and 5.5s, with a 28% probability of a double-blink.

---

## 2. Secondary Mass-Spring Physics (Hair & Ribbons)
Hair strands and flexible ornaments follow second-order damped harmonic oscillation driven by head acceleration:
$$\ddot{\theta}_{hair} + 2\zeta\omega_n \dot{\theta}_{hair} + \omega_n^2 \theta_{hair} = -\alpha \ddot{\phi}_{head}$$
In real-time WebGL, implement inertial lag buffers $\theta_{hair}(t) = \text{lerp}(\theta_{hair}, \theta_{head}, k_{spring}) + \text{sway}(t)$.

---

## 3. Cognitive Gaze & Saccadic Tracking
* **Eye-Lead Latency**: Eyes dart to acquire targets first ($\tau \approx 40\text{ms}$), followed by cranial reorientation ($\tau \approx 180\text{ms}$).
* **Involuntary Micro-Saccades**: High-frequency stochastic micro-drift ($\pm 0.0006\text{m}$) every 0.8 to 1.8 seconds prevents the "lifeless mannequin gaze".
