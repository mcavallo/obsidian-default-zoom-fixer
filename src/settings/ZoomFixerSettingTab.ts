import type { App } from 'obsidian';
import { PluginSettingTab } from 'obsidian';

import ZoomLevelSetting from '@/settings/ZoomLevelSetting';

import type ZoomFixerPlugin from '../main';

export default class ZoomFixerSettingTab extends PluginSettingTab {
  protected plugin: ZoomFixerPlugin;

  constructor(app: App, plugin: ZoomFixerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    new ZoomLevelSetting(this.plugin, containerEl).display();
  }
}
