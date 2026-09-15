'use client';

import React, { useMemo } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import * as THREE from 'three';

export const StudyModel: React.FC = () => {
  const { studyRegion, peelDepth } = useStudioStore();

  // Color mapping based on peel depth
  const primaryColor = peelDepth > 38 ? '#E6DFCD' : peelDepth > 8 ? '#BE6E5C' : '#E3C3AC';
  const secondaryColor = peelDepth > 38 ? '#DED7C4' : peelDepth > 8 ? '#AD6151' : '#DEB9A0';
  const accentColor = peelDepth > 38 ? '#CFC8B4' : peelDepth > 8 ? '#9C574A' : '#CFA98E';

  const matA = useMemo(
    () => new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.55, metalness: 0.05 }),
    [primaryColor]
  );
  const matB = useMemo(
    () => new THREE.MeshStandardMaterial({ color: secondaryColor, roughness: 0.55, metalness: 0.05 }),
    [secondaryColor]
  );
  const matC = useMemo(
    () => new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.6, metalness: 0.05 }),
    [accentColor]
  );

  return (
    <group position={[0, 0.5, 0]}>
      {/* 1. PLANAR SKULL STUDY */}
      {studyRegion === 'Skull' && (
        <group name="SkullStudy">
          {/* Cranial Sphere Mass */}
          <mesh position={[0, 0.55, -0.05]} material={matA} castShadow>
            <sphereGeometry args={[0.48, 16, 16]} />
          </mesh>
          {/* Frontal Brow Plane */}
          <mesh position={[0, 0.45, 0.38]} material={matB} castShadow>
            <boxGeometry args={[0.48, 0.22, 0.12]} />
          </mesh>
          {/* Zygomatic Cheek Facets */}
          <mesh position={[-0.26, 0.28, 0.32]} rotation={[0, 0.35, 0]} material={matC} castShadow>
            <boxGeometry args={[0.22, 0.18, 0.14]} />
          </mesh>
          <mesh position={[0.26, 0.28, 0.32]} rotation={[0, -0.35, 0]} material={matC} castShadow>
            <boxGeometry args={[0.22, 0.18, 0.14]} />
          </mesh>
          {/* Dental Arch / Maxilla */}
          <mesh position={[0, 0.2, 0.36]} material={matB} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.15, 12]} />
          </mesh>
          {/* Mandible / Jaw Wedge */}
          <mesh position={[0, -0.05, 0.3]} material={matA} castShadow>
            <boxGeometry args={[0.34, 0.25, 0.32]} />
          </mesh>
        </group>
      )}

      {/* 2. BLOCK HAND STUDY */}
      {studyRegion === 'Hand' && (
        <group name="HandStudy" rotation={[0.4, 0, 0]}>
          {/* Wrist / Carpal block */}
          <mesh position={[0, -0.4, 0]} material={matC} castShadow>
            <boxGeometry args={[0.4, 0.22, 0.18]} />
          </mesh>
          {/* Metacarpal Palm Arch */}
          <mesh position={[0, 0, 0]} material={matA} castShadow>
            <boxGeometry args={[0.5, 0.55, 0.16]} />
          </mesh>
          {/* Thenar Thumb Mound */}
          <mesh position={[-0.32, -0.1, 0.04]} rotation={[0, 0, 0.35]} material={matB} castShadow>
            <boxGeometry args={[0.2, 0.38, 0.18]} />
          </mesh>
          {/* Thumb Digits */}
          <mesh position={[-0.45, 0.18, 0.08]} rotation={[0, 0, 0.55]} material={matA} castShadow>
            <boxGeometry args={[0.12, 0.35, 0.12]} />
          </mesh>
          {/* Index Finger Segment */}
          <mesh position={[-0.18, 0.52, 0]} material={matB} castShadow>
            <boxGeometry args={[0.11, 0.48, 0.11]} />
          </mesh>
          {/* Middle Finger Segment */}
          <mesh position={[-0.06, 0.58, 0]} material={matA} castShadow>
            <boxGeometry args={[0.11, 0.56, 0.11]} />
          </mesh>
          {/* Ring Finger Segment */}
          <mesh position={[0.06, 0.53, 0]} material={matB} castShadow>
            <boxGeometry args={[0.11, 0.5, 0.11]} />
          </mesh>
          {/* Pinky Finger Segment */}
          <mesh position={[0.18, 0.44, 0]} material={matA} castShadow>
            <boxGeometry args={[0.1, 0.38, 0.1]} />
          </mesh>
        </group>
      )}

      {/* 3. WEDGE FOOT STUDY */}
      {studyRegion === 'Foot' && (
        <group name="FootStudy" position={[0, -0.4, 0]}>
          {/* Calcaneus (Heel Mass) */}
          <mesh position={[0, 0.22, -0.38]} material={matA} castShadow>
            <boxGeometry args={[0.34, 0.35, 0.42]} />
          </mesh>
          {/* Talus & Ankle Bridge */}
          <mesh position={[0, 0.45, -0.15]} material={matC} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.32]} />
          </mesh>
          {/* Medial Arch Wedge */}
          <mesh position={[0, 0.18, 0.12]} rotation={[0.2, 0, 0]} material={matB} castShadow>
            <boxGeometry args={[0.42, 0.24, 0.65]} />
          </mesh>
          {/* Metatarsal Ball Pad */}
          <mesh position={[0, 0.05, 0.48]} material={matA} castShadow>
            <boxGeometry args={[0.48, 0.16, 0.3]} />
          </mesh>
        </group>
      )}

      {/* 4. RIBCAGE & SCAPULAR STUDY */}
      {studyRegion === 'Ribcage' && (
        <group name="RibcageStudy">
          {/* Thoracic Oval Mass */}
          <mesh position={[0, 0.3, 0]} material={matA} castShadow>
            <sphereGeometry args={[0.55, 20, 20]} />
          </mesh>
          {/* Anterior Sternum Shelf */}
          <mesh position={[0, 0.38, 0.48]} material={matB} castShadow>
            <boxGeometry args={[0.16, 0.5, 0.1]} />
          </mesh>
          {/* Left & Right Scapulae */}
          <mesh position={[-0.32, 0.4, -0.45]} rotation={[0, -0.2, 0]} material={matC} castShadow>
            <boxGeometry args={[0.26, 0.38, 0.06]} />
          </mesh>
          <mesh position={[0.32, 0.4, -0.45]} rotation={[0, 0.2, 0]} material={matC} castShadow>
            <boxGeometry args={[0.26, 0.38, 0.06]} />
          </mesh>
        </group>
      )}

      {/* 5. PELVIS BOWL STUDY */}
      {studyRegion === 'Pelvis' && (
        <group name="PelvisStudy">
          {/* Sacral Wedge Triangle */}
          <mesh position={[0, 0.35, -0.32]} material={matC} castShadow>
            <cylinderGeometry args={[0.15, 0.05, 0.35, 10]} />
          </mesh>
          {/* Iliac Crest Wings */}
          <mesh position={[-0.38, 0.32, 0]} rotation={[0, 0.2, 0]} material={matA} castShadow>
            <boxGeometry args={[0.24, 0.45, 0.4]} />
          </mesh>
          <mesh position={[0.38, 0.32, 0]} rotation={[0, -0.2, 0]} material={matA} castShadow>
            <boxGeometry args={[0.24, 0.45, 0.4]} />
          </mesh>
          {/* Pubic Arch */}
          <mesh position={[0, 0.05, 0.3]} material={matB} castShadow>
            <boxGeometry args={[0.3, 0.25, 0.18]} />
          </mesh>
        </group>
      )}

      {/* 6. KNEE COMPLEX STUDY */}
      {studyRegion === 'Knee' && (
        <group name="KneeStudy">
          {/* Femoral Shaft & Condyles */}
          <mesh position={[0, 0.5, 0]} material={matA} castShadow>
            <cylinderGeometry args={[0.22, 0.32, 0.6, 16]} />
          </mesh>
          {/* Patella */}
          <mesh position={[0, 0.12, 0.26]} material={matB} castShadow>
            <sphereGeometry args={[0.14, 14, 14]} />
          </mesh>
          {/* Patellar Ligament */}
          <mesh position={[0, -0.1, 0.22]} material={matC} castShadow>
            <boxGeometry args={[0.1, 0.28, 0.08]} />
          </mesh>
          {/* Tibia Head */}
          <mesh position={[0, -0.4, 0]} material={matA} castShadow>
            <cylinderGeometry args={[0.28, 0.18, 0.55, 16]} />
          </mesh>
        </group>
      )}

      {/* 7. SHOULDER & DELTOID STUDY */}
      {studyRegion === 'Shoulder' && (
        <group name="ShoulderStudy">
          {/* Clavicle & Acromion Arch */}
          <mesh position={[0, 0.55, 0]} material={matC} castShadow>
            <boxGeometry args={[0.7, 0.1, 0.2]} />
          </mesh>
          {/* Humerus Ball Joint */}
          <mesh position={[0.2, 0.35, 0]} material={matB} castShadow>
            <sphereGeometry args={[0.24, 16, 16]} />
          </mesh>
          {/* Deltoid Epaulet Cap */}
          <mesh position={[0.28, 0.25, 0.04]} material={matA} castShadow>
            <boxGeometry args={[0.38, 0.5, 0.32]} />
          </mesh>
          {/* Pectoral Insertion Shelf */}
          <mesh position={[-0.2, 0.2, 0.1]} material={matB} castShadow>
            <boxGeometry args={[0.4, 0.35, 0.15]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
