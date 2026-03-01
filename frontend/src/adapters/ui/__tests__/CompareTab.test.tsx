import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CompareTab from '../CompareTab'

const sample = {
  baseline: 'R001',
  comparison: [
    { routeId: 'R002', ghgIntensityBaseline: 91.0, ghgIntensityComparison: 88.0, percentDiff: -3.3, compliant: true },
    { routeId: 'R003', ghgIntensityBaseline: 91.0, ghgIntensityComparison: 93.5, percentDiff: 2.7, compliant: false }
  ]
}

describe('CompareTab', () => {
  beforeEach(() => {
    // set a typed fake for global.fetch
    // @ts-expect-error overriding global in test
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(sample) }))
  })
  afterEach(() => {
    // @ts-expect-error cleanup
    global.fetch = undefined
  })

  it('renders table and chart bars', async () => {
    render(<CompareTab />)
    expect(await screen.findByText(/Baseline: R001/)).toBeTruthy()
    // table rows (may appear multiple times: chart label + table cell)
    const r002Matches = await screen.findAllByText('R002')
    const r003Matches = await screen.findAllByText('R003')
    expect(r002Matches.length).toBeGreaterThanOrEqual(1)
    expect(r003Matches.length).toBeGreaterThanOrEqual(1)
    // chart bars testids
    const baseBar = await screen.findByTestId('bar-R002-base')
    const compBar = await screen.findByTestId('bar-R002-comp')
    expect(baseBar).toBeTruthy()
    expect(compBar).toBeTruthy()
  })
})
