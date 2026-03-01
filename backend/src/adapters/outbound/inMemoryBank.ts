export type BankEntry = {
  id: string;
  shipId: string;
  year: number;
  amount_gco2eq: number;
  createdAt: string;
};

const entries: BankEntry[] = [];

export function getBankRecords(shipId?: string, year?: number): BankEntry[] {
  return entries.filter(e => (shipId ? e.shipId === shipId : true) && (year ? e.year === year : true));
}

export function addBankEntry(shipId: string, year: number, amount_gco2eq: number): BankEntry {
  const entry: BankEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    shipId,
    year,
    amount_gco2eq,
    createdAt: new Date().toISOString()
  };
  entries.push(entry);
  return entry;
}

export function getAvailableBank(shipId: string, year?: number): number {
  // Sum of all banked amounts for ship (positive values only)
  const relevant = entries.filter(e => e.shipId === shipId && (year ? e.year === year : true));
  return relevant.reduce((s, e) => s + e.amount_gco2eq, 0);
}
