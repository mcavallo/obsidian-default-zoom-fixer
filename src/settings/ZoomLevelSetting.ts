import type { SliderComponent } from 'obsidian';
import { Setting } from 'obsidian';

import { DEFAULT_SETTINGS } from '@/constants';
import BasePluginSetting from '@/settings/BasePluginSetting';
import ResetButtonComponent from '@/ui/ResetButtonComponent';
import ZoomFactorSliderComponent from '@/ui/ZoomFactorSliderComponent';

export default class ZoomLevelSetting extends BasePluginSetting {
  private setting!: Setting;
  private resetButton!: ResetButtonComponent;
  private slider!: SliderComponent;

  display(): void {
    const setting = new Setting(this.containerEl)
      .setName('Zoom level')
      .setDesc('Set the default zoom level');

    this.resetButton = new ResetButtonComponent(setting).onClick(() => {
      this.slider.setValue(DEFAULT_SETTINGS.zoomLevel);
    });

    this.slider = new ZoomFactorSliderComponent(setting)
      .setValue(this.plugin.settings.zoomLevel)
      .onChange(async (value) => {
        this.plugin.settings.zoomLevel = value;
        await this.plugin.saveSettings();
        this.plugin.applyZoomFactor();
      });
  }
}
