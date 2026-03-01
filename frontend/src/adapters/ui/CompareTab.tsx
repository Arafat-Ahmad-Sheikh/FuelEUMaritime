import React, { useEffect, useState } from 'react'

type Comparison = {
  routeId: string
  ghgIntensityBaseline: number
  ghgIntensityComparison: number
  percentDiff: number
  compliant: boolean
}

export default function CompareTab() {
  const [data, setData] = useState<{ baseline: string; comparison: Comparison[] } | null>(null)

  useEffect(() => {
    fetch('/api/routes/comparison')
      .then(r => r.json())
      .then(setData)
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Baseline: {data?.baseline}</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">routeId</th>
            <th className="p-2">baseline ghg</th>
            <th className="p-2">comparison ghg</th>
            <th className="p-2">% diff</th>
            <th className="p-2">compliant</th>
          </tr>
        </thead>
        <tbody>
          {data?.comparison.map(c => (
            <tr key={c.routeId} className="border-t">
              <td className="p-2">{c.routeId}</td>
              <td className="p-2">{c.ghgIntensityBaseline}</td>
              <td className="p-2">{c.ghgIntensityComparison}</td>
              <td className="p-2">{c.percentDiff.toFixed(2)}%</td>
              <td className="p-2">{c.compliant ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
