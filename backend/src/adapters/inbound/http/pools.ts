import express from "express";
import { PoolMember, validatePool, createPool } from "../../../core/application/pooling";

const router = express.Router();

// POST /pools { members: [{ shipId, cb_before }] }
router.post("/pools", (req, res) => {
  const body = req.body || {};
  const members: PoolMember[] = body.members || [];
  if (!Array.isArray(members) || members.length === 0) return res.status(400).json({ error: "members array required" });

  const v = validatePool(members);
  if (!v.ok) return res.status(400).json({ error: v.reason });

  try {
    const after = createPool(members);
    const sumBefore = members.reduce((s, m) => s + m.cb_before, 0);
    const sumAfter = after.reduce((s, m) => s + (m.cb_after || 0), 0);
    res.json({ ok: true, sumBefore, sumAfter, members: after });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
