declare module '@svg-maps/world' {
  const map: {
    label: string;
    viewBox: string;
    locations: { name: string; id: string; path: string }[];
  };
  export default map;
}

declare module '*/fetch-visitor-stats.mjs' {
  export function aggregateLocations(
    stats: { id?: string; count?: number }[] | undefined,
  ): Record<string, number>;
  export function buildVisitorsJson(args: {
    total: number;
    locations: { id?: string; count?: number }[];
    now?: Date;
  }): { updated: string; total: number; countries: Record<string, number> };
}
