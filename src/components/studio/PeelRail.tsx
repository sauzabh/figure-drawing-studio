'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useStudioStore } from '@/store/useStudioStore';

export const PeelRail: React.FC = () => {
  const { peelDepth, setPeelDepth } = useStudioStore();
  const railRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const RAIL_H = 312;
  const TRACK_H = RAIL_H - 12;

  const STOPS = [
    { label: 'Skin', dot: '#E3C3AC', pct: 0 },
    { label: 'Muscle', dot: '#BE6E5C', pct: 33.33 },
    { label: 'Bone', dot: '#E6DFCD', pct: 66.67 },
    { label: 'X-ray', dot: '#D5D5D2', pct: 100 },
  ];

  const nearestIndex = Math.round(peelDepth / (100 / 3));
  const currentStopLabel = STOPS[nearestIndex]?.label || 'Skin';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rail = railRef.current;
    if (!rail) return;

    const rect = rail.getBoundingClientRect();
    const updatePosition = (clientY: number) => {
      const relativeY = clientY - rect.top - 6;
      const pct = Math.max(0, Math.min(100, (relativeY / TRACK_H) * 100));
      setPeelDepth(pct);
    };

    setIsDragging(true);
    updatePosition(e.clientY);

    const handlePointerMove = (ev: PointerEvent) => {
      updatePosition(ev.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleTop = 6 + (TRACK_H * peelDepth) / 100;
  const fillHeight = (TRACK_H * peelDepth) / 100;

  return (
    <div
      ref={railRef}
      onPointerDown={handlePointerDown}
      style={{ height: `${RAIL_H}px` }}
      className="absolute left-8 top-1/2 -translate-y-1/2 w-[104px] cursor-pointer z-20 select-none pointer-events-auto"
    >
      {/* Background Track Line */}
      <div className="absolute left-[5px] top-[6px] bottom-[6px] w-[2px] rounded-full bg-studio-divider" />

      {/* Filled Track Line */}
      <div
        style={{ height: `${fillHeight}px` }}
        className="absolute left-[5px] top-[6px] w-[2px] rounded-full bg-studio-slate transition-all duration-75"
      />

      {/* Discrete Labeled Stops */}
      {STOPS.map((stop, i) => {
        const topPos = 6 + (TRACK_H * i) / 3;
        const isCurrent = i === nearestIndex;
        return (
          <div
            key={stop.label}
            style={{ top: `${topPos}px` }}
            onClick={(e) => {
              e.stopPropagation();
              setPeelDepth(stop.pct);
            }}
            className="absolute left-0 -mt-[10px] flex items-center gap-2.5 h-5 cursor-pointer group"
          >
            <div
              style={{ backgroundColor: stop.dot }}
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-[inset_0_0_0_1px_rgba(20,22,26,0.08)] group-hover:scale-110 transition-transform"
            />
            <span
              className={`text-[11px] font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
                isCurrent ? 'text-studio-ink font-semibold' : 'text-studio-tertiary group-hover:text-studio-secondary'
              }`}
            >
              {stop.label}
            </span>
          </div>
        );
      })}

      {/* Draggable Slider Thumb */}
      <div
        style={{ top: `${handleTop}px` }}
        className="absolute -left-[3px] -mt-[9px] w-[18px] h-[18px] rounded-full bg-studio-slate shadow-[0_1px_4px_rgba(20,22,26,0.22)] transition-transform hover:scale-110"
      />

      {/* Live Drag Readout Pill */}
      {isDragging && (
        <div
          style={{ top: `${handleTop}px` }}
          className="absolute left-[30px] -mt-[15px] bg-studio-surface rounded-chip px-2.5 py-1 text-[13px] font-medium text-studio-ink whitespace-nowrap shadow-card pointer-events-none"
        >
          Peel to {currentStopLabel.toLowerCase()} · {Math.round(peelDepth)}%
        </div>
      )}
    </div>
  );
};
