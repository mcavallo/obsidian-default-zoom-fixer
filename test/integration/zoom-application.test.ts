import { beforeEach, describe, expect, mock, test } from 'bun:test';

import ZoomFixerPlugin from '@/main';

import { createMockApp, createMockElectron } from '../fixtures/obsidian-mocks';

describe('Zoom Factor Application', () => {
  let plugin: ZoomFixerPlugin;
  let mockApp: any;
  let mockElectron: any;

  beforeEach(() => {
    // Reset mocks
    mockApp = createMockApp();
    mockElectron = createMockElectron();

    // Set up electron mock
    (globalThis as any).window = {
      require: mock((module: string) => {
        if (module === 'electron') return mockElectron;
        throw new Error(`Module ${module} not mocked`);
      }),
    };

    plugin = new ZoomFixerPlugin(mockApp, {
      id: 'default-zoom-fixer',
      name: 'Default Zoom Fixer',
    } as any);
  });

  describe('applyZoomFactor', () => {
    test('calls webFrame.setZoomFactor with settings zoom level', () => {
      plugin.settings = { zoomLevel: 1.5 };

      plugin.applyZoomFactor();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.5);
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledTimes(1);
    });

    test('applies default zoom level (1.0)', () => {
      plugin.settings = { zoomLevel: 1.0 };

      plugin.applyZoomFactor();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.0);
    });

    test('applies minimum zoom level (0.6)', () => {
      plugin.settings = { zoomLevel: 0.6 };

      plugin.applyZoomFactor();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(0.6);
    });

    test('applies maximum zoom level (1.75)', () => {
      plugin.settings = { zoomLevel: 1.75 };

      plugin.applyZoomFactor();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.75);
    });

    test('can be called multiple times', () => {
      plugin.settings = { zoomLevel: 1.2 };

      plugin.applyZoomFactor();
      plugin.applyZoomFactor();
      plugin.applyZoomFactor();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledTimes(3);
    });

    test('updates zoom when settings change', () => {
      plugin.settings = { zoomLevel: 1.0 };
      plugin.applyZoomFactor();

      plugin.settings = { zoomLevel: 1.5 };
      plugin.applyZoomFactor();

      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.0);
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledWith(1.5);
      expect(mockElectron.webFrame.setZoomFactor).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error handling', () => {
    test('handles electron not being available', () => {
      const consoleErrorMock = mock(() => {});
      const originalError = console.error;
      console.error = consoleErrorMock;

      // Make window.require throw an error
      (globalThis as any).window = {
        require: mock(() => {
          throw new Error('Electron not available');
        }),
      };

      plugin.settings = { zoomLevel: 1.0 };

      // Should not throw
      expect(() => plugin.applyZoomFactor()).not.toThrow();

      // Should log error to console
      expect(consoleErrorMock).toHaveBeenCalled();

      // Restore original console.error
      console.error = originalError;
    });

    test('handles webFrame.setZoomFactor throwing error', () => {
      const consoleErrorMock = mock(() => {});
      const originalError = console.error;
      console.error = consoleErrorMock;

      // Make setZoomFactor throw
      mockElectron.webFrame.setZoomFactor = mock(() => {
        throw new Error('setZoomFactor failed');
      });

      (globalThis as any).window = {
        require: mock(() => mockElectron),
      };

      plugin.settings = { zoomLevel: 1.0 };

      // Should not throw uncaught exception
      expect(() => plugin.applyZoomFactor()).not.toThrow();

      // Should log error
      expect(consoleErrorMock).toHaveBeenCalled();

      console.error = originalError;
    });

    test('logs error message to console.error', () => {
      const consoleErrorMock = mock(() => {});
      const originalError = console.error;
      console.error = consoleErrorMock;

      (globalThis as any).window = {
        require: mock(() => {
          throw new Error('Test error');
        }),
      };

      plugin.settings = { zoomLevel: 1.0 };
      plugin.applyZoomFactor();

      // Verify console.error was called with proper message
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Failed to set zoom factor:',
        expect.any(Error),
      );

      console.error = originalError;
    });
  });
});
