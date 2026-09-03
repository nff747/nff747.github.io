---
name: top-grade-character-rigging
description: >-
  Industry-standard skeletal armature rigging, facial bone hierarchies, eyelid rotational arc mechanics,
  and real-time WebGL/Three.js bone transformation systems for humanoid and anime 3D models.
---

# Top-Grade 3D Character Skeletal Rigging & Facial Armature Guide

This skill specifies the architectural standards, anatomical bone hierarchies, dual-layer eyelid rotational mechanics, and real-time WebGL/Three.js skeletal driving pipelines required for photorealistic and cinematic character animation.

---

## 1. Anatomical Skeletal Hierarchy

A production-grade character armature decomposes into three unified kinematic chains:

```
Root (Base Origin: [0, 0, 0])
 └─ Spine (Lower Lumbar / Pelvic Pivot: [0, 0, 0.90])
     └─ Chest (Thoracic Ribcage: [0, 0, 1.25])
         ├─ Clavicle_L (Collarbone Left: [-0.06, 0, 1.30])
         │   └─ Shoulder_L (Upper Arm Pivot: [-0.17, 0, 1.28])
         ├─ Clavicle_R (Collarbone Right: [0.06, 0, 1.30])
         │   └─ Shoulder_R (Upper Arm Pivot: [0.17, 0, 1.28])
         └─ Neck (Cervical Vertebrae C1-C7: [0, 0, 1.34])
             └─ Head (Cranial Base Pivot: [0, 0, 1.42])
                 ├─ Eye_L (Left Optical Pivot: [-0.035, 0.045, 1.45])
                 ├─ Eye_R (Right Optical Pivot: [0.035, 0.045, 1.45])
                 ├─ Eyelid_Upper_L (Rotational Arc: [-0.035, 0.046, 1.458])
                 ├─ Eyelid_Lower_L (Support Arc: [-0.035, 0.046, 1.442])
                 ├─ Eyelid_Upper_R (Rotational Arc: [0.035, 0.046, 1.458])
                 ├─ Eyelid_Lower_R (Support Arc: [0.035, 0.046, 1.442])
                 ├─ Eyebrow_L (Emotional Arch: [-0.038, 0.050, 1.485])
                 ├─ Eyebrow_R (Emotional Arch: [0.038, 0.050, 1.485])
                 └─ Jaw (Mandible Pivot: [0, 0.025, 1.39])
                     └─ Mouth (Viseme / Lip Articulation: [0, 0.055, 1.40])
```

---

## 2. Eyelid Rotational Arc Mechanics

Standard linear scaling (`scale.y`) causes flattening and volume loss across curved 3D eye corneas. Production rigs implement **Spherical Curvilinear Rotational Arcs**:

### Mathematical Formulation
For an eyeball of radius $R$ centered at $(x_c, y_c, z_c)$:
1. The **Upper Eyelid Bone** pivots around the transverse pitch axis:
   $$\theta_{upper}(t) = \theta_{open} \cdot (1 - B(t)) + \theta_{closed} \cdot B(t)$$
   where $B(t)$ is the non-linear blink progress function:
   $$B(t) = \begin{cases}
     (t / t_{close})^2 & \text{closing (accelerating)}\\
     1.0 & \text{hold (closed)}\\
     1 - ((t - t_{hold}) / t_{open})^3 & \text{opening (cubic ease-out)}
   \end{cases}$$
2. The **Lower Eyelid Bone** provides complementary elevation (15% of upper lid travel):
   $$\theta_{lower}(t) = \theta_{rest} + 0.15 \cdot (\theta_{closed} - \theta_{open}) \cdot B(t)$$

---

## 3. Distributed Cervical & Thoracic Kinematics

Natural human motion distributes head rotation across multiple skeletal joints to prevent stiff, robotic neck pivots:
* **Head Bone**: Absorbs 55% of the total target yaw and pitch.
* **Neck Bone (Cervical Spine)**: Absorbs 30% of the total target yaw and pitch.
* **Chest Bone (Thoracic Spine)**: Absorbs 15% of the total target yaw and pitch.

$$R_{total} = R_{Chest}(0.15 \cdot \alpha) \times R_{Neck}(0.30 \cdot \alpha) \times R_{Head}(0.55 \cdot \alpha)$$

---

## 4. Optical Saccadic Look-At IK

Involuntary microscopic saccades occur every 0.8–2.2 seconds:
$$\vec{Gaze}_{L, R}(t) = \vec{Target}_{cursor} + \begin{bmatrix} \delta_x(t) \\ \delta_y(t) \\ 0 \end{bmatrix}$$
where $\delta_x, \delta_y \sim \mathcal{N}(0, \sigma^2)$ with $\sigma \approx 0.0008\,\text{m}$.

Eyes dart to acquire the visual target with high damping factor ($\zeta \approx 0.85$, latency $\tau \approx 40\,\text{ms}$), while cranial bones follow with physical inertia ($\tau \approx 180\,\text{ms}$).
