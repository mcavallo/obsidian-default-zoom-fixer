import { type Setting, SliderComponent } from 'obsidian';

import { ZOOM_LEVEL } from '@/constants';
import { formatFactorAsPercentage } from '@/utils';

export default class ZoomFactorSliderComponent extends SliderComponent {
  constructor(protected setting: Setting) {
    super(setting.controlEl);
    this.setLimits(ZOOM_LEVEL.MIN, ZOOM_LEVEL.MAX, ZOOM_LEVEL.STEP);
    this.setDynamicTooltip();
  }

  override getValuePretty() {
    return formatFactorAsPercentage(this.getValue());
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  override onChange(callback: (value: number) => any): this {
    return super.onChange(callback);
  }
}
