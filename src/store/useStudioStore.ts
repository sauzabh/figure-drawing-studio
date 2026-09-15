import { create } from 'zustand';
import { POSES } from '@/data/poses';

export type StudioMode = 'pose' | 'study' | 'drill';
export type CameraPreset = 'threeQuarter' | 'front' | 'side' | 'back';
export type DrillDuration = 30 | 60 | 120 | 300;

export interface StudioState {
  // Navigation & Chrome
  mode: StudioMode;
  chromeVisible: boolean;
  setMode: (mode: StudioMode) => void;
  setChromeVisible: (visible: boolean) => void;
  toggleChromeVisible: () => void;

  // Pose Selection & Carousel
  selectedPoseId: string;
  activeCategory: string;
  searchQuery: string;
  scrubProgress: number; // 0 - 100
  setSelectedPoseId: (id: string) => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setScrubProgress: (progress: number) => void;
  randomizePose: () => void;
  nextPose: () => void;
  prevPose: () => void;

  // Anatomy Peel (0 = Skin, 33 = Muscle, 67 = Bone, 100 = X-Ray)
  peelDepth: number; // 0 - 100
  setPeelDepth: (depth: number) => void;

  // Lighting
  lightAngle: number; // -180 to 180 degrees
  setLightAngle: (angle: number) => void;

  // Camera View Angle
  cameraView: CameraPreset;
  setCameraView: (view: CameraPreset) => void;

  // Region Isolation & Study Mode
  isolatedRegion: string | null;
  studyRegion: string;
  setIsolatedRegion: (region: string | null) => void;
  setStudyRegion: (region: string) => void;
  enterStudyForRegion: (region: string) => void;

  // Drill Mode (Gesture Drawing Engine)
  drillPhase: 'setup' | 'run';
  drillDuration: number;
  drillCount: number;
  currentDrillIndex: number;
  timeRemaining: number;
  isPaused: boolean;
  randomizeSettings: {
    pose: boolean;
    camera: boolean;
    light: boolean;
    peel: boolean;
  };
  setDrillDuration: (duration: number) => void;
  incrementDrillCount: () => void;
  decrementDrillCount: () => void;
  toggleRandomSetting: (key: keyof StudioState['randomizeSettings']) => void;
  startDrill: () => void;
  toggleDrillPause: () => void;
  tickDrillTimer: () => void;
  endDrill: () => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  // Defaults from REFERENCE.html prototype
  mode: 'pose',
  chromeVisible: true,
  setMode: (mode) =>
    set((state) => ({
      mode,
      isolatedRegion: null,
      drillPhase: mode === 'drill' ? 'setup' : state.drillPhase,
    })),
  setChromeVisible: (visible) => set({ chromeVisible: visible }),
  toggleChromeVisible: () => set((state) => ({ chromeVisible: !state.chromeVisible })),

