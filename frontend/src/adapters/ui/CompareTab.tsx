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
      {/* Simple comparison chart */}
      <div className="mb-4 card p-4">
        <h3 className="text-sm font-medium mb-2">GHG Intensity Chart</h3>
        <div role="img" aria-label="GHG intensity comparison chart" className="space-y-2">
          {data?.comparison.map(c => {
            const max = Math.max(c.ghgIntensityBaseline, c.ghgIntensityComparison, 100)
            const basePerc = Math.round((c.ghgIntensityBaseline / max) * 100)
            const compPerc = Math.round((c.ghgIntensityComparison / max) * 100)
            return (
              <div key={c.routeId} className="flex items-center gap-3">
                <div className="w-24 text-xs font-medium">{c.routeId}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-xs w-16">Baseline</div>
                    <progress className="progress progress-primary w-full" value={basePerc} max={100} data-testid={`bar-${c.routeId}-base`} style={{ height: 12 }} />
                    <div className="text-xs ml-2">{c.ghgIntensityBaseline}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs w-16">Comparison</div>
                    <progress className="progress progress-success w-full" value={compPerc} max={100} data-testid={`bar-${c.routeId}-comp`} style={{ height: 12 }} />
                    <div className="text-xs ml-2">{c.ghgIntensityComparison}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>routeId</th>
              <th>baseline ghg</th>
              <th>comparison ghg</th>
              <th>% diff</th>
              <th>compliant</th>
            </tr>
          </thead>
          <tbody>
            {data?.comparison.map(c => (
              <tr key={c.routeId}>
                <td>{c.routeId}</td>
                <td>{c.ghgIntensityBaseline}</td>
                <td>{c.ghgIntensityComparison}</td>
                <td>{c.percentDiff.toFixed(2)}%</td>
                <td>{c.compliant ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
