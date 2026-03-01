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
      const body = await res.json()
      // refresh
      const all = await (await fetch('/api/routes')).json()
      setRoutes(all)
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input placeholder="Vessel Type" value={filters.vesselType} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value }))} className="border p-1 rounded" />
        <input placeholder="Fuel Type" value={filters.fuelType} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value }))} className="border p-1 rounded" />
        <input placeholder="Year" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))} className="border p-1 rounded" />
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">routeId</th>
            <th className="p-2">vesselType</th>
            <th className="p-2">fuelType</th>
            <th className="p-2">year</th>
            <th className="p-2">ghgIntensity</th>
            <th className="p-2">fuelConsumption (t)</th>
            <th className="p-2">distance (km)</th>
            <th className="p-2">totalEmissions (t)</th>
            <th className="p-2">actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.routeId} className="border-t">
              <td className="p-2">{r.routeId}</td>
              <td className="p-2">{r.vesselType}</td>
              <td className="p-2">{r.fuelType}</td>
              <td className="p-2">{r.year}</td>
              <td className="p-2">{r.ghgIntensity}</td>
              <td className="p-2">{r.fuelConsumption}</td>
              <td className="p-2">{r.distance}</td>
              <td className="p-2">{r.totalEmissions}</td>
              <td className="p-2"><button onClick={() => setBaseline(r.routeId)} className="px-2 py-1 bg-green-600 text-white rounded">Set Baseline</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
