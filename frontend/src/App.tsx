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
    <div data-theme="dark" className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">FuelEU Compliance Dashboard</h1>
      </div>

      <div className="max-w-6xl mx-auto card bg-base-100 shadow-lg p-4">
        <div className="tabs tabs-boxed mb-4">
          {tabs.map(t => (
            <a key={t} onClick={() => setTab(t)} className={`tab ${t === tab ? 'tab-active' : ''}`}>{t}</a>
          ))}
        </div>

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
