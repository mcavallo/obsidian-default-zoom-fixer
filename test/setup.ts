import { mock } from 'bun:test';

import { createMockElectron } from './fixtures/obsidian-mocks';

// Mock the obsidian module globally
void mock.module('obsidian', () => ({
  Plugin: class MockPlugin {
    app: any;
    manifest: any;

    constructor(app: any, manifest: any) {
      this.app = app;
      this.manifest = manifest;
    }

    loadData = mock(async () => ({}));
    saveData = mock(async (_data: any) => {});
    addSettingTab = mock((_settingTab: any) => {});
    addCommand = mock((_command: any) => {});
    registerEvent = mock((_event: any) => {});
  },

  PluginSettingTab: class MockPluginSettingTab {
    app: any;
    plugin: any;
    containerEl = {
      empty: mock(() => {}),
      createEl: mock(() => ({})),
      createDiv: mock(() => ({})),
    };

    constructor(app: any, plugin: any) {
      this.app = app;
      this.plugin = plugin;
    }

    display() {}
    hide() {}
  },

  Setting: class MockSetting {
    settingEl = {};
    controlEl = {
      createDiv: mock(() => ({})),
      querySelector: mock(() => null),
    };

    setName = mock(function (this: any, _name: string) {
      return this;
    });
    setDesc = mock(function (this: any, _desc: string) {
      return this;
    });
    addSlider = mock(function (this: any, _cb: (slider: any) => any) {
      return this;
    });
    addButton = mock(function (this: any, _cb: (button: any) => any) {
      return this;
    });
    then = mock(function (this: any, cb: (setting: any) => any) {
      cb(this);
      return this;
    });
  },

  SliderComponent: class MockSliderComponent {
    sliderEl = {};
    private value = 1.0;

    setLimits = mock(function (this: any, _min: number, _max: number, _step: number) {
      return this;
    });
    setValue = mock(function (this: any, value: number) {
      this.value = value;
      return this;
    });
    getValue = mock(function (this: any) {
      return this.value;
    });
    setDynamicTooltip = mock(function (this: any) {
      return this;
    });
    onChange = mock(function (this: any, _callback: (value: number) => any) {
      return this;
    });
    getValuePretty = mock(function (this: any) {
      return String(this.value);
    });
  },

  ButtonComponent: class MockButtonComponent {
    buttonEl = {};

    setButtonText = mock(function (this: any, _text: string) {
      return this;
    });
    setIcon = mock(function (this: any, _icon: string) {
      return this;
    });
    setTooltip = mock(function (this: any, _tooltip: string) {
      return this;
    });
    onClick = mock(function (this: any, _callback: () => any) {
      return this;
    });
    setClass = mock(function (this: any, _cls: string) {
      return this;
    });
  },
}));

// Mock window.require for Electron
(globalThis as any).window = {
  require: mock((module: string) => {
    if (module === 'electron') {
      return createMockElectron();
    }
    throw new Error(`Module ${module} is not mocked`);
  }),
};

// Suppress console warnings during tests (optional)
// Uncomment if you want cleaner test output
// console.warn = mock(() => {});
