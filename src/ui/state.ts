export interface AppState {
  latitude: number;
  longitude: number;
  fiberCount: number;
  curveResolution: number;
  projectionScale: number;
  showBaseSphere: boolean;
  showAxes: boolean;
  animatePhase: boolean;
}

export const initialState: AppState = {
  latitude: 0.35,
  longitude: 0.75,
  fiberCount: 18,
  curveResolution: 160,
  projectionScale: 1.55,
  showBaseSphere: true,
  showAxes: true,
  animatePhase: false,
};
