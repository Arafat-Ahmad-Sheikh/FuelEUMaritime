import * as inMemory from './inMemoryRoutes';

// Lazy require Postgres adapter only when DATABASE_URL is set
let postgres: any = null;
if (process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    postgres = require('./postgresRoutes');
  } catch (err) {
    // ignore — will use in-memory
    // eslint-disable-next-line no-console
    console.warn('postgresRoutes not available, falling back to in-memory routes');
  }
}

export async function getAllRoutes() {
  if (postgres && postgres.getAllRoutes) return postgres.getAllRoutes();
  return inMemory.getAllRoutes();
}

export async function findById(id: string) {
  if (postgres && postgres.findById) return postgres.findById(id);
  return inMemory.findById(id);
}

export async function setBaseline(id: string) {
  if (postgres && postgres.setBaseline) return postgres.setBaseline(id);
  return inMemory.setBaseline(id);
}

export async function getBaseline(year?: number) {
  if (postgres && postgres.getBaseline) return postgres.getBaseline(year);
  return inMemory.getBaseline(year);
}

export default { getAllRoutes, findById, setBaseline, getBaseline };
