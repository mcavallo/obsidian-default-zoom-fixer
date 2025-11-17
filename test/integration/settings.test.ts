import { beforeEach, describe, expect, mock, test } from 'bun:test';

import { DEFAULT_SETTINGS } from '@/constants';
import ZoomFixerPlugin from '@/main';

import { createMockApp } from '../fixtures/obsidian-mocks';

describe('Settings Persistence', () => {
  let plugin: ZoomFixerPlugin;
  let mockApp: any;

  beforeEach(() => {
    mockApp = createMockApp();
    plugin = new ZoomFixerPlugin(mockApp, {
      id: 'default-zoom-fixer',
      name: 'Default Zoom Fixer',
    } as any);
  });

  describe('loadSettings', () => {
    test('loads default settings when no data exists', async () => {
      plugin.loadData = mock(async () => null);

      await plugin.loadSettings();

      expect(plugin.settings.zoomLevel).toBe(DEFAULT_SETTINGS.zoomLevel);
    });

    test('merges saved data with defaults', async () => {
      plugin.loadData = mock(async () => ({ zoomLevel: 1.5 }));

      await plugin.loadSettings();

      expect(plugin.settings.zoomLevel).toBe(1.5);
    });

    test('handles partial saved data', async () => {
      // If saved data is missing properties, defaults should fill in
      plugin.loadData = mock(async () => ({}));

      await plugin.loadSettings();

      expect(plugin.settings.zoomLevel).toBe(DEFAULT_SETTINGS.zoomLevel);
    });

    test('handles corrupted/invalid data gracefully', async () => {
      plugin.loadData = mock(async () => ({ zoomLevel: 'invalid' }));

      await plugin.loadSettings();

      // Should handle invalid data by using it anyway (Object.assign behavior)
      // In a real app, you might want validation here
      expect(plugin.settings).toHaveProperty('zoomLevel');
    });

    test('handles loadData returning undefined', async () => {
      plugin.loadData = mock(async () => undefined);

      await plugin.loadSettings();

      expect(plugin.settings.zoomLevel).toBe(DEFAULT_SETTINGS.zoomLevel);
    });

    test('preserves existing default properties', async () => {
      plugin.loadData = mock(async () => ({ zoomLevel: 1.2 }));

      await plugin.loadSettings();

      // Should have all default properties
      expect(plugin.settings).toMatchObject({
        zoomLevel: 1.2,
      });
    });
  });

  describe('saveSettings', () => {
    test('calls saveData with current settings', async () => {
      const saveDataMock = mock(async () => {});
      plugin.saveData = saveDataMock;
      plugin.settings = { zoomLevel: 1.3 };

      await plugin.saveSettings();

      expect(saveDataMock).toHaveBeenCalledTimes(1);
      expect(saveDataMock).toHaveBeenCalledWith({ zoomLevel: 1.3 });
    });

    test('saves modified zoom level', async () => {
      const saveDataMock = mock(async () => {});
      plugin.saveData = saveDataMock;
      plugin.settings = { zoomLevel: 0.8 };

      await plugin.saveSettings();

      expect(saveDataMock).toHaveBeenCalledWith({ zoomLevel: 0.8 });
    });

    test('can be called multiple times', async () => {
      const saveDataMock = mock(async () => {});
      plugin.saveData = saveDataMock;
      plugin.settings = { zoomLevel: 1.0 };

      await plugin.saveSettings();
      await plugin.saveSettings();
      await plugin.saveSettings();

      expect(saveDataMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Settings workflow', () => {
    test('load then save preserves data', async () => {
      const testData = { zoomLevel: 1.6 };
      plugin.loadData = mock(async () => testData);
      const saveDataMock = mock(async () => {});
      plugin.saveData = saveDataMock;

      await plugin.loadSettings();
      await plugin.saveSettings();

      expect(saveDataMock).toHaveBeenCalledWith(testData);
    });

    test('modifying settings and saving works', async () => {
      plugin.loadData = mock(async () => ({ zoomLevel: 1.0 }));
      const saveDataMock = mock(async () => {});
      plugin.saveData = saveDataMock;

      await plugin.loadSettings();
      plugin.settings.zoomLevel = 1.25;
      await plugin.saveSettings();

      expect(saveDataMock).toHaveBeenCalledWith({ zoomLevel: 1.25 });
    });
  });
});
