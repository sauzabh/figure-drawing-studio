'use client';

import React from 'react';
import { useStudioStore, DrillDuration } from '@/store/useStudioStore';
import { Minus, Plus } from 'lucide-react';

export const DrillSetupModal: React.FC = () => {
  const {
    drillDuration,
    setDrillDuration,
    drillCount,
    incrementDrillCount,
    decrementDrillCount,
    randomizeSettings,
    toggleRandomSetting,
    startDrill,
  } = useStudioStore();

  const DURATIONS: { label: string; secs: DrillDuration }[] = [
    { label: '30s', secs: 30 },
    { label: '1m', secs: 60 },
    { label: '2m', secs: 120 },
    { label: '5m', secs: 300 },
  ];

  const durationText =
    drillDuration < 60
      ? `${drillDuration} seconds`
      : `${drillDuration / 60} minute${drillDuration > 60 ? 's' : ''}`;

  const totalMinutes = Math.round((drillCount * drillDuration) / 60);

  const activeChanges = Object.entries(randomizeSettings)
    .filter(([_, active]) => active)
    .map(([key]) => (key === 'light' ? 'key light' : key === 'peel' ? 'peel depth' : key))
    .join(', ');

  const TOGGLES: { key: keyof typeof randomizeSettings; label: string }[] = [
    { key: 'pose', label: 'Pose' },
    { key: 'camera', label: 'Camera' },
    { key: 'light', label: 'Key light' },
    { key: 'peel', label: 'Peel depth' },
  ];

  return (
    <div className="fixed inset-0 bg-studio-canvas/60 backdrop-blur-[2px] flex items-center justify-center z-50 pointer-events-auto">
      <div className="w-[468px] bg-studio-surface rounded-card shadow-modal p-6 flex flex-col gap-4.5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-studio-sage" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-studio-secondary">
              Drill mode
            </span>
          </div>
          <h2 className="text-[17px] font-semibold text-studio-ink">
            {drillCount} poses, {durationText} each
          </h2>
          <p className="text-[13px] text-studio-tertiary">
            About {totalMinutes} minutes · {activeChanges || 'no changes'} change each time
          </p>
        </div>

        <div className="h-[1px] bg-studio-subtle" />

        {/* Hold Duration Selector */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[15px] font-medium text-studio-ink">
            Hold each pose for
          </span>
          <div className="flex gap-1.5">
            {DURATIONS.map(({ label, secs }) => {
              const isSelected = drillDuration === secs;
              return (
                <button
                  key={secs}
                  onClick={() => setDrillDuration(secs)}
                  className={`flex-1 h-[40px] rounded-chip text-[13px] font-medium flex items-center justify-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-studio-slate text-studio-surface'
                      : 'bg-studio-track text-studio-secondary hover:text-studio-ink'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Number of Poses Stepper */}
        <div className="flex items-center justify-between h-[44px]">
          <span className="text-[15px] font-medium text-studio-ink">
            How many poses
          </span>
          <div className="flex items-center gap-1 bg-studio-track rounded-chip p-1">
            <button
              onClick={decrementDrillCount}
              className="w-[30px] h-[28px] rounded-md bg-studio-surface flex items-center justify-center text-studio-secondary hover:text-studio-ink shadow-subtle cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-[13px] font-medium text-studio-ink tabular-nums">
              {drillCount}
            </span>
            <button
              onClick={incrementDrillCount}
              className="w-[30px] h-[28px] rounded-md bg-studio-surface flex items-center justify-center text-studio-secondary hover:text-studio-ink shadow-subtle cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-studio-subtle" />

        {/* Randomize Toggles */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-studio-tertiary mb-1">
            Change between poses
          </span>
          {TOGGLES.map(({ key, label }) => {
            const isEnabled = randomizeSettings[key];
            return (
              <div
                key={key}
                onClick={() => toggleRandomSetting(key)}
                className="flex items-center justify-between h-[40px] cursor-pointer"
              >
                <span className="text-[15px] font-normal text-studio-ink">{label}</span>
                <div
                  className={`w-[44px] h-[26px] rounded-full relative transition-colors duration-200 ${
                    isEnabled ? 'bg-studio-slate' : 'bg-studio-divider'
                  }`}
                >
                  <div
                    className={`absolute top-[3px] w-5 h-5 rounded-full bg-studio-surface shadow-[0_1px_3px_rgba(20,22,26,0.18)] transition-all duration-200 ${
                      isEnabled ? 'left-[21px]' : 'left-[3px]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Begin Button */}
        <button
          onClick={startDrill}
          className="h-[48px] rounded-[14px] bg-studio-slate hover:bg-studio-ink text-studio-surface text-[15px] font-medium flex items-center justify-center transition-colors cursor-pointer mt-1"
        >
          Begin
        </button>

        <div className="text-center text-[13px] text-studio-tertiary">
          Space pauses · Esc ends the drill
        </div>
      </div>
    </div>
  );
};
