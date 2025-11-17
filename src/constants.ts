import type { ZoomFixerPluginSettings } from '@/types';

export const ZOOM_LEVEL = {
  MIN: 0.6,
  MAX: 1.75,
  STEP: 0.05,
};

export const DEFAULT_SETTINGS: ZoomFixerPluginSettings = {
  zoomLevel: 1.0, // 100%
};
