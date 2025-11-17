import { Plugin } from 'obsidian';

import { DEFAULT_SETTINGS } from '@/constants';
import type { ZoomFixerPluginSettings } from '@/types';

import ZoomFixerSettingTab from './settings/ZoomFixerSettingTab';

export default class ZoomFixerPlugin extends Plugin {
  settings!: ZoomFixerPluginSettings;

  override async onload() {
    await this.loadSettings();
    this.addSettingTab(new ZoomFixerSettingTab(this.app, this));

    // Apply zoom immediately on plugin load
    this.applyZoomFactor();

    // Also apply when workspace is ready (ensures UI is fully loaded)
    this.app.workspace.onLayoutReady(() => {
      this.applyZoomFactor();
    });
  }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as ZoomFixerPluginSettings,
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  public applyZoomFactor(): void {
    try {
      const { webFrame } = window.require('electron');
      webFrame.setZoomFactor(this.settings.zoomLevel);
    } catch (error) {
      console.error('Failed to set zoom factor:', error);
    }
  }
}
