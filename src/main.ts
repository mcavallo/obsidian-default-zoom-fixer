import { Plugin } from 'obsidian';

const ZOOM_FACTOR = 1.2;

export default class ZoomFixerPlugin extends Plugin {
  override onload() {
    // Apply zoom immediately on plugin load
    this.applyZoomFactor();

    // Also apply when workspace is ready (ensures UI is fully loaded)
    this.app.workspace.onLayoutReady(() => {
      this.applyZoomFactor();
    });

    console.warn('Zoom Fixer plugin loaded');
  }

  override onunload() {
    console.warn('Zoom Fixer plugin unloaded');
  }

  private applyZoomFactor(): void {
    try {
      const { webFrame } = window.require('electron');
      webFrame.setZoomFactor(ZOOM_FACTOR);
      console.warn(`Zoom factor set to ${ZOOM_FACTOR}`);
    } catch (error) {
      console.error('Failed to set zoom factor:', error);
    }
  }

  private resetZoomFactor(): void {
    try {
      const { webFrame } = window.require('electron');
      webFrame.setZoomFactor(1.0);
      console.warn('Zoom factor reset to 1.0');
    } catch (error) {
      console.error('Failed to reset zoom factor:', error);
    }
  }
}
