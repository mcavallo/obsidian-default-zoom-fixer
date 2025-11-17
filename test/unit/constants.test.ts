import { describe, expect, test } from 'bun:test';

import { DEFAULT_SETTINGS, ZOOM_LEVEL } from '@/constants';

describe('ZOOM_LEVEL', () => {
  test('has valid minimum value', () => {
    expect(ZOOM_LEVEL.MIN).toBe(0.6);
    expect(ZOOM_LEVEL.MIN).toBeGreaterThan(0);
  });

  test('has valid maximum value', () => {
    expect(ZOOM_LEVEL.MAX).toBe(1.75);
    expect(ZOOM_LEVEL.MAX).toBeGreaterThan(ZOOM_LEVEL.MIN);
  });

  test('has valid step value', () => {
    expect(ZOOM_LEVEL.STEP).toBe(0.05);
    expect(ZOOM_LEVEL.STEP).toBeGreaterThan(0);
  });

  test('min is less than max', () => {
    expect(ZOOM_LEVEL.MIN).toBeLessThan(ZOOM_LEVEL.MAX);
  });

  test('step is smaller than range', () => {
    const range = ZOOM_LEVEL.MAX - ZOOM_LEVEL.MIN;
    expect(ZOOM_LEVEL.STEP).toBeLessThan(range);
  });

  test('range allows for multiple steps', () => {
    const range = ZOOM_LEVEL.MAX - ZOOM_LEVEL.MIN;
    const steps = range / ZOOM_LEVEL.STEP;
    expect(steps).toBeGreaterThan(1);
  });
});

describe('DEFAULT_SETTINGS', () => {
  test('has zoomLevel property', () => {
    expect(DEFAULT_SETTINGS).toHaveProperty('zoomLevel');
  });

  test('zoomLevel is a number', () => {
    expect(typeof DEFAULT_SETTINGS.zoomLevel).toBe('number');
  });

  test('zoomLevel is within valid range', () => {
    expect(DEFAULT_SETTINGS.zoomLevel).toBeGreaterThanOrEqual(ZOOM_LEVEL.MIN);
    expect(DEFAULT_SETTINGS.zoomLevel).toBeLessThanOrEqual(ZOOM_LEVEL.MAX);
  });

  test('zoomLevel is 1.0 (100%)', () => {
    expect(DEFAULT_SETTINGS.zoomLevel).toBe(1.0);
  });

  test('default is a reasonable value', () => {
    // 1.0 (100%) is a sensible default - not zoomed in or out
    expect(DEFAULT_SETTINGS.zoomLevel).toBe(1.0);
  });
});
