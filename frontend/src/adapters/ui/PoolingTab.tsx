import React, { useEffect, useState } from 'react'

type Member = { shipId: string; cb_before: number; cb_after?: number }

export default function PoolingTab() {
  const [members, setMembers] = useState<Member[]>([
    { shipId: 'R001', cb_before: -100000 },
    { shipId: 'R002', cb_before: 200000 }
  ])
  const [result, setResult] = useState<Member[] | null>(null)

  async function createPool() {
    const res = await fetch('/api/pools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ members }) })
    const body = await res.json()
    if (res.ok) setResult(body.members)
    else alert(body.error)
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Members</h3>
      <div className="space-y-2 mb-4">
        {members.map((m, i) => (
          <div key={m.shipId} className="flex gap-2 items-center">
            <input value={m.shipId} onChange={e => setMembers(s => s.map((x, idx) => idx===i?({...x, shipId: e.target.value}):x))} className="border p-1 rounded" />
            <input value={String(m.cb_before)} onChange={e => setMembers(s => s.map((x, idx) => idx===i?({...x, cb_before: Number(e.target.value)}):x))} className="border p-1 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMembers(s => [...s, { shipId: 'NEW', cb_before: 0 }])} className="px-3 py-1 bg-gray-200 rounded">Add</button>
        <button onClick={createPool} className="px-3 py-1 bg-green-600 text-white rounded">Create Pool</button>
      </div>

      {result && (
        <div>
          <h4 className="font-semibold">Result</h4>
          <ul>
            {result.map(r => (
              <li key={r.shipId}>{r.shipId}: before {r.cb_before}, after {r.cb_after}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
