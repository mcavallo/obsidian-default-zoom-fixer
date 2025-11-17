import type ZoomFixerPlugin from '@/main';

export default abstract class BasePluginSetting {
  protected plugin: ZoomFixerPlugin;
  protected containerEl: HTMLElement;

  constructor(plugin: ZoomFixerPlugin, containerEl: HTMLElement) {
    this.plugin = plugin;
    this.containerEl = containerEl;
  }

  public abstract display(): void;
}
