export interface RegionInfo {
  id: string;
  name: string;
  shortLabel: string;
  note: string;
  planes: string[];
  keyBones: string[];
  keyMuscles: string[];
  hotspot: {
    x: number; // 0-1 relative
    y: number;
    w: number;
    h: number;
  };
}

export const REGIONS: Record<string, RegionInfo> = {
  Skull: {
    id: 'Skull',
    name: 'Cranium & Facial Mass',
    shortLabel: 'Skull',
    note: 'The cranium and jaw read as two interlocking masses. Always establish the brow line, zygomatic arch, and temporal ridge before detailing features.',
    planes: [
      'Forehead plane (frontal)',
      'Temporal plane (lateral)',
      'Cheek plane (zygomatic)',
      'Jaw plane (mandible)',
    ],
    keyBones: ['Frontal bone', 'Zygomatic arch', 'Mandible', 'Maxilla', 'Occipital bone'],
    keyMuscles: ['Masseter', 'Temporalis', 'Orbicularis oculi', 'Orbicularis oris'],
    hotspot: { x: 0.385, y: 0.0, w: 0.23, h: 0.13 },
  },
  Ribcage: {
    id: 'Ribcage',
    name: 'Thoracic Cage',
    shortLabel: 'Ribcage',
    note: 'Twelve pairs of ribs tilting downward and forward. The cage is rigid and acts as an egg-like volume counterbalancing the pelvis in twists.',
    planes: [
      'Anterior chest plane (sternum)',
      'Lateral ribcage flank',
      'Posterior scapular shelf',
      'Costal arch border',
    ],
    keyBones: ['Sternum', 'Clavicle', 'Scapula', 'Costal cartilage', 'Thoracic vertebrae'],
    keyMuscles: ['Pectoralis major', 'Serratus anterior', 'Latissimus dorsi', 'Trapezius'],
    hotspot: { x: 0.25, y: 0.115, w: 0.5, h: 0.22 },
  },
  Pelvis: {
    id: 'Pelvis',
    name: 'Pelvic Girdle',
    shortLabel: 'Pelvis',
    note: 'A bony bowl that tips with the weight-bearing leg. The iliac crest and sacral triangle dictate the entire gesture line and center of gravity.',
    planes: [
      'Anterior superior iliac spine (ASIS)',
      'Pubic arch',
      'Sacral triangle (posterior)',
      'Greater trochanter plane',
    ],
    keyBones: ['Ilium', 'Ischium', 'Pubis', 'Sacrum', 'Greater trochanter'],
    keyMuscles: ['Gluteus medius', 'Gluteus maximus', 'Rectus abdominis', 'Tensor fasciae latae'],
    hotspot: { x: 0.29, y: 0.335, w: 0.42, h: 0.14 },
  },
  Knee: {
    id: 'Knee',
    name: 'Knee Complex',
    shortLabel: 'Knee',
    note: 'Two femoral condyles with the patella floating above the joint line. Notice the inward taper of the thigh contrasted with the straight tibial shaft.',
    planes: [
      'Patellar anterior facet',
      'Medial femoral condyle',
      'Lateral femoral condyle',
      'Tibial tuberosity',
    ],
    keyBones: ['Patella', 'Femur', 'Tibia', 'Fibula'],
    keyMuscles: ['Quadriceps tendon', 'Patellar ligament', 'Gastrocnemius heads', 'Iliotibial band'],
    hotspot: { x: 0.33, y: 0.63, w: 0.34, h: 0.12 },
  },
  Hand: {
    id: 'Hand',
    name: 'Carpals, Metacarpals & Digits',
    shortLabel: 'Hand',
    note: 'The palm is a curved architectural block. Fingers arch gracefully from the knuckles, tapering in three distinct phalangeal segments.',
    planes: [
      'Dorsal arch of palm',
      'Thenar eminence (thumb mound)',
      'Hypothenar eminence',
      'Phalangeal box masses',
    ],
    keyBones: ['Carpals', 'Metacarpals', 'Proximal phalanges', 'Distal phalanges'],
    keyMuscles: ['Thenar group', 'Hypothenar group', 'Lumbricals', 'Extensor digitorum tendons'],
    hotspot: { x: 0.15, y: 0.45, w: 0.15, h: 0.12 },
  },
  Foot: {
    id: 'Foot',
    name: 'Tarsus & Plantar Arch',
    shortLabel: 'Foot',
    note: 'An asymmetrical wedge. The medial longitudinal arch lifts high on the inside edge, while the lateral edge sits flat against the floor.',
    planes: [
      'Dorsal bridge',
      'Plantar arch',
      'Calcaneus (heel block)',
      'Metatarsal pad',
    ],
    keyBones: ['Calcaneus', 'Talus', 'Navicular', 'Metatarsals', 'Phalanges'],
    keyMuscles: ['Achilles tendon', 'Tibialis anterior', 'Extensor digitorum brevis', 'Plantar aponeurosis'],
    hotspot: { x: 0.28, y: 0.88, w: 0.44, h: 0.12 },
  },
  Shoulder: {
    id: 'Shoulder',
    name: 'Shoulder Girdle & Deltoid',
    shortLabel: 'Shoulder',
    note: 'The scapula floats dynamically over the ribcage. The deltoid muscle acts as an armored epaulet wrapping the ball-and-socket joint.',
    planes: [
      'Anterior clavicular deltoid',
      'Acromion lateral facet',
      'Posterior spinal deltoid',
      'Infraspinatus triangle',
    ],
    keyBones: ['Clavicle', 'Acromion process', 'Scapular spine', 'Humerus head'],
    keyMuscles: ['Anterior deltoid', 'Lateral deltoid', 'Posterior deltoid', 'Trapezius'],
    hotspot: { x: 0.18, y: 0.13, w: 0.2, h: 0.14 },
  },
};

export const REGION_LIST = [
  'Skull',
  'Hand',
  'Foot',
  'Ribcage',
  'Pelvis',
  'Knee',
  'Shoulder',
] as const;
