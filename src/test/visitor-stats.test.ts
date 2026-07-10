import { describe, it, expect } from 'vitest';
import { aggregateLocations, buildVisitorsJson } from '../../scripts/fetch-visitor-stats.mjs';
import { bucketClass, topCountries } from '../utils/visitor-map';

describe('aggregateLocations', () => {
  it('uppercases ids, keeps only alpha-2 codes with positive counts, sums duplicates', () => {
    const stats = [
      { id: 'bd', count: 5 },
      { id: 'US', count: 3 },
      { id: 'us', count: 2 },
      { id: '', count: 9 },          // unknown location bucket — dropped
      { id: 'GBR', count: 4 },       // not alpha-2 — dropped
      { id: 'de', count: 0 },        // non-positive — dropped
    ];
    expect(aggregateLocations(stats)).toEqual({ BD: 5, US: 5 });
  });

  it('returns {} for empty or missing input', () => {
    expect(aggregateLocations([])).toEqual({});
    expect(aggregateLocations(undefined)).toEqual({});
  });
});

describe('buildVisitorsJson', () => {
  it('stamps the date and assembles the payload', () => {
    const out = buildVisitorsJson({
      total: 10,
      locations: [{ id: 'bd', count: 10 }],
      now: new Date('2026-07-10T12:00:00Z'),
    });
    expect(out).toEqual({ updated: '2026-07-10', total: 10, countries: { BD: 10 } });
  });
});

describe('bucketClass', () => {
  it('maps counts to intensity buckets relative to max', () => {
    expect(bucketClass(0, 100)).toBe('v0');
    expect(bucketClass(10, 100)).toBe('v1');   // ≤15%
    expect(bucketClass(30, 100)).toBe('v2');   // ≤40%
    expect(bucketClass(60, 100)).toBe('v3');   // ≤75%
    expect(bucketClass(100, 100)).toBe('v4');
    expect(bucketClass(5, 0)).toBe('v0');      // no data at all
  });
});

describe('topCountries', () => {
  it('sorts desc, limits, and resolves display names', () => {
    const top = topCountries({ BD: 5, US: 9, DE: 1 }, 2);
    expect(top).toEqual([
      { code: 'US', name: 'United States', count: 9 },
      { code: 'BD', name: 'Bangladesh', count: 5 },
    ]);
  });
});
