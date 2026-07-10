// Astro exposes the configured `base` to code as import.meta.env.BASE_URL
// (e.g. '/portfolio/'). In vitest it defaults to '/', so path() is a no-op there.
const RAW_BASE: string =
  (typeof import.meta !== 'undefined' &&
   (import.meta as any).env && (import.meta as any).env.BASE_URL) || '/';

/** Normalize to a single leading slash, no trailing slash (except root). */
function norm(p: string): string {
  if (!p) return '/';
  const s = p.trim();
  const withSlash = s.startsWith('/') ? s : '/' + s;
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
  return trimmed || '/';
}

/** Configured Astro `base`, always leading-slash, no trailing slash (root -> ''). */
export const base: string = RAW_BASE === '/' ? '' : norm(RAW_BASE);

/** Join the configured base with an internal path; preserve query/hash. */
export function path(to: string): string {
  if (!to) return base || '/';
  if (/^[a-z]+:/i.test(to) || to.startsWith('#')) return to;       // absolute URL or hash
  const [pathname, search = ''] = to.split(/(?=[?#])/);
  const joined = (base + norm(pathname)).replace(/\/+/g, '/').replace(/\/+$/, '');
  return (joined || '/') + search;
}
