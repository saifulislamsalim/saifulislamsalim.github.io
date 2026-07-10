/** Intensity class for the choropleth, relative to the busiest country. */
export function bucketClass(count: number, max: number): 'v0' | 'v1' | 'v2' | 'v3' | 'v4' {
  if (!(count > 0) || !(max > 0)) return 'v0';
  const r = count / max;
  if (r > 0.75) return 'v4';
  if (r > 0.4) return 'v3';
  if (r > 0.15) return 'v2';
  return 'v1';
}

/** Top-n countries, desc by count, with English display names. */
export function topCountries(
  countries: Record<string, number>,
  n = 8,
): { code: string; name: string; count: number }[] {
  const names = new Intl.DisplayNames(['en'], { type: 'region' });
  return Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([code, count]) => ({ code, name: names.of(code) ?? code, count }));
}
