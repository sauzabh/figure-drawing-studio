'use client';

import React, { useEffect } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { StudioCanvas } from '@/components/canvas/StudioCanvas';
import { TopBar } from '@/components/studio/TopBar';
import { PeelRail } from '@/components/studio/PeelRail';
import { LightRing } from '@/components/studio/LightRing';
import { CameraPresets } from '@/components/studio/CameraPresets';
import { BottomDock } from '@/components/studio/BottomDock';
import { RegionCard } from '@/components/studio/RegionCard';
import { StudyHeader } from '@/components/studio/StudyHeader';
import { DrillSetupModal } from '@/components/studio/DrillSetupModal';
import { DrillRunHUD } from '@/components/studio/DrillRunHUD';

export const StudioLayout: React.FC = () => {
  const {
    mode,
    chromeVisible,
    setChromeVisible,
    toggleChromeVisible,
    isolatedRegion,
    setIsolatedRegion,
    drillPhase,
    endDrill,
    toggleDrillPause,
    nextPose,
    prevPose,
    randomizePose,
  } = useStudioStore();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in search input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (mode === 'drill' && drillPhase === 'run') {
          toggleDrillPause();
        } else {
          toggleChromeVisible();
        }
      } else if (e.key === 'Escape') {
        if (mode === 'drill') {
          endDrill();
        } else if (isolatedRegion) {
          setIsolatedRegion(null);
        } else {
          setChromeVisible(true);
        }
      } else if (e.key === 'ArrowRight') {
        nextPose();
      } else if (e.key === 'ArrowLeft') {
        prevPose();
      } else if (e.key.toLowerCase() === 'r') {
        randomizePose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mode,
    drillPhase,
    isolatedRegion,
    toggleDrillPause,
    toggleChromeVisible,
    endDrill,
    setIsolatedRegion,
    setChromeVisible,
    nextPose,
    prevPose,
    randomizePose,
  ]);

  const isDrillRunning = mode === 'drill' && drillPhase === 'run';
  const showChrome = chromeVisible && !isDrillRunning;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-studio-canvas overflow-hidden select-none">
      {/* Soft Radial Ambient Spotlight on Paper Floor */}
      <div className="absolute left-1/2 top-[42%] w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,#FAF9F7_0%,rgba(247,246,244,0)_70%)] pointer-events-none z-0" />

      {/* 3D WebGL Studio Viewport - Fullscreen */}
      <StudioCanvas />

      {/* Studio Overlays and Controls (when visible) */}
      {showChrome && (
        <>
          <TopBar />
          {mode !== 'drill' && <PeelRail />}
          {mode === 'pose' && !isolatedRegion && <LightRing />}
          {mode === 'pose' && <CameraPresets />}
          {mode === 'pose' && <BottomDock />}
          {mode === 'study' && <StudyHeader />}
          <RegionCard />
        </>
      )}

      {/* Drill Mode Modals & HUD */}
      {mode === 'drill' && drillPhase === 'setup' && <DrillSetupModal />}
      {mode === 'drill' && drillPhase === 'run' && <DrillRunHUD />}

      {/* Clean / Zen Mode: Show Controls Capsule Button */}
      {(!chromeVisible || isDrillRunning) && (
        <button
          onClick={() => setChromeVisible(true)}
          title="Show controls — Space"
          style={{ paddingLeft: '14px', paddingRight: '18px' }}
          className="fixed right-8 bottom-8 flex items-center gap-2.5 h-[44px] rounded-full bg-studio-surface shadow-card text-studio-ink hover:text-studio-secondary hover:bg-[#FAF9F7] transition-all duration-200 cursor-pointer z-40 pointer-events-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7076"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h10" />
          </svg>
          <span className="text-[14px] font-medium">Show controls</span>
        </button>
      )}
    </div>
  );
};
