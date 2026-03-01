import express from "express";
import { findById } from "../../outbound/routesAdapter";
import { computeCB } from "../../../core/application/computeCB";
import { getBankRecords, addBankEntry, getAvailableBank } from "../../outbound/inMemoryBank";

const router = express.Router();

// GET /banking/records?shipId=R001&year=2024
router.get("/banking/records", (req, res) => {
  const shipId = String(req.query.shipId || req.query.routeId || "");
  const year = req.query.year ? Number(req.query.year) : undefined;
  const records = getBankRecords(shipId || undefined, year);
  res.json({ records });
});

// POST /banking/bank { shipId, year, amount }
router.post("/banking/bank", async (req, res) => {
  const body = req.body || {};
  const shipId = String(body.shipId || body.routeId || "");
  const amount = body.amount ? Number(body.amount) : 0;
  if (!shipId || !amount) return res.status(400).json({ error: "shipId and positive amount required" });

  const route = await findById(shipId);
  if (!route) return res.status(404).json({ error: "route not found" });

  const cb = computeCB(route);
  if (cb <= 0) return res.status(400).json({ error: "No positive CB available to bank" });
  if (amount > cb) return res.status(400).json({ error: "Amount exceeds available CB" });

  const entry = addBankEntry(route.routeId, route.year, amount);
  res.json({ ok: true, entry, cb_before: cb, cb_after: cb - amount });
});

// POST /banking/apply { shipId, year, amount }
router.post("/banking/apply", async (req, res) => {
  const body = req.body || {};
  const shipId = String(body.shipId || body.routeId || "");
  const year = body.year ? Number(body.year) : undefined;
  const amount = body.amount ? Number(body.amount) : 0;
  if (!shipId || !amount) return res.status(400).json({ error: "shipId and positive amount required" });

  const route = await findById(shipId);
  if (!route) return res.status(404).json({ error: "route not found" });

  const cb = computeCB(route);
  if (cb >= 0) return res.status(400).json({ error: "Ship has no deficit to apply bank to" });

  const available = getAvailableBank(route.routeId, year);
  if (amount > available) return res.status(400).json({ error: "Amount exceeds available banked surplus" });

  // Applying: create a negative bank entry to represent application (consumes bank)
  // We'll record application as a negative amount entry linked to the ship/year
  const entry = addBankEntry(route.routeId, route.year, -amount);
  const cb_after = cb + amount; // cb is negative
  res.json({ ok: true, applied: amount, cb_before: cb, cb_after, entry });
});

export default router;
