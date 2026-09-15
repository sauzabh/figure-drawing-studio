'use client';

import React from 'react';
import { useStudioStore, CameraPreset } from '@/store/useStudioStore';

export const CameraPresets: React.FC = () => {
  const { cameraView, setCameraView } = useStudioStore();

  const PRESETS: { glyph: string; key: CameraPreset; label: string }[] = [
    { glyph: '¾', key: 'threeQuarter', label: 'Three-quarter view' },
    { glyph: 'F', key: 'front', label: 'Front view' },
    { glyph: 'S', key: 'side', label: 'Side profile' },
    { glyph: 'B', key: 'back', label: 'Back view' },
  ];

  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 items-center z-20 pointer-events-auto">
      {PRESETS.map(({ glyph, key, label }) => {
        const isActive = cameraView === key;
        return (
          <button
            key={key}
            onClick={() => setCameraView(key)}
            title={label}
            className={`w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[13px] font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-studio-slate text-studio-surface shadow-subtle'
                : 'text-studio-tertiary hover:text-studio-ink hover:bg-studio-track'
            }`}
          >
            {glyph}
          </button>
        );
      })}
    </div>
  );
};
