export type ChapterId = 'prologue' | 'philosophy' | 'vault' | 'uplink';

export type CharacterMood = 'curious' | 'proud' | 'focused' | 'playful';

export interface DialogueBeat {
  id: string;
  chapter: ChapterId;
  speaker: string;
  title: string;
  text: string;
  mood: CharacterMood;
  cameraOffset: [number, number, number]; // [x, y, z] target relative to base
  characterLookAtOffset: [number, number]; // [yaw, pitch]
  actionPrompt?: {
    label: string;
    targetChapter?: ChapterId;
    scrollToId?: string;
  };
}

export const STORY_BEATS: DialogueBeat[] = [
  {
    id: 'intro_01',
    chapter: 'prologue',
    speaker: 'iKi // VIRTUAL CORE',
    title: 'ACT I // THE ENCOUNTER',
    text: "Welcome to my digital runtime. I'm iKi — WebGL Performance Architect & Systems Engineer. I bridge complex GPU compute with zero-waste web experiences.",
    mood: 'curious',
    cameraOffset: [0, 0.05, 0.72],
    characterLookAtOffset: [0, 0],
    actionPrompt: {
      label: 'LEARN THE PHILOSOPHY →',
      targetChapter: 'philosophy',
    },
  },
  {
    id: 'philo_02',
    chapter: 'philosophy',
    speaker: 'iKi // VIRTUAL CORE',
    title: 'ACT II // ZERO-WASTE COMPUTE',
    text: "My engineering rule: Zero GC pauses, 60 FPS locked frame budgets, and maximum memory yield. Every shader and buffer is tuned down to the register.",
    mood: 'focused',
    cameraOffset: [0.08, 0.06, 0.75],
    characterLookAtOffset: [-0.08, 0.04],
    actionPrompt: {
      label: 'INSPECT THE VAULT →',
      targetChapter: 'vault',
      scrollToId: 'case-studies',
    },
  },
  {
    id: 'vault_03',
    chapter: 'vault',
    speaker: 'iKi // VIRTUAL CORE',
    title: 'ACT III // THE PROJECT VAULT',
    text: "Here lie the breakthroughs: One-sweep GPU Radix Sorts in WGSL, zero-copy VRAM paging, and WebGPU compute pipelines. Click any artifact to inspect the architecture.",
    mood: 'proud',
    cameraOffset: [-0.06, 0.04, 0.70],
    characterLookAtOffset: [0.12, -0.06],
    actionPrompt: {
      label: 'OPEN DIRECT UPLINK →',
      targetChapter: 'uplink',
      scrollToId: 'contact',
    },
  },
  {
    id: 'uplink_04',
    chapter: 'uplink',
    speaker: 'iKi // VIRTUAL CORE',
    title: 'ACT IV // SECURE UPLINK',
    text: "Ready to engineer the next generation of spatial computing or WebGPU infrastructure? Transmit a packet directly to my terminal below.",
    mood: 'playful',
    cameraOffset: [0, 0.05, 0.74],
    characterLookAtOffset: [0, 0.02],
    actionPrompt: {
      label: 'RESTART STORY ↺',
      targetChapter: 'prologue',
    },
  },
];
