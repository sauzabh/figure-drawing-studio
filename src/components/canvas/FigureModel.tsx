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

  // Opacity blending logic matching REFERENCE.html
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

  // Dims figure when a region is isolated
  const baseDim = isolatedRegion ? 0.25 : 1.0;

  // PBR materials for lifelike studio lighting and shadow terminators
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#DFDDD8'),
        roughness: 0.52,
        metalness: 0.04,
        transparent: true,
        opacity: skinOp * baseDim,
        depthWrite: skinOp > 0.7,
      }),
    [skinOp, baseDim]
  );

  const muscleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#B86250'),
        roughness: 0.62,
        metalness: 0.08,
        transparent: true,
        opacity: muscleOp * baseDim,
        depthWrite: muscleOp > 0.5,
      }),
    [muscleOp, baseDim]
  );

  const boneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EAE4D2'),
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
        color: new THREE.Color('#4B5563'),
        wireframe: true,
        transparent: true,
        opacity: 0.25 * baseDim,
      }),
    [baseDim]
  );

  // Smooth rotation and tilt based on pose and scrub
  useFrame(() => {
    if (!groupRef.current) return;
    const targetTilt = (currentPose.tilt + (scrubProgress - 18) / 14) * (Math.PI / 180);
    const targetFlip = currentPose.flip;

    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetTilt, 0.1);
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetFlip, 0.1);
  });

  return (
    <group ref={groupRef} position={[0, 0.04, 0]}>
      {/* ========================================================================= */}
      {/* 1. SKELETAL CORE LAYER                                                    */}
      {/* ========================================================================= */}
      {boneOp > 0.01 && (
        <group name="SkeletonCore">
          {/* Cranium & Facial Skeleton */}
          <mesh position={[0, 0.78, 0]} material={boneMaterial} castShadow>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[0, 0.70, 0.03]} material={boneMaterial}>
            <boxGeometry args={[0.09, 0.08, 0.09]} />
          </mesh>

          {/* Cervical & Thoracic Spine */}
          <mesh position={[0, 0.45, -0.03]} material={boneMaterial}>
            <cylinderGeometry args={[0.02, 0.025, 0.45, 10]} />
          </mesh>

          {/* Clavicle Arch */}
          <mesh position={[0, 0.55, 0.02]} rotation={[0, 0, Math.PI / 2]} material={boneMaterial}>
            <cylinderGeometry args={[0.014, 0.014, 0.4, 8]} />
          </mesh>

          {/* Sternum & Ribcage Cage */}
          <mesh position={[0, 0.38, 0]} material={boneMaterial} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>

          {/* Pelvis Bowl & Sacrum */}
          <mesh position={[0, 0.05, 0]} material={boneMaterial} castShadow>
            <cylinderGeometry args={[0.19, 0.13, 0.19, 16]} />
          </mesh>

          {/* Femur (Thigh bones) */}
          <mesh position={[-0.11, -0.28, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.028, 0.03, 0.52, 10]} />
          </mesh>
          <mesh position={[0.11, -0.28, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.028, 0.03, 0.52, 10]} />
          </mesh>

          {/* Patella (Knee joints) */}
          <mesh position={[-0.11, -0.56, 0.03]} material={boneMaterial}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.11, -0.56, 0.03]} material={boneMaterial}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>

          {/* Tibia & Fibula (Lower leg bones) */}
          <mesh position={[-0.11, -0.76, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.026, 0.022, 0.5, 10]} />
          </mesh>
          <mesh position={[0.11, -0.76, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.026, 0.022, 0.5, 10]} />
          </mesh>

          {/* Humerus (Arm bones) */}
          <mesh position={[-0.25, 0.34, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.022, 0.022, 0.38, 8]} />
          </mesh>
          <mesh position={[0.25, 0.34, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.022, 0.022, 0.38, 8]} />
          </mesh>

          {/* Radius & Ulna (Forearms) */}
          <mesh position={[-0.28, -0.02, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.018, 0.018, 0.36, 8]} />
          </mesh>
          <mesh position={[0.28, -0.02, 0]} material={boneMaterial}>
            <cylinderGeometry args={[0.018, 0.018, 0.36, 8]} />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 2. MUSCULATURE / ÉCORCHÉ LAYER                                            */}
      {/* ========================================================================= */}
      {muscleOp > 0.01 && (
        <group name="Muscles">
          {/* Neck (Sternocleidomastoid & Trapezius) */}
          <mesh position={[0, 0.64, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.058, 0.075, 0.15, 14]} />
          </mesh>

          {/* Deltoids (Shoulder epaulets) */}
          <mesh position={[-0.25, 0.5, 0]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.078, 14, 14]} />
          </mesh>
          <mesh position={[0.25, 0.5, 0]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.078, 14, 14]} />
          </mesh>

          {/* Pectoralis Major (Chest plates) */}
          <mesh position={[-0.08, 0.43, 0.1]} rotation={[0.08, 0, 0]} material={muscleMaterial} castShadow>
            <boxGeometry args={[0.14, 0.13, 0.06]} />
          </mesh>
          <mesh position={[0.08, 0.43, 0.1]} rotation={[0.08, 0, 0]} material={muscleMaterial} castShadow>
            <boxGeometry args={[0.14, 0.13, 0.06]} />
          </mesh>

          {/* Rectus Abdominis & Serratus (Core) */}
          <mesh position={[0, 0.24, 0.02]} material={muscleMaterial} castShadow>
            <boxGeometry args={[0.24, 0.26, 0.16]} />
          </mesh>

          {/* Gluteus Maximus & Medius (Hips) */}
          <mesh position={[-0.1, 0.02, -0.05]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.12, 14, 14]} />
          </mesh>
          <mesh position={[0.1, 0.02, -0.05]} material={muscleMaterial} castShadow>
            <sphereGeometry args={[0.12, 14, 14]} />
          </mesh>

          {/* Quadriceps & Hamstrings (Thighs) */}
          <mesh position={[-0.11, -0.28, 0.01]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.095, 0.065, 0.54, 16]} />
          </mesh>
          <mesh position={[0.11, -0.28, 0.01]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.095, 0.065, 0.54, 16]} />
          </mesh>

          {/* Gastrocnemius (Calf bellies) */}
          <mesh position={[-0.11, -0.74, -0.02]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.068, 0.04, 0.5, 14]} />
          </mesh>
          <mesh position={[0.11, -0.74, -0.02]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.068, 0.04, 0.5, 14]} />
          </mesh>

          {/* Biceps & Triceps (Upper arms) */}
          <mesh position={[-0.25, 0.32, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.052, 0.044, 0.36, 12]} />
          </mesh>
          <mesh position={[0.25, 0.32, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.052, 0.044, 0.36, 12]} />
          </mesh>

          {/* Forearm Brachioradialis group */}
          <mesh position={[-0.28, -0.02, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.044, 0.032, 0.34, 12]} />
          </mesh>
          <mesh position={[0.28, -0.02, 0]} material={muscleMaterial} castShadow>
            <cylinderGeometry args={[0.044, 0.032, 0.34, 12]} />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 3. SURFACE SKIN LAYER (Sculpted Academic Form)                            */}
      {/* ========================================================================= */}
      {skinOp > 0.01 && (
        <group name="Skin">
          {/* Head with defined cranial & jaw contour */}
          <mesh position={[0, 0.78, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.135, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.71, 0.04]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.105, 0.09, 0.1]} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.63, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.062, 0.078, 0.15, 16]} />
          </mesh>

          {/* Torso & Ribcage */}
          <mesh position={[0, 0.40, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.32, 0.33, 0.19]} />
          </mesh>

          {/* Waist & Abdomen */}
          <mesh position={[0, 0.20, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.14, 0.15, 0.16, 16]} />
          </mesh>

          {/* Pelvis & Hips */}
          <mesh position={[0, 0.04, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.29, 0.26, 0.19]} />
          </mesh>

          {/* Shoulders */}
          <mesh position={[-0.24, 0.49, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.085, 16, 16]} />
          </mesh>
          <mesh position={[0.24, 0.49, 0]} material={skinMaterial} castShadow>
            <sphereGeometry args={[0.085, 16, 16]} />
          </mesh>

          {/* Upper Arms */}
          <mesh position={[-0.25, 0.30, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.058, 0.048, 0.36, 16]} />
          </mesh>
          <mesh position={[0.25, 0.30, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.058, 0.048, 0.36, 16]} />
          </mesh>

          {/* Forearms */}
          <mesh position={[-0.27, -0.02, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.046, 0.034, 0.35, 16]} />
          </mesh>
          <mesh position={[0.27, -0.02, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.046, 0.034, 0.35, 16]} />
          </mesh>

          {/* Hands */}
          <mesh position={[-0.28, -0.25, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.05, 0.11, 0.025]} />
          </mesh>
          <mesh position={[0.28, -0.25, 0]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.05, 0.11, 0.025]} />
          </mesh>

          {/* Thighs (Tapered upper legs) */}
          <mesh position={[-0.11, -0.28, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.10, 0.068, 0.55, 20]} />
          </mesh>
          <mesh position={[0.11, -0.28, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.10, 0.068, 0.55, 20]} />
          </mesh>

          {/* Calves & Shins */}
          <mesh position={[-0.11, -0.74, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.07, 0.042, 0.54, 18]} />
          </mesh>
          <mesh position={[0.11, -0.74, 0]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.07, 0.042, 0.54, 18]} />
          </mesh>

          {/* Feet */}
          <mesh position={[-0.11, -0.96, 0.05]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.08, 0.06, 0.19]} />
          </mesh>
          <mesh position={[0.11, -0.96, 0.05]} material={skinMaterial} castShadow>
            <boxGeometry args={[0.08, 0.06, 0.19]} />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 4. X-RAY INNER LINE OF ACTION                                             */}
      {/* ========================================================================= */}
      {isXRay && (
        <mesh position={[0, -0.05, 0]} material={xrayMaterial}>
          <cylinderGeometry args={[0.16, 0.10, 1.6, 12]} />
        </mesh>
      )}

      {/* ========================================================================= */}
      {/* 5. 3D INTERACTIVE REGION HOTSPOTS (Centered on anatomical landmarks)     */}
      {/* ========================================================================= */}
      <group name="InteractiveHotspots">
        {/* Skull Hotspot */}
        <mesh
          position={[0, 0.78, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Skull');
          }}
          visible={false}
        >
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Ribcage Hotspot */}
        <mesh
          position={[0, 0.38, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Ribcage');
          }}
          visible={false}
        >
          <boxGeometry args={[0.38, 0.38, 0.28]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Pelvis Hotspot */}
        <mesh
          position={[0, 0.04, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Pelvis');
          }}
          visible={false}
        >
          <boxGeometry args={[0.35, 0.32, 0.26]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Knee Hotspot */}
        <mesh
          position={[0, -0.56, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsolatedRegion('Knee');
          }}
          visible={false}
        >
          <boxGeometry args={[0.34, 0.22, 0.2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
};
