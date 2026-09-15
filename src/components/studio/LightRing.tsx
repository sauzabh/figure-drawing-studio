'use client';

import React, { useRef, useState } from 'react';
import { useStudioStore } from '@/store/useStudioStore';

export const LightRing: React.FC = () => {
  const { lightAngle, setLightAngle } = useStudioStore();
  const ringRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const SIZE = 340;
  const RADIUS = 152;
  const CENTER = SIZE / 2;

  // Convert angle (degrees, 0 = top, 90 = right, etc.) to radians for circular position
  const rad = ((lightAngle - 90) * Math.PI) / 180;
  const knobX = CENTER + RADIUS * Math.cos(rad);
  const knobY = CENTER + RADIUS * Math.sin(rad);

  const lightSide =
    Math.abs(lightAngle) > 150
      ? 'below'
      : lightAngle < 0
      ? 'upper left'
      : 'upper right';
  const lightHardness = Math.abs(lightAngle) > 90 ? 'hard' : 'soft';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const ring = ringRef.current;
    if (!ring) return;

    const rect = ring.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const updateAngle = (clientX: number, clientY: number) => {
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI) + 90;
      // Normalize to -180 to 180
      const normalized = deg > 180 ? deg - 360 : deg < -180 ? deg + 360 : deg;
      setLightAngle(normalized);
    };

    setIsDragging(true);
    updateAngle(e.clientX, e.clientY);

    const handlePointerMove = (ev: PointerEvent) => {
      updateAngle(ev.clientX, ev.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={ringRef}
      style={{ width: `${SIZE}px`, height: `${SIZE}px` }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
    >
      {/* Dashed Orbit Guide Ring */}
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" className="absolute inset-0">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#DEDDD9"
          strokeWidth="1.5"
          strokeDasharray="3 7"
        />
      </svg>

      {/* Draggable Polar Light Knob */}
      <div
        onPointerDown={handlePointerDown}
        style={{
          left: `${knobX}px`,
          top: `${knobY}px`,
        }}
        className="absolute -ml-[10px] -mt-[10px] w-5 h-5 rounded-full bg-studio-slate shadow-[0_0_0_8px_rgba(42,49,56,0.08)] hover:shadow-[0_0_0_11px_rgba(42,49,56,0.12)] cursor-grab active:cursor-grabbing pointer-events-auto transition-shadow"
      />

      {/* Drag Readout Badge */}
      {isDragging && (
        <div
          style={{
            left: `${knobX + 22}px`,
            top: `${knobY - 14}px`,
          }}
          className="absolute bg-studio-surface rounded-chip px-2.5 py-1.5 text-[13px] font-medium text-studio-ink whitespace-nowrap shadow-card pointer-events-none z-30"
        >
          Key · {lightSide} · {lightHardness}
        </div>
      )}
    </div>
  );
};
