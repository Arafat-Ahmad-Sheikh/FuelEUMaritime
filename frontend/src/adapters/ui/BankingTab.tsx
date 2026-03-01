import React, { useEffect, useState } from 'react'

type CBResponse = { shipId: string; year: number; cb_before: number }

type RecordEntry = { id: string; shipId: string; year: number; amount_gco2eq: number; createdAt: string }

export default function BankingTab() {
  const [shipId, setShipId] = useState('R001')
  const [year, setYear] = useState('2024')
  const [cb, setCb] = useState<CBResponse | null>(null)
  const [records, setRecords] = useState<RecordEntry[]>([])
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetchCb()
    fetchRecords()
  }, [])

  async function fetchCb() {
    const res = await fetch(`/api/compliance/cb?shipId=${shipId}&year=${year}`)
    const body = await res.json()
    setCb(body)
  }

  async function fetchRecords() {
    const res = await fetch(`/api/banking/records?shipId=${shipId}&year=${year}`)
    const body = await res.json()
    setRecords(body.records || [])
  }

  async function bank() {
    const res = await fetch(`/api/banking/bank`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shipId, year: Number(year), amount: Number(amount) }) })
    const body = await res.json()
    if (res.ok) {
      fetchCb(); fetchRecords(); setAmount('')
    } else alert(body.error)
  }

  async function apply() {
    const res = await fetch(`/api/banking/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shipId, year: Number(year), amount: Number(amount) }) })
    const body = await res.json()
    if (res.ok) { fetchCb(); fetchRecords(); setAmount('') } else alert(body.error)
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={shipId} onChange={e => setShipId(e.target.value)} className="input input-bordered input-sm" />
        <input value={year} onChange={e => setYear(e.target.value)} className="input input-bordered input-sm" />
        <button onClick={fetchCb} className="btn btn-sm btn-primary">Refresh CB</button>
      </div>

      <div className="mb-4">CB snapshot: <strong>{cb ? cb.cb_before.toFixed(0) : '—'}</strong></div>

      <div className="flex gap-2 mb-4">
        <input placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} className="input input-bordered input-sm" />
        <button onClick={bank} className="btn btn-sm btn-success">Bank</button>
        <button onClick={apply} className="btn btn-sm btn-accent">Apply</button>
      </div>

      <h3 className="font-semibold">Bank Records</h3>
      <ul className="menu">
        {records.map(r => (
          <li key={r.id} className="px-2">{r.shipId} — {r.amount_gco2eq} ({r.createdAt})</li>
        ))}
      </ul>
    </div>
  )
}
