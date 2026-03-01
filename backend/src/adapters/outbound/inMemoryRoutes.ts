import { Route } from "../../core/domain/route";

// If DATABASE_URL is provided, prefer Postgres adapter
if (process.env.DATABASE_URL) {
  try {
    // dynamic import to avoid requiring pg when not needed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    module.exports = require('./postgresRoutes');
  } catch (err) {
    // fall back to in-memory if import fails
    // eslint-disable-next-line no-console
    console.warn('Failed to load postgresRoutes adapter, using in-memory routes', err?.message || err);
  }
}

const seed: Route[] = [
  { id: "1", routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true },
  { id: "2", routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  { id: "3", routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  { id: "4", routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300 },
  { id: "5", routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400 }
];

const routes = seed.map(r => ({ ...r }));

export function getAllRoutes(): Route[] {
  return routes;
}

export function findById(id: string): Route | undefined {
  return routes.find(r => r.id === id || r.routeId === id);
}

export function setBaseline(id: string): Route | null {
  const found = findById(id);
  if (!found) return null;
  // unset previous baseline
  routes.forEach(r => (r.isBaseline = false));
  found.isBaseline = true;
  return found;
}

export function getBaseline(year?: number): Route | undefined {
  return routes.find(r => r.isBaseline && (year ? r.year === year : true));
}