  // Pose selection
  selectedPoseId: 'contrapposto',
  activeCategory: 'All',
  searchQuery: '',
  scrubProgress: 18,
  setSelectedPoseId: (id) => set({ selectedPoseId: id, isolatedRegion: null }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setScrubProgress: (scrubProgress) => set({ scrubProgress }),
  randomizePose: () => {
    const randomIdx = Math.floor(Math.random() * POSES.length);
    set({
      selectedPoseId: POSES[randomIdx].id,
      scrubProgress: Math.round(Math.random() * 85),
      activeCategory: 'All',
      searchQuery: '',
      isolatedRegion: null,
    });
  },
  nextPose: () => {
    const { selectedPoseId } = get();
    const idx = POSES.findIndex((p) => p.id === selectedPoseId);
    const nextIdx = (idx + 1) % POSES.length;
    set({ selectedPoseId: POSES[nextIdx].id, isolatedRegion: null });
  },
  prevPose: () => {
    const { selectedPoseId } = get();
    const idx = POSES.findIndex((p) => p.id === selectedPoseId);
    const prevIdx = (idx - 1 + POSES.length) % POSES.length;
    set({ selectedPoseId: POSES[prevIdx].id, isolatedRegion: null });
  },

  // Anatomy Peel
  peelDepth: 0,
  setPeelDepth: (peelDepth) => set({ peelDepth: Math.max(0, Math.min(100, peelDepth)) }),

  // Lighting (-52 degrees is default in REFERENCE.html)
  lightAngle: -52,
  setLightAngle: (lightAngle) => set({ lightAngle }),

  // Camera preset
  cameraView: 'threeQuarter',
  setCameraView: (cameraView) => set({ cameraView }),

  // Regions
  isolatedRegion: null,
  studyRegion: 'Skull',
  setIsolatedRegion: (isolatedRegion) => set({ isolatedRegion }),
  setStudyRegion: (studyRegion) => set({ studyRegion }),
  enterStudyForRegion: (region) =>
    set({
      mode: 'study',
      studyRegion: region,
      isolatedRegion: null,
    }),

  // Drill Mode
  drillPhase: 'setup',
  drillDuration: 60,
  drillCount: 20,
  currentDrillIndex: 1,
  timeRemaining: 60,
  isPaused: false,
  randomizeSettings: {
    pose: true,
    camera: true,
    light: true,
    peel: false,
  },
  setDrillDuration: (duration) => set({ drillDuration: duration, timeRemaining: duration }),
  incrementDrillCount: () =>
    set((state) => ({ drillCount: Math.min(60, state.drillCount + 5) })),
  decrementDrillCount: () =>
    set((state) => ({ drillCount: Math.max(5, state.drillCount - 5) })),
  toggleRandomSetting: (key) =>
    set((state) => ({
      randomizeSettings: {
        ...state.randomizeSettings,
        [key]: !state.randomizeSettings[key],
      },
    })),
  startDrill: () => {
    const { drillDuration } = get();
    set({
      drillPhase: 'run',
      currentDrillIndex: 1,
      timeRemaining: drillDuration,
      isPaused: false,
      isolatedRegion: null,
    });
  },
  toggleDrillPause: () => set((state) => ({ isPaused: !state.isPaused })),
  tickDrillTimer: () => {
    const state = get();
    if (state.mode !== 'drill' || state.drillPhase !== 'run' || state.isPaused) return;

    if (state.timeRemaining > 1) {
      set({ timeRemaining: state.timeRemaining - 1 });
    } else {
      // Completed current pose interval
      if (state.currentDrillIndex >= state.drillCount) {
        // Drill finished! Return to setup
        set({
          drillPhase: 'setup',
          currentDrillIndex: 1,
          timeRemaining: state.drillDuration,
          isPaused: false,
        });
      } else {
        // Advance to next pose and randomize active parameters
        const nextIdx = state.currentDrillIndex + 1;
        const updates: Partial<StudioState> = {
          currentDrillIndex: nextIdx,
          timeRemaining: state.drillDuration,
        };

        if (state.randomizeSettings.pose) {
          const randomPoseIdx = Math.floor(Math.random() * POSES.length);
          updates.selectedPoseId = POSES[randomPoseIdx].id;
          updates.scrubProgress = Math.round(Math.random() * 85);
        }
        if (state.randomizeSettings.camera) {
          const views: CameraPreset[] = ['threeQuarter', 'front', 'side', 'back'];
          updates.cameraView = views[Math.floor(Math.random() * views.length)];
        }
        if (state.randomizeSettings.light) {
          updates.lightAngle = Math.round(Math.random() * 300 - 150);
        }
        if (state.randomizeSettings.peel) {
          updates.peelDepth = Math.round(Math.random() * 100);
        }

        set(updates);
      }
    }
  },
  endDrill: () =>
    set({
      mode: 'pose',
      drillPhase: 'setup',
      currentDrillIndex: 1,
      isPaused: false,
    }),
}));
