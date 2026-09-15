'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { SlidersHorizontal } from 'lucide-react';

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

  const [dimensions, setDimensions] = useState({ w: 1440, h: 900 });

  // Update window size for responsive stage scaling
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Compute stage scale to fit within viewport
  const stageScale = Math.min(
    1,
    Math.min(dimensions.w / 1480, dimensions.h / 940)
  );

  const isDrillRunning = mode === 'drill' && drillPhase === 'run';
  const showChrome = chromeVisible && !isDrillRunning;

  return (
    <div className="fixed inset-0 bg-studio-backdrop overflow-hidden select-none flex items-center justify-center">
      {/* 1440x900 Fixed Studio Canvas with Responsive Scale */}
      <div
        style={{
          width: '1440px',
          height: '900px',
          transform: `scale(${stageScale})`,
          transformOrigin: 'center center',
        }}
        className="relative flex-none bg-studio-canvas overflow-hidden rounded-[14px] shadow-[0_4px_24px_rgba(20,22,26,0.06)]"
      >
        {/* Soft Radial Ambient Spotlight on Paper Floor */}
        <div className="absolute left-1/2 top-[38%] w-[1100px] height-[1100px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,#F7F6F4_0%,rgba(247,246,244,0)_66%)] pointer-events-none" />

        {/* 3D WebGL Studio Viewport */}
        <StudioCanvas />

        {/* Studio Overlays and Chrome */}
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

        {/* Clean Drawing Mode / Show Controls Capsule */}
        {(!chromeVisible || isDrillRunning) && (
          <button
            onClick={() => setChromeVisible(true)}
            className="absolute right-8 bottom-8 flex items-center gap-2.5 h-[44px] pl-3.5 pr-4.5 rounded-full bg-studio-surface shadow-card text-studio-ink hover:text-studio-secondary transition-colors cursor-pointer z-30 pointer-events-auto"
          >
            <SlidersHorizontal className="w-4 h-4 text-studio-secondary" />
            <span className="text-[14px] font-medium">Show controls</span>
          </button>
        )}
      </div>
    </div>
  );
};
