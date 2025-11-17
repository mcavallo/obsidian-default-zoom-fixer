import { mock } from 'bun:test';

/**
 * Creates a mock Obsidian App instance
 */
export function createMockApp(): any {
  return {
    workspace: {
      onLayoutReady: mock((callback: () => void) => {
        // Immediately invoke callback for testing
        callback();
      }),
    },
  };
}

/**
 * Creates a mock ZoomFixerPlugin instance
 */
export function createMockPlugin(overrides?: Partial<any>): any {
  return {
    app: createMockApp(),
    settings: { zoomLevel: 1.0 },
    loadData: mock(async () => ({})),
    saveData: mock(async () => {}),
    addSettingTab: mock(() => {}),
    applyZoomFactor: mock(() => {}),
    ...overrides,
  };
}

/**
 * Creates a mock Electron module with webFrame API
 */
export function createMockElectron(): any {
  return {
    webFrame: {
      setZoomFactor: mock((_factor: number) => {}),
      getZoomFactor: mock(() => 1.0),
    },
  };
}

/**
 * Creates a mock HTMLElement
 */
export function createMockHTMLElement(): any {
  return {
    empty: mock(() => {}),
    createEl: mock(() => createMockHTMLElement()),
    createDiv: mock((_opts?: any) => createMockHTMLElement()),
    addEventListener: mock(() => {}),
    querySelector: mock(() => null),
  };
}

/**
 * Creates a mock Obsidian Setting component
 */
export function createMockSetting(): any {
  return {
    settingEl: createMockHTMLElement(),
    controlEl: createMockHTMLElement(),
    setName: mock(function (this: any) {
      return this;
    }),
    setDesc: mock(function (this: any) {
      return this;
    }),
    addSlider: mock(function (this: any) {
      return this;
    }),
    addButton: mock(function (this: any) {
      return this;
    }),
    then: mock(function (this: any, cb: (setting: any) => void) {
      cb(this);
      return this;
    }),
  };
}
