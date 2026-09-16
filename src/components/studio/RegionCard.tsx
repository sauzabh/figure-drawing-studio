'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { REGIONS } from '@/data/anatomy';
import { X, ArrowRight } from 'lucide-react';

export const RegionCard: React.FC = () => {
  const { isolatedRegion, setIsolatedRegion, enterStudyForRegion } = useStudioStore();

  if (!isolatedRegion) return null;

  const regionInfo = REGIONS[isolatedRegion] || {
    id: isolatedRegion,
    name: isolatedRegion,
    shortLabel: isolatedRegion,
    note: 'Primary anatomical landmark structure.',
    planes: [],
    keyBones: [],
    keyMuscles: [],
    hotspot: { x: 0, y: 0, w: 0, h: 0 },
  };

  return (
    <div className="fixed right-[140px] top-[160px] w-[290px] bg-studio-surface rounded-card shadow-card p-6 flex flex-col gap-3.5 z-30 pointer-events-auto transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-semibold text-studio-ink tracking-[-0.01em]">
          {regionInfo.shortLabel}
        </h3>
        <button
          onClick={() => setIsolatedRegion(null)}
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-studio-tertiary hover:text-studio-ink hover:bg-studio-track transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Anatomy Educational Note */}
      <p className="text-[13px] text-studio-secondary leading-[1.6]">
        {regionInfo.note}
      </p>

      {/* Key Planar Masses */}
      {regionInfo.planes.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-studio-tertiary">
            Major Planes
          </span>
          <div className="flex flex-wrap gap-1">
            {regionInfo.planes.slice(0, 3).map((plane) => (
              <span
                key={plane}
                className="text-[11px] bg-studio-track text-studio-secondary px-2 py-0.5 rounded-md"
              >
                {plane}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-[1px] bg-studio-subtle my-1" />

      {/* Study Button Action */}
      <button
        onClick={() => enterStudyForRegion(isolatedRegion)}
        className="flex items-center justify-between text-studio-ink hover:text-studio-secondary transition-colors cursor-pointer group"
      >
        <span className="text-[13px] font-medium">Study this region</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
