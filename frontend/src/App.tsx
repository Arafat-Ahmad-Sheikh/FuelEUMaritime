import React, { useState } from 'react'
import RoutesTab from './adapters/ui/RoutesTab'
import CompareTab from './adapters/ui/CompareTab'
import BankingTab from './adapters/ui/BankingTab'
import PoolingTab from './adapters/ui/PoolingTab'

const tabs = ['Routes', 'Compare', 'Banking', 'Pooling'] as const

type Tab = (typeof tabs)[number]

export default function App() {
  const [tab, setTab] = useState<Tab>('Routes')

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold">FuelEU Compliance Dashboard</h1>
      </header>

      <div className="max-w-6xl mx-auto bg-white shadow rounded p-4">
        <nav className="flex gap-2 mb-4">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded ${t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {t}
            </button>
          ))}
        </nav>

        <main>
          {tab === 'Routes' && <RoutesTab />}
          {tab === 'Compare' && <CompareTab />}
          {tab === 'Banking' && <BankingTab />}
          {tab === 'Pooling' && <PoolingTab />}
        </main>
      </div>
    </div>
  )
}
