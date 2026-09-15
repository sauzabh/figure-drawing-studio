'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStudioStore } from '@/store/useStudioStore';
import { POSES } from '@/data/poses';
import * as THREE from 'three';

export const FigureModel: React.FC = () => {
  const {
    selectedPoseId,
    peelDepth,
    scrubProgress,
    isolatedRegion,
    setIsolatedRegion,
  } = useStudioStore();

  const groupRef = useRef<THREE.Group>(null);
  const currentPose = POSES.find((p) => p.id === selectedPoseId) || POSES[0];

  // Opacity blending logic identical to REFERENCE.html specification
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const skinOp = peelDepth > 88 ? 0.12 : clamp(1 - peelDepth / 42);
  const muscleOp =
    peelDepth < 8
      ? 0
      : peelDepth > 72
      ? clamp(1 - (peelDepth - 72) / 30) * 0.5
      : clamp((peelDepth - 8) / 26);
  const boneOp = peelDepth < 38 ? 0 : clamp((peelDepth - 38) / 24);
  const isXRay = peelDepth > 85;

  // Global figure opacity dims when an isolated region is selected
  const baseDim = isolatedRegion ? 0.3 : 1.0;

  // Materials with PBR properties for realistic lighting response
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D9D5CF'),
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
        opacity: skinOp * baseDim,
        depthWrite: skinOp > 0.8,
      }),
    [skinOp, baseDim]
  );

  const muscleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#BE6E5C'),
        roughness: 0.65,
        metalness: 0.1,
        transparent: true,
        opacity: muscleOp * baseDim,
        depthWrite: muscleOp > 0.5,
      }),
    [muscleOp, baseDim]
  );

  const boneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E6DFCD'),
        roughness: 0.45,
        metalness: 0.05,
        transparent: true,
        opacity: boneOp * baseDim,
      }),
    [boneOp, baseDim]
  );

  const xrayMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#4A5568'),
        wireframe: true,
        transparent: true,
        opacity: 0.25 * baseDim,
      }),
    [baseDim]
  );

  // Animate pose rotation & scrub interpolation smoothly
  useFrame(() => {
    if (!groupRef.current) return;
    const targetTilt = (currentPose.tilt + (scrubProgress - 18) / 14) * (Math.PI / 180);
    const targetFlip = currentPose.flip;

    // Smoothly lerp rotation and scale
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetTilt, 0.1);
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetFlip, 0.1);
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* ========================================================================= */}
      {/* SKELETAL CORE LAYER                                                       */}
      {/* ========================================================================= */}
      {boneOp > 0.01 && (
        <group name="Skeleton">
          {/* Cranium & Jaw */}
          <mesh position={[0, 1.72, 0]} material={boneMaterial} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>
          <mesh position={[0, 1.63, 0.04]} material={boneMaterial}>
            <boxGeometry args={[0.11, 0.09, 0.12]} />
          </mesh>

          {/* Cervical & Thoracic Spine */}
          <mesh position={[0, 1.35, -0.04]} material={boneMaterial}>
            <cylinderGeometry args={[0.025, 0.03, 0.5, 12]} />
          </mesh>

          {/* Clavicles */}
          <mesh position={[0, 1.5, 0.02]} rotation={[0, 0, Math.PI / 2]} material={boneMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
          </mesh>

          {/* Sternum & Ribcage Core */}
          <mesh position={[0, 1.3, 0]} material={boneMaterial} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>

          {/* Pelvis / Iliac Crest Basin */}
          <mesh position={[0, 0.95, 0]} material={boneMaterial} castShadow>
            <cylinderGeometry args={[0.22, 0.15, 0.22, 16]} />
          </mesh>

          {/* Femur (Thigh Bones) */}
          <mesh position={[-0.13, 0.52, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.03, 0.035, 0.6, 10]} />
          </mesh>
          <mesh position={[0.13, 0.52, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.03, 0.035, 0.6, 10]} />
          </mesh>

          {/* Patella (Knee joints) */}
          <mesh position={[-0.13, 0.18, 0.04]} material={boneMaterial}>
            <sphereGeometry args={[0.035, 8, 8]} />
          </mesh>
          <mesh position={[0.13, 0.18, 0.04]} material={boneMaterial}>
            <sphereGeometry args={[0.035, 8, 8]} />
          </mesh>

          {/* Tibia & Fibula (Shin bones) */}
          <mesh position={[-0.13, -0.18, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.03, 0.025, 0.65, 10]} />
          </mesh>
          <mesh position={[0.13, -0.18, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.03, 0.025, 0.65, 10]} />
          </mesh>

          {/* Humerus (Upper arms) */}
          <mesh position={[-0.28, 1.25, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          </mesh>
          <mesh position={[0.28, 1.25, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          </mesh>

          {/* Radius & Ulna (Forearms) */}
          <mesh position={[-0.32, 0.82, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
          </mesh>
          <mesh position={[0.32, 0.82, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* MUSCULATURE / ÉCORCHÉ LAYER                                              */}
      {/* ========================================================================= */}
      {muscleOp > 0.01 && (
        <group name="Muscles">
          {/* Facial & Neck Muscles (Sternocleidomastoid) */}
          <mesh position={[0, 1.58, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.065, 0.08, 0.16, 12]} />
          </mesh>

          {/* Deltoids (Shoulder Caps) */}
          <mesh position={[-0.28, 1.44, 0]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.085, 14, 14]} />
          </mesh>
          <mesh position={[0.28, 1.44, 0]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.085, 14, 14]} />
          </mesh>

          {/* Pectoralis Major (Chest Plates) */}
          <mesh position={[-0.09, 1.36, 0.12]} rotation={[0.1, 0, 0]} material={muscleMaterial} castShadow>
            <boxGeometry args={[0.16, 0.14, 0.07]} />
          </mesh>
          <mesh position={[0.09, 1.36, 0.12]} rotation={[0.1, 0, 0]} material={muscleMaterial} castShadow>
            <boxGeometry args={[0.16, 0.14, 0.07]} />
          </mesh>

          {/* Rectus Abdominis & Obliques (Torso core) */}
          <mesh position={[0, 1.15, 0.02]} material={muscleMaterial} castShadow>
            <boxGeometry args={[0.27, 0.28, 0.19]} />
          </mesh>

          {/* Gluteal Group (Hips) */}
          <mesh position={[-0.12, 0.92, -0.05]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.13, 14, 14]} />
          </mesh>
          <mesh position={[0.12, 0.92, -0.05]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.13, 14, 14]} />
          </mesh>

          {/* Quadriceps (Thigh muscle masses) */}
          <mesh position={[-0.13, 0.54, 0.01]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.105, 0.07, 0.58, 14]} />
          </mesh>
          <mesh position={[0.13, 0.54, 0.01]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.105, 0.07, 0.58, 14]} />
          </mesh>

          {/* Gastrocnemius / Soleus (Calves) */}
          <mesh position={[-0.13, -0.16, -0.02]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.075, 0.045, 0.62, 14]} />
          </mesh>
          <mesh position={[0.13, -0.16, -0.02]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.075, 0.045, 0.62, 14]} />
          </mesh>

          {/* Biceps & Triceps (Arms) */}
          <mesh position={[-0.28, 1.22, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.42, 12]} />
          </mesh>
          <mesh position={[0.28, 1.22, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.42, 12]} />
          </mesh>

          {/* Forearm Flexors & Extensors */}
          <mesh position={[-0.32, 0.82, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.4, 12]} />
          </mesh>
          <mesh position={[0.32, 0.82, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.4, 12]} />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* SURFACE SKIN LAYER (Continuous Natural Human Form)                        */}
      {/* ========================================================================= */}
      {skinOp > 0.01 && (
        <group name="Skin">
          {/* Head & Cranium */}
          <mesh position={[0, 1.72, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.15, 24, 24]} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 1.56, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.07, 0.085, 0.18, 16]} />
          </mesh>

          {/* Torso & Ribcage */}
          <mesh position={[0, 1.32, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.36, 0.38, 0.22]} />
          </mesh>

          {/* Pelvis & Abdomen */}
          <mesh position={[0, 0.98, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.32, 0.34, 0.22]} />
          </mesh>

          {/* Left & Right Shoulders */}
          <mesh position={[-0.26, 1.42, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.095, 16, 16]} />
          </mesh>
          <mesh position={[0.26, 1.42, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.095, 16, 16]} />
          </mesh>

          {/* Arms */}
          <mesh position={[-0.28, 1.2, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.065, 0.055, 0.42, 16]} />
          </mesh>
          <mesh position={[0.28, 1.2, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.065, 0.055, 0.42, 16]} />
          </mesh>

          {/* Forearms */}
          <mesh position={[-0.31, 0.82, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.052, 0.038, 0.42, 16]} />
          </mesh>
          <mesh position={[0.31, 0.82, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.052, 0.038, 0.42, 16]} />
          </mesh>

          {/* Hands */}
          <mesh position={[-0.32, 0.54, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.055, 0.13, 0.03]} />
          </mesh>
          <mesh position={[0.32, 0.54, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.055, 0.13, 0.03]} />
          </mesh>

          {/* Thighs */}
          <mesh position={[-0.13, 0.54, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.115, 0.075, 0.62, 20]} />
          </mesh>
          <mesh position={[0.13, 0.54, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.115, 0.075, 0.62, 20]} />
          </mesh>

          {/* Lower Legs (Shins/Calves) */}
          <mesh position={[-0.13, -0.16, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.078, 0.048, 0.64, 18]} />
          </mesh>
          <mesh position={[0.13, -0.16, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.078, 0.048, 0.64, 18]} />
          </mesh>

          {/* Feet */}
          <mesh position={[-0.13, -0.52, 0.06]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.09, 0.07, 0.22]} />
          </mesh>
          <mesh position={[0.13, -0.52, 0.06]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.09, 0.07, 0.22]} />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* X-RAY INNER LINE OF ACTION (Active at 100% Peel)                          */}
      {/* ========================================================================= */}
      {isXRay && (
        <mesh position={[0, 0.8, 0]} material={xrayMaterial}>
          <cylinderGeometry args={[0.2, 0.12, 1.8, 12]} />
        </mesh>
      )}

      {/* ========================================================================= */}
      {/* 3D INTERACTIVE REGIONAL HOTSPOTS                                          */}
      {/* ========================================================================= */}
      <group name="Hotspots">
        {/* Skull Hotspot */}
        <mesh
          position={[0, 1.72, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Skull');
          }}
          visible={false}
        >
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Ribcage Hotspot */}
        <mesh
          position={[0, 1.32, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Ribcage');
          }}
          visible={false}
        >
          <boxGeometry args={[0.42, 0.42, 0.3]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Pelvis Hotspot */}
        <mesh
          position={[0, 0.95, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Pelvis');
          }}
          visible={false}
        >
          <boxGeometry args={[0.38, 0.38, 0.28]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Knee Hotspot */}
        <mesh
          position={[0, 0.18, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Knee');
          }}
          visible={false}
        >
          <boxGeometry args={[0.36, 0.24, 0.2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
};
