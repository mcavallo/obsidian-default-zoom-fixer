import type { Setting } from 'obsidian';
import { ButtonComponent } from 'obsidian';

export default class ResetButtonComponent extends ButtonComponent {
  constructor(protected setting: Setting) {
    super(setting.controlEl);
    this.setTooltip('Restore default');
    this.setIcon('rotate-ccw');
    this.render();
  }

  private render(): void {
    this.buttonEl.classList.add('clickable-icon');
    this.buttonEl.classList.add('extra-setting-button');
  }
}
