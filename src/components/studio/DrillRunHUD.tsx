'use client';

import React, { useEffect } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { Play, Pause } from 'lucide-react';

export const DrillRunHUD: React.FC = () => {
  const {
    drillDuration,
    drillCount,
    currentDrillIndex,
    timeRemaining,
    isPaused,
    toggleDrillPause,
    tickDrillTimer,
    endDrill,
  } = useStudioStore();

  // Run countdown loop
  useEffect(() => {
    const interval = setInterval(() => {
      tickDrillTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickDrillTimer]);

  const mm = Math.floor(timeRemaining / 60);
  const ss = String(timeRemaining % 60).padStart(2, '0');
  const clockText = `${mm}:${ss}`;

  // Circular progress math (circumference for radius 33 is 2 * PI * 33 ~= 207)
  const CIRCUMFERENCE = 207;
  const progressRatio = timeRemaining / drillDuration;
  const strokeOffset = Math.round(CIRCUMFERENCE * (1 - progressRatio));

  return (
    <>
      {/* Top Right: Circular Clock */}
      <div className="absolute right-8 top-8 flex flex-col items-center gap-3 z-30 pointer-events-auto">
        <div className="relative w-[72px] h-[72px]">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="#D5D5D2"
              strokeWidth="1.5"
            />
            {/* Countdown animated ring */}
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="#2A3138"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-studio-ink tabular-nums">
            {clockText}
          </div>
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-studio-tertiary">
          {currentDrillIndex} of {drillCount}
        </span>
      </div>

      {/* Bottom Center: Floating Control Bar */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-auto">
        <button
          onClick={toggleDrillPause}
          className="flex items-center gap-2.5 h-[44px] pl-4 pr-5 rounded-full bg-studio-surface shadow-card hover:bg-studio-canvas transition-colors cursor-pointer"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 text-studio-slate fill-studio-slate" />
              <span className="text-[14px] font-medium text-studio-ink">Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 text-studio-slate" />
              <span className="text-[14px] font-medium text-studio-ink">Pause</span>
            </>
          )}
        </button>

        <button
          onClick={endDrill}
          className="flex items-center h-[44px] px-[18px] rounded-full bg-studio-surface shadow-card text-[14px] font-medium text-studio-secondary hover:text-studio-ink transition-colors cursor-pointer"
        >
          End
        </button>
      </div>
    </>
  );
};
