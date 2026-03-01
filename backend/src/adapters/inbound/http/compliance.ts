import express from "express";
import { findById } from "../../outbound/inMemoryRoutes";
import { computeCB } from "../../../core/application/computeCB";
import { getAvailableBank } from "../../outbound/inMemoryBank";

const router = express.Router();

// GET /compliance/cb?shipId=R001&year=2024
router.get("/compliance/cb", (req, res) => {
  const shipId = String(req.query.shipId || req.query.routeId || "");
  const year = req.query.year ? Number(req.query.year) : undefined;
  if (!shipId) return res.status(400).json({ error: "shipId (or routeId) required" });

  const route = findById(shipId);
  if (!route) return res.status(404).json({ error: "route not found" });

  const cb = computeCB(route);
  // For now we return snapshot but do not persist
  res.json({ shipId: route.routeId, year: route.year, cb_before: cb });
});

// GET /compliance/adjusted-cb?shipId=R001&year=2024
router.get("/compliance/adjusted-cb", (req, res) => {
  const shipId = String(req.query.shipId || req.query.routeId || "");
  const year = req.query.year ? Number(req.query.year) : undefined;
  if (!shipId) return res.status(400).json({ error: "shipId (or routeId) required" });

  const route = findById(shipId);
  if (!route) return res.status(404).json({ error: "route not found" });

  const cb_before = computeCB(route);
  const availableBank = getAvailableBank(route.routeId, year);

  let applied = 0;
  let cb_after = cb_before;

  if (cb_before < 0 && availableBank > 0) {
    const deficit = Math.abs(cb_before);
    applied = Math.min(deficit, availableBank);
    cb_after = cb_before + applied; // cb_before is negative
  }

  res.json({ shipId: route.routeId, year: route.year, cb_before, applied, cb_after });
});

export default router;
