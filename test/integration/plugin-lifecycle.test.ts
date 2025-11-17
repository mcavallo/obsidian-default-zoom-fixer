import { beforeEach, describe, expect, mock, test } from 'bun:test';

import ZoomFixerPlugin from '@/main';

import { createMockApp, createMockElectron } from '../fixtures/obsidian-mocks';

describe('Plugin Lifecycle', () => {
  let plugin: ZoomFixerPlugin;
  let mockApp: any;
  let mockElectron: any;

  beforeEach(() => {
    // Reset mocks
    mockApp = createMockApp();
    mockElectron = createMockElectron();

    (globalThis as any).window = {
      require: mock(() => mockElectron),
    };

    plugin = new ZoomFixerPlugin(mockApp, {
      id: 'default-zoom-fixer',
      name: 'Default Zoom Fixer',
    } as any);
  });

  describe('onload', () => {
    test('loads settings on plugin load', async () => {
      const loadDataMock = mock(async () => ({ zoomLevel: 1.3 }));
      plugin.loadData = loadDataMock;

      await plugin.onload();

      expect(loadDataMock).toHaveBeenCalledTimes(1);
      expect(plugin.settings.zoomLevel).toBe(1.3);
    });

    test('registers settings tab', async () => {
      const addSettingTabMock = mock(() => {});
      plugin.addSettingTab = addSettingTabMock;

      await plugin.onload();

      expect(addSettingTabMock).toHaveBeenCalledTimes(1);
      expect(addSettingTabMock).toHaveBeenCalledWith(expect.anything());
    });

    test('applies zoom factor immediately', async () => {
      plugin.loadData = mock(async () => ({ zoomLevel: 1.4 }));

      await plugin.onload();

      // Should have been called at least once during onload
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalled();
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.4);
    });

    test('registers workspace layout ready callback', async () => {
      const onLayoutReadyMock = mock((cb: () => void) => {
        // Call the callback immediately for testing
        cb();
      });
      mockApp.workspace.onLayoutReady = onLayoutReadyMock;

      await plugin.onload();

      expect(onLayoutReadyMock).toHaveBeenCalledTimes(1);
      expect(onLayoutReadyMock).toHaveBeenCalledWith(expect.any(Function));
    });

    test('applies zoom when workspace layout is ready', async () => {
      let layoutReadyCallback: (() => void) | null = null;

      mockApp.workspace.onLayoutReady = mock((cb: () => void) => {
        layoutReadyCallback = cb;
      });

      plugin.loadData = mock(async () => ({ zoomLevel: 1.6 }));

      await plugin.onload();

      // Clear previous calls
      mockElectron.webFrame.setZoomFactor.mockClear();

      // Now invoke the layout ready callback
      layoutReadyCallback?.();

      // Should apply zoom again
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.6);
    });

    test('executes in correct order: load settings → register tab → apply zoom', async () => {
      const executionOrder: string[] = [];

      plugin.loadData = mock(async () => {
        executionOrder.push('loadData');
        return { zoomLevel: 1.0 };
      });

      plugin.addSettingTab = mock(() => {
        executionOrder.push('addSettingTab');
      });

      const originalApplyZoom = plugin.applyZoomFactor.bind(plugin);
      plugin.applyZoomFactor = mock(() => {
        executionOrder.push('applyZoomFactor');
        originalApplyZoom();
      });

      await plugin.onload();

      // Should be called twice: once immediately, once in layout ready callback
      expect(executionOrder).toEqual([
        'loadData',
        'addSettingTab',
        'applyZoomFactor',
        'applyZoomFactor',
      ]);
    });

    test('calls applyZoomFactor twice (immediate + layout ready)', async () => {
      // Mock that calls callback immediately
      mockApp.workspace.onLayoutReady = mock((cb: () => void) => cb());

      plugin.loadData = mock(async () => ({ zoomLevel: 1.0 }));

      await plugin.onload();

      // Should be called twice: once immediately, once in layout ready callback
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledTimes(2);
    });
  });

  describe('Plugin initialization with various settings', () => {
    test('initializes with default settings when no saved data', async () => {
      plugin.loadData = mock(async () => null);

      await plugin.onload();

      // Should use default of 1.0
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.0);
    });

    test('initializes with saved custom zoom level', async () => {
      plugin.loadData = mock(async () => ({ zoomLevel: 0.75 }));

      await plugin.onload();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(0.75);
    });

    test('handles initialization errors gracefully', async () => {
      plugin.loadData = mock(async () => {
        throw new Error('Failed to load data');
      });

      // Should not throw uncaught exception
      await expect(plugin.onload()).rejects.toThrow('Failed to load data');
    });
  });
});
