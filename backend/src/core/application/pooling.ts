export type PoolMember = {
  shipId: string;
  cb_before: number; // gCO2e
  cb_after?: number;
};

export function validatePool(members: PoolMember[]): { ok: boolean; reason?: string } {
  const sum = members.reduce((s, m) => s + m.cb_before, 0);
  if (sum < 0) return { ok: false, reason: "Sum of CB before must be >= 0" };
  return { ok: true };
}

export function createPool(members: PoolMember[]): PoolMember[] {
  // Greedy allocation: sort by descending cb_before (surplus first)
  const total = members.reduce((s, m) => s + m.cb_before, 0);
  if (total < 0) throw new Error("Total CB of pool must be >= 0");

  // Make deep copy
  const res = members.map(m => ({ ...m, cb_after: m.cb_before }));

  // Separate surplus and deficit lists
  const surplus = res.filter(r => r.cb_after! > 0).sort((a, b) => b.cb_after! - a.cb_after!);
  const deficit = res.filter(r => r.cb_after! < 0).sort((a, b) => a.cb_after! - b.cb_after!); // most negative first

  let si = 0;
  let di = 0;

  while (si < surplus.length && di < deficit.length) {
    const s = surplus[si];
    const d = deficit[di];
    const available = s.cb_after!; // positive
    const needed = Math.abs(d.cb_after!); // positive
    const transfer = Math.min(available, needed);

    // Transfer
    s.cb_after = Number((s.cb_after! - transfer).toFixed(6));
    d.cb_after = Number((d.cb_after! + transfer).toFixed(6));

    // Move pointers
    if (Math.abs(s.cb_after) < 1e-9) si++;
    if (Math.abs(d.cb_after) < 1e-9) di++;
  }

  // Enforcement: no surplus becomes negative, no deficit worsens
  for (const m of res) {
    if (m.cb_after! < -1e-9) {
      throw new Error("Surplus allocation resulted in negative cb_after for a member");
    }
    if (m.cb_after! < m.cb_before - 1e-9 && m.cb_before < 0) {
      // deficit became worse
      throw new Error("Deficit member ended up worse after pooling");
    }
  }

  return res;
}
