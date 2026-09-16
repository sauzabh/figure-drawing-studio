'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { useStudioStore } from '@/store/useStudioStore';
import { StudioLighting } from './StudioLighting';
import { FigureModel } from './FigureModel';
import { StudyModel } from './StudyModel';
import * as THREE from 'three';

// Smooth Camera Animation Rig
function CameraRig() {
  const cameraView = useStudioStore((state) => state.cameraView);
  const mode = useStudioStore((state) => state.mode);

  const targetPos = useRef(new THREE.Vector3(1.7, 0.05, 3.4));
  const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // When in Study mode, center directly on the planar study model
    if (mode === 'study') {
      targetPos.current.set(0, 0.05, 2.6);
      lookAtPos.current.set(0, 0.05, 0);
      return;
    }

    // Centered camera presets in Pose / Drill mode
    switch (cameraView) {
      case 'front':
        targetPos.current.set(0, 0.05, 3.6);
        lookAtPos.current.set(0, 0, 0);
        break;
      case 'side':
        targetPos.current.set(3.6, 0.05, 0.05);
        lookAtPos.current.set(0, 0, 0);
        break;
      case 'back':
        targetPos.current.set(0, 0.05, -3.6);
        lookAtPos.current.set(0, 0, 0);
        break;
      case 'threeQuarter':
      default:
        targetPos.current.set(1.7, 0.05, 3.4);
        lookAtPos.current.set(0, 0, 0);
        break;
    }
  }, [cameraView, mode]);

  useFrame((state) => {
    state.camera.position.lerp(targetPos.current, 0.06);
    state.camera.lookAt(lookAtPos.current);
  });

  return null;
}

export const StudioCanvas: React.FC = () => {
  const mode = useStudioStore((state) => state.mode);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        shadows
        camera={{ position: [1.7, 0.05, 3.4], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig />
        <StudioLighting />

        {/* 3D Model: Full Figure or Planar Study Model */}
        {mode === 'study' ? <StudyModel /> : <FigureModel />}

        {/* Soft Ground Contact Shadow anchored right beneath the feet */}
        <ContactShadows
          position={[0, -1.02, 0]}
          opacity={0.32}
          scale={3.5}
          blur={1.8}
          far={3}
          color="#15171A"
        />

        {/* 360° Free Touch / Mouse Orbit Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1.8}
          maxDistance={6.0}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.75}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};
