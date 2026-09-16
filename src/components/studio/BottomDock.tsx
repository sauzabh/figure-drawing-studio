'use client';

import React, { useRef, useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { CATEGORIES, POSES } from '@/data/poses';
import { Dices } from 'lucide-react';

export const BottomDock: React.FC = () => {
  const {
    selectedPoseId,
    setSelectedPoseId,
    activeCategory,
    setActiveCategory,
    searchQuery,
    scrubProgress,
    setScrubProgress,
    randomizePose,
  } = useStudioStore();

  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Filter poses by category & query
  const filteredPoses = POSES.filter((pose) => {
    const matchesCategory =
      activeCategory === 'All' || pose.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      pose.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      pose.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      pose.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesQuery;
  });

  const TICKS = ['0%', '18%', '34%', '52%', '71%', '88%', '100%'];
  const currentFrame = 1 + Math.round((scrubProgress / 100) * 23);

  const handleScrubPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const track = scrubTrackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const updateProgress = (clientX: number) => {
      const relativeX = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      setScrubProgress(Math.round(pct));
    };

    setIsScrubbing(true);
    updateProgress(e.clientX);

    const handleMove = (ev: PointerEvent) => {
      updateProgress(ev.clientX);
    };

    const handleUp = () => {
      setIsScrubbing(false);
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="fixed left-8 right-8 md:left-[140px] md:right-8 bottom-8 max-w-[1240px] flex flex-col gap-3 z-20 pointer-events-auto">
      {/* Category Filter Pills */}
      <div className="flex gap-1.5 items-center flex-wrap">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-[32px] px-[13px] rounded-chip flex items-center text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-studio-slate text-studio-surface shadow-subtle'
                  : 'bg-studio-surface text-studio-secondary shadow-card hover:text-studio-ink'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Dock Container */}
      <div className="bg-studio-surface rounded-card shadow-card p-[18px_20px] flex flex-col gap-3.5">
        {/* Motion Scrubber Row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-studio-tertiary">
              Scrub the motion
            </span>
            <div className="bg-studio-track rounded-chip px-2.5 py-1 text-[13px] font-medium text-studio-secondary tabular-nums">
              Frame {currentFrame} of 24
            </div>
          </div>

          <div
            ref={scrubTrackRef}
            onPointerDown={handleScrubPointerDown}
            className="relative h-4 flex items-center cursor-pointer select-none"
          >
            {/* Background Line */}
            <div className="absolute left-0 right-0 h-[2px] rounded-full bg-studio-divider" />

            {/* Filled Progress Line */}
            <div
              style={{ width: `${scrubProgress}%` }}
              className="absolute left-0 h-[2px] rounded-full bg-studio-slate transition-all duration-75"
            />

            {/* Frame Ticks */}
            {TICKS.map((tick) => (
              <div
                key={tick}
                style={{ left: tick }}
                className="absolute w-[1px] h-2 -mt-[1px] bg-studio-divider"
              />
            ))}

            {/* Scrubber Thumb */}
            <div
              style={{ left: `${scrubProgress}%` }}
              className="absolute w-3.5 h-3.5 -ml-[7px] rounded-full bg-studio-slate shadow-[0_1px_3px_rgba(20,22,26,0.20)] transition-transform hover:scale-125"
            />
          </div>
        </div>

        {/* Pose Carousel Row */}
        <div className="flex items-end gap-2.5">
          {/* Randomize Dice Button */}
          <button
            onClick={randomizePose}
            title="Randomize Pose (R)"
            className="w-[68px] h-[92px] rounded-[14px] bg-studio-track flex flex-col items-center justify-center gap-1.5 flex-shrink-0 hover:bg-studio-subtle transition-colors cursor-pointer"
          >
            <Dices className="w-5 h-5 text-studio-ink" />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-studio-secondary">
              Random
            </span>
          </button>

          {/* Divider */}
          <div className="w-[1px] h-[92px] bg-studio-subtle flex-shrink-0" />

          {/* Scrollable Pose Cards */}
          <div className="flex items-end gap-2 overflow-x-auto flex-1 pb-1">
            {filteredPoses.map((pose) => {
              const isSelected = selectedPoseId === pose.id;
              return (
                <div
                  key={pose.id}
                  onClick={() => setSelectedPoseId(pose.id)}
                  title={pose.name}
                  style={{
                    width: isSelected ? '74px' : '60px',
                    height: isSelected ? '92px' : '80px',
                  }}
                  className={`relative rounded-[12px] flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-200 flex flex-col items-center justify-between p-2 ${
                    isSelected
                      ? 'bg-studio-surface shadow-[0_4px_18px_rgba(20,22,26,0.10)] ring-1.5 ring-studio-slate'
                      : 'bg-studio-track hover:bg-studio-subtle'
                  }`}
                >
                  {/* Miniature Silhouette representation */}
                  <div
                    style={{
                      transform: `rotate(${pose.tilt}deg) scaleX(${pose.flip}) scale(0.55)`,
                    }}
                    className="w-8 h-12 relative mt-0.5 transition-transform"
                  >
                    <div className="absolute left-2.5 top-0 w-3 h-3.5 rounded-full bg-studio-ink opacity-80" />
                    <div className="absolute left-1.5 top-4 w-5 h-5 rounded-md bg-studio-ink opacity-80" />
                    <div className="absolute left-1 top-9 w-6 h-5 rounded-sm bg-studio-ink opacity-70" />
                  </div>

                  <span className="text-[10px] font-medium text-studio-secondary truncate w-full text-center">
                    {pose.name}
                  </span>
                </div>
              );
            })}

            {filteredPoses.length === 0 && (
              <div className="h-[92px] flex items-center text-[13px] text-studio-tertiary px-4">
                No poses match “{searchQuery}”
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
