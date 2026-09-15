'use client';

import React, { useRef, useEffect } from 'react';
import { useStudioStore, StudioMode } from '@/store/useStudioStore';
import { POSES } from '@/data/poses';
import { REGIONS } from '@/data/anatomy';
import { Search, Maximize2 } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    mode,
    setMode,
    selectedPoseId,
    studyRegion,
    scrubProgress,
    peelDepth,
    lightAngle,
    searchQuery,
    setSearchQuery,
    setChromeVisible,
  } = useStudioStore();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active pose data
  const currentPose = POSES.find((p) => p.id === selectedPoseId) || POSES[0];
  const currentRegion = REGIONS[studyRegion] || REGIONS.Skull;

  // Metadata calculation
  const stopNames = ['Skin', 'Muscle', 'Bone', 'X-ray'];
  const nearestStop = Math.round(peelDepth / (100 / 3));
  const lightSide =
    Math.abs(lightAngle) > 150
      ? 'below'
      : lightAngle < 0
      ? 'upper left'
      : 'upper right';

  const modeLabel =
    mode === 'pose' ? 'Pose mode' : mode === 'study' ? 'Study mode' : 'Drill mode';

  const headline =
    mode === 'study'
      ? currentRegion.shortLabel
      : mode === 'drill'
      ? 'Gesture Session'
      : currentPose.name;

  const badge =
    mode === 'study'
      ? 'Isolated'
      : mode === 'drill'
      ? 'Timed'
      : currentPose.category;

  const metaLine =
    mode === 'study'
      ? 'Orbit to rotate · peel with the rail · Lens 85mm'
      : mode === 'drill'
      ? 'Focus on gesture line and primary weight distribution'
      : `${stopNames[nearestStop]} · ${lightSide} key · scrub ${Math.round(scrubProgress)}%`;

  // Focus search on '/' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const MODES: { label: string; key: StudioMode }[] = [
    { label: 'Pose', key: 'pose' },
    { label: 'Study', key: 'study' },
    { label: 'Drill', key: 'drill' },
  ];

  return (
    <>
      {/* Top Left: Typography-led Header */}
      <div className="absolute left-8 top-8 flex flex-col gap-2.5 whitespace-nowrap z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-studio-sage" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-studio-secondary">
            {modeLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-[44px] font-bold tracking-[-0.02em] text-studio-ink leading-none">
            {headline}
          </h1>
          <span className="bg-studio-track rounded-chip px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-studio-secondary">
            {badge}
          </span>
        </div>
        <div className="text-[13px] font-normal text-studio-tertiary">
          {metaLine}
        </div>
      </div>

      {/* Top Center: Segmented Control */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 flex bg-studio-track rounded-segmented p-[3px] gap-[2px] w-[300px] z-20 shadow-subtle pointer-events-auto">
        {MODES.map(({ label, key }) => {
          const isActive = mode === key;
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 h-[34px] flex items-center justify-center rounded-chip text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-studio-surface text-studio-ink shadow-subtle'
                  : 'text-studio-secondary hover:text-studio-ink'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Top Right: Search Pill & Fullscreen Toggle */}
      <div className="absolute right-8 top-8 flex items-center gap-2.5 z-20 pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-studio-surface rounded-full shadow-card h-[44px] pl-4 pr-1.5 w-[280px] transition-shadow duration-200 focus-within:ring-1 focus-within:ring-studio-slate">
          <Search className="w-4 h-4 text-studio-tertiary flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a pose or muscle"
            className="flex-1 border-none outline-none bg-transparent text-[14px] text-studio-ink min-w-0"
          />
          <kbd className="bg-studio-track rounded-md w-6 h-6 flex items-center justify-center text-[12px] font-medium text-studio-tertiary flex-shrink-0">
            /
          </kbd>
        </div>

        <button
          onClick={() => setChromeVisible(false)}
          title="Hide all controls — Space"
          className="w-[44px] h-[44px] rounded-full bg-studio-surface shadow-card flex items-center justify-center text-studio-secondary hover:text-studio-ink transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
