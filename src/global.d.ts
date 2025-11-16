import type * as Electron from 'electron';

declare global {
  interface Window {
    require(modSpecifier: 'electron'): typeof Electron;
  }
}

export {};
