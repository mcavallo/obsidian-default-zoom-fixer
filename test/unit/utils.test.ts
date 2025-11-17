import { describe, expect, test } from 'bun:test';

import { formatFactorAsPercentage } from '@/utils';

describe('formatFactorAsPercentage', () => {
  test('converts 1.0 to 100%', () => {
    expect(formatFactorAsPercentage(1.0)).toBe('100%');
  });

  test('converts 0.6 to 60%', () => {
    expect(formatFactorAsPercentage(0.6)).toBe('60%');
  });

  test('converts 1.75 to 175%', () => {
    expect(formatFactorAsPercentage(1.75)).toBe('175%');
  });

  test('converts 0 to 0%', () => {
    expect(formatFactorAsPercentage(0)).toBe('0%');
  });

  test('converts 2.0 to 200%', () => {
    expect(formatFactorAsPercentage(2.0)).toBe('200%');
  });

  test('rounds 0.666 to 67%', () => {
    expect(formatFactorAsPercentage(0.666)).toBe('67%');
  });

  test('rounds 1.234 to 123%', () => {
    expect(formatFactorAsPercentage(1.234)).toBe('123%');
  });

  test('rounds 1.235 to 124%', () => {
    expect(formatFactorAsPercentage(1.235)).toBe('124%');
  });

  test('handles very small numbers', () => {
    expect(formatFactorAsPercentage(0.001)).toBe('0%');
  });

  test('handles very large numbers', () => {
    expect(formatFactorAsPercentage(10.0)).toBe('1000%');
  });

  test('handles negative numbers', () => {
    expect(formatFactorAsPercentage(-0.5)).toBe('-50%');
  });
});
