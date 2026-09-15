export interface PoseData {
  id: string;
  name: string;
  category: 'Standing' | 'Contrapposto' | 'Seated' | 'Action' | 'Reclining' | 'Twist';
  description: string;
  tilt: number;
  flip: number;
  defaultView: 'threeQuarter' | 'front' | 'side' | 'back';
  scrubFrames: number; // typically 24
}

export const CATEGORIES = [
  'All',
  'Standing',
  'Contrapposto',
  'Seated',
  'Action',
  'Reclining',
  'Twist',
] as const;

export const POSES: PoseData[] = [
  {
    id: 'at-rest',
    name: 'At rest',
    category: 'Standing',
    description: 'Neutral anatomical stance with balanced weight distribution and relaxed arms.',
    tilt: 0,
    flip: 1,
    defaultView: 'front',
    scrubFrames: 24,
  },
  {
    id: 'weight-left',
    name: 'Weight left',
    category: 'Standing',
    description: 'Subtle weight shift to the left leg, engaging the left gluteus and tilting the iliac crest.',
    tilt: -2,
    flip: 1,
    defaultView: 'threeQuarter',
    scrubFrames: 24,
  },
  {
    id: 'contrapposto',
    name: 'Contrapposto',
    category: 'Contrapposto',
    description: 'Classic classical S-curve: weight-bearing right hip rises while shoulders counterbalance.',
    tilt: 2,
    flip: 1,
    defaultView: 'threeQuarter',
    scrubFrames: 24,
  },
  {
    id: 'shoulders-back',
    name: 'Shoulders back',
    category: 'Standing',
    description: 'Chest expansion highlighting the clavicle span, sternum line, and retracted scapulae.',
    tilt: -1,
    flip: -1,
    defaultView: 'front',
    scrubFrames: 24,
  },
  {
    id: 'reach-up',
    name: 'Reach up',
    category: 'Action',
    description: 'Dynamic vertical extension elevating the ribcage and rotating the right scapula upward.',
    tilt: 4,
    flip: 1,
    defaultView: 'threeQuarter',
    scrubFrames: 24,
  },
  {
    id: 'step-out',
    name: 'Step out',
    category: 'Action',
    description: 'Forward lunge establishing clear ground force vectors and tense hamstring silhouette.',
    tilt: -5,
    flip: -1,
    defaultView: 'side',
    scrubFrames: 24,
  },
  {
    id: 'half-turn',
    name: 'Half turn',
    category: 'Twist',
    description: 'Torso rotation twisting across thoracic vertebrae with the pelvis anchored forward.',
    tilt: 3,
    flip: -1,
    defaultView: 'threeQuarter',
    scrubFrames: 24,
  },
  {
    id: 'look-down',
    name: 'Look down',
    category: 'Twist',
    description: 'Cervical spine flexion casting prominent shadows beneath the jaw and across the clavicle.',
    tilt: -3,
    flip: 1,
    defaultView: 'front',
    scrubFrames: 24,
  },
  {
    id: 'seated-forward',
    name: 'Seated forward',
    category: 'Seated',
    description: '90-degree thigh fold with vertical spine showing the relationship of pelvis to ischial tuberosity.',
    tilt: 6,
    flip: 1,
    defaultView: 'side',
    scrubFrames: 24,
  },
  {
    id: 'seated-twist',
    name: 'Seated twist',
    category: 'Seated',
    description: 'Seated posture with upper body turned away, stretching the lateral abdominal wall.',
    tilt: -6,
    flip: -1,
    defaultView: 'threeQuarter',
    scrubFrames: 24,
  },
  {
    id: 'reclining',
    name: 'Reclining',
    category: 'Reclining',
    description: 'Horizontal resting pose emphasizing lateral torso compression and hip width.',
    tilt: 8,
    flip: 1,
    defaultView: 'side',
    scrubFrames: 24,
  },
  {
    id: 'reclining-open',
    name: 'Reclining open',
    category: 'Reclining',
    description: 'Open posture exposing full thoracic ribcage curvature and pectoral planes.',
    tilt: -8,
    flip: -1,
    defaultView: 'front',
    scrubFrames: 24,
  },
];
