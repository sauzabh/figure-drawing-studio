'use client';

import React from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { REGION_LIST } from '@/data/anatomy';
import { ChevronLeft } from 'lucide-react';

export const StudyHeader: React.FC = () => {
  const { studyRegion, setStudyRegion, setMode } = useStudioStore();

  return (
    <>
      {/* Top Region Filter Chips */}
      <div className="absolute left-1/2 top-[92px] -translate-x-1/2 flex gap-1.5 z-20 pointer-events-auto">
        {REGION_LIST.map((region) => {
          const isActive = studyRegion === region;
          return (
            <button
              key={region}
              onClick={() => setStudyRegion(region)}
              className={`h-[32px] px-[13px] rounded-chip flex items-center text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-studio-slate text-studio-surface shadow-subtle'
                  : 'bg-studio-surface text-studio-secondary shadow-card hover:text-studio-ink'
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>

      {/* Bottom Left: Return Capsule */}
      <button
        onClick={() => setMode('pose')}
        className="absolute left-8 bottom-8 flex items-center gap-2.5 h-[44px] pl-3.5 pr-4.5 rounded-full bg-studio-surface shadow-card text-studio-ink hover:text-studio-secondary transition-colors cursor-pointer z-20 pointer-events-auto"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-[14px] font-medium">Back to full figure</span>
      </button>
    </>
  );
};
