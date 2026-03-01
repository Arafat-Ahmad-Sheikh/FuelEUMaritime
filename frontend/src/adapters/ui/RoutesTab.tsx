import React, { useEffect, useState } from 'react'

type Route = {
  id: string
  routeId: string
  vesselType: string
  fuelType: string
  year: number
  ghgIntensity: number
  fuelConsumption: number
  distance: number
  totalEmissions: number
}

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' })

  useEffect(() => {
    fetch('/api/routes')
      .then(r => r.json())
      .then(setRoutes)
  }, [])

  const filtered = routes.filter(r =>
    (filters.vesselType ? r.vesselType === filters.vesselType : true) &&
    (filters.fuelType ? r.fuelType === filters.fuelType : true) &&
    (filters.year ? String(r.year) === filters.year : true)
  )

  const setBaseline = async (routeId: string) => {
    const res = await fetch(`/api/routes/${routeId}/baseline`, { method: 'POST' })
    if (res.ok) {
      // refresh
      const all = await (await fetch('/api/routes')).json()
      setRoutes(all)
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input placeholder="Vessel Type" value={filters.vesselType} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value }))} className="input input-bordered input-sm" />
        <input placeholder="Fuel Type" value={filters.fuelType} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value }))} className="input input-bordered input-sm" />
        <input placeholder="Year" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} className="input input-bordered input-sm" />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>routeId</th>
              <th>vesselType</th>
              <th>fuelType</th>
              <th>year</th>
              <th>ghgIntensity</th>
              <th>fuelConsumption (t)</th>
              <th>distance (km)</th>
              <th>totalEmissions (t)</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.routeId}>
                <td>{r.routeId}</td>
                <td>{r.vesselType}</td>
                <td>{r.fuelType}</td>
                <td>{r.year}</td>
                <td>{r.ghgIntensity}</td>
                <td>{r.fuelConsumption}</td>
                <td>{r.distance}</td>
                <td>{r.totalEmissions}</td>
                <td><button onClick={() => setBaseline(r.routeId)} className="btn btn-sm btn-success">Set Baseline</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
