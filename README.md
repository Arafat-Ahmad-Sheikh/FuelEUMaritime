# FuelEU Maritime — Minimal Implementation

This repository contains a minimal but structured implementation of a FuelEU Maritime compliance dashboard and API. It follows a hexagonal (ports & adapters) architecture to keep domain logic isolated from framework and UI code.

Repository layout (high level)

- `backend/` — Node.js + TypeScript API (hexagonal structure: `core`, `adapters`, `scripts`, tests).
- `frontend/` — Vite + React + TypeScript UI using TailwindCSS + DaisyUI.
- `AGENT_WORKFLOW.md`, `REFLECTION.md` — documentation of AI agent usage and a short reflection.

Quick start — backend

```bash
cd backend
npm install
npm run dev
```

Quick start — frontend

```bash
cd frontend
npm install
npm run dev
```

Run tests

Backend unit & integration tests (Vitest):

```bash
cd backend
npx vitest --run
```

Frontend tests (Vitest + Testing Library):

```bash
cd frontend
npx vitest --run
```

API surface (examples)

- `GET /api/routes` — list routes (seeded sample dataset available in the repo).
- `POST /api/routes/:routeId/baseline` — set a route as baseline.
- `GET /api/routes/comparison` — returns baseline + comparison rows with `percentDiff` and `compliant` flag.
- `GET /api/compliance/cb?shipId=&year=` — compute compliance balance snapshot.
- `GET /api/compliance/adjusted-cb?year=` — adjusted CB per member (used by pooling UI).
- `GET /api/banking/records?shipId=&year=` — list bank records for a ship.
- `POST /api/banking/bank` — bank positive CB (body: `shipId, year, amount`).
- `POST /api/banking/apply` — apply banked surplus (body: `shipId, year, amount`).
- `POST /api/pools` — create a pool with members and receive allocation results.

Sample request (comparison):

```http
GET /api/routes/comparison
Response 200
{
  "baseline": "R001",
  "comparison": [
    { "routeId": "R002", "ghgIntensityBaseline": 91, "ghgIntensityComparison": 88, "percentDiff": -3.3, "compliant": true }
  ]
}
```

Notes

- The project includes a clear separation between core domain code and adapters so the core can be exercised with unit tests without framework dependencies.
- Frontend uses TailwindCSS and DaisyUI for quick, accessible UI components. The `Compare` tab contains a small visual comparison chart and a table view.
- See `AGENT_WORKFLOW.md` for details about how AI agents were used during development, and `REFLECTION.md` for a short one-page reflection.
