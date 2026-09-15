'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStudioStore } from '@/store/useStudioStore';
import * as THREE from 'three';

export const StudioLighting: React.FC = () => {
  const lightAngle = useStudioStore((state) => state.lightAngle);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!dirLightRef.current) return;

    // Convert polar angle (-180 to 180) to radians
    const rad = ((lightAngle - 90) * Math.PI) / 180;
    const distance = 4.5;
    const targetX = Math.cos(rad) * distance;
    const targetZ = Math.sin(rad) * distance;
    const targetY = Math.abs(lightAngle) > 90 ? 1.5 : 3.0; // elevated key light

    // Smoothly interpolate light position
    dirLightRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
  });

  return (
    <>
      {/* Soft Ambient Fill to keep shadow details readable */}
      <ambientLight intensity={0.65} color="#FFFFFF" />

      {/* Hemispherical light: warm light from ceiling, cool grey bounce from floor */}
      <hemisphereLight
        args={['#F7F6F4', '#D5D5D2', 0.45]}
        position={[0, 5, 0]}
      />

      {/* Orbital Key Light casting directional form shadows */}
      <directionalLight
        ref={dirLightRef}
        position={[3, 3, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={3}
        shadow-camera-bottom={-1}
      />

      {/* Subtle Rim / Hair Light from behind for silhouette separation */}
      <directionalLight
        position={[0, 2.5, -4]}
        intensity={0.4}
        color="#F0EFED"
      />
    </>
  );
};
