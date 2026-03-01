import { Client } from 'pg';
import { Route } from '../../core/domain/route';

function mapRow(row: any): Route {
  return {
    id: String(row.id),
    routeId: row.route_id,
    vesselType: row.vessel_type,
    fuelType: row.fuel_type,
    year: Number(row.year),
    ghgIntensity: Number(row.ghg_intensity),
    fuelConsumption: Number(row.fuel_consumption),
    distance: Number(row.distance),
    totalEmissions: Number(row.total_emissions),
    isBaseline: row.is_baseline
  };
}

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return new Client({ connectionString: url });
}

export async function getAllRoutes(): Promise<Route[]> {
  const client = getClient();
  await client.connect();
  const res = await client.query('SELECT * FROM routes ORDER BY id');
  await client.end();
  return res.rows.map(mapRow);
}

export async function findById(id: string): Promise<Route | undefined> {
  const client = getClient();
  await client.connect();
  const res = await client.query('SELECT * FROM routes WHERE route_id=$1 OR id::text=$1 LIMIT 1', [id]);
  await client.end();
  if (res.rows.length === 0) return undefined;
  return mapRow(res.rows[0]);
}

export async function setBaseline(id: string): Promise<Route | null> {
  const client = getClient();
  await client.connect();
  // unset previous
  await client.query('UPDATE routes SET is_baseline = false WHERE is_baseline = true');
  const upd = await client.query('UPDATE routes SET is_baseline = true WHERE route_id=$1 OR id::text=$1 RETURNING *', [id]);
  await client.end();
  if (upd.rows.length === 0) return null;
  return mapRow(upd.rows[0]);
}

export async function getBaseline(year?: number): Promise<Route | undefined> {
  const client = getClient();
  await client.connect();
  const res = year
    ? await client.query('SELECT * FROM routes WHERE is_baseline = true AND year = $1 LIMIT 1', [year])
    : await client.query('SELECT * FROM routes WHERE is_baseline = true LIMIT 1');
  await client.end();
  if (res.rows.length === 0) return undefined;
  return mapRow(res.rows[0]);
}
