'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { useStudioStore, CameraPreset } from '@/store/useStudioStore';
import { StudioLighting } from './StudioLighting';
import { FigureModel } from './FigureModel';
import { StudyModel } from './StudyModel';
import * as THREE from 'three';

// Camera Animation Rig
function CameraRig() {
  const cameraView = useStudioStore((state) => state.cameraView);
  const mode = useStudioStore((state) => state.mode);

  const targetPos = useRef(new THREE.Vector3(1.6, 1.2, 2.6));
  const lookAtPos = useRef(new THREE.Vector3(0, 0.9, 0));

  useEffect(() => {
    // When in Study mode, focus on the study model at center
    if (mode === 'study') {
      targetPos.current.set(0, 0.7, 2.4);
      lookAtPos.current.set(0, 0.6, 0);
      return;
    }

    // Camera view presets in Pose / Drill mode
    switch (cameraView) {
      case 'front':
        targetPos.current.set(0, 1.05, 3.1);
        lookAtPos.current.set(0, 0.9, 0);
        break;
      case 'side':
        targetPos.current.set(3.0, 1.05, 0.1);
        lookAtPos.current.set(0, 0.9, 0);
        break;
      case 'back':
        targetPos.current.set(0, 1.05, -3.1);
        lookAtPos.current.set(0, 0.9, 0);
        break;
      case 'threeQuarter':
      default:
        targetPos.current.set(1.6, 1.15, 2.6);
        lookAtPos.current.set(0, 0.9, 0);
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
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [1.6, 1.2, 2.6], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig />
        <StudioLighting />

        {/* Dynamic 3D Models */}
        {mode === 'study' ? <StudyModel /> : <FigureModel />}

        {/* Contact Shadow on Studio Canvas Floor */}
        <ContactShadows
          position={[0, -0.75, 0]}
          opacity={0.35}
          scale={3.8}
          blur={1.8}
          far={4}
          color="#15171A"
        />

        {/* Free Touch / Mouse Orbit Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1.6}
          maxDistance={6.0}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.75}
          target={[0, 0.9, 0]}
        />
      </Canvas>
    </div>
  );
};
