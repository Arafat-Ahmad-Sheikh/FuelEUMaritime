import express from "express";
import { getAllRoutes, setBaseline, getBaseline } from "../../outbound/routesAdapter";
import { Route } from "../../../core/domain/route";
import { computeCB, TARGET_INTENSITY } from "../../../core/application/computeCB";

const router = express.Router();

router.get("/routes", async (_req, res) => {
  const routes = await getAllRoutes();
  res.json(routes);
});

router.post("/routes/:id/baseline", async (req, res) => {
  const id = req.params.id;
  const updated = await setBaseline(id);
  if (!updated) return res.status(404).json({ error: "Route not found" });
  res.json({ ok: true, route: updated });
});

router.get("/routes/comparison", async (_req, res) => {
  const baseline = await getBaseline();
  if (!baseline) return res.status(400).json({ error: "No baseline set" });

  const all = (await getAllRoutes()).filter((r: Route) => r.id !== baseline.id);
  const comparison = all.map((r: Route) => {
    const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    const compliant = r.ghgIntensity <= TARGET_INTENSITY;
    return {
      routeId: r.routeId,
      ghgIntensityBaseline: baseline.ghgIntensity,
      ghgIntensityComparison: r.ghgIntensity,
      percentDiff,
      compliant
    };
  });
  res.json({ baseline: baseline.routeId, comparison });
});

export default router;
