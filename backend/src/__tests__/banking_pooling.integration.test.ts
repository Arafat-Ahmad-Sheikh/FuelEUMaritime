import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index";
import { computeCB } from "../core/application/computeCB";

describe("Banking and Pooling integration (in-memory or DB)", () => {
  it("should bank a surplus for a ship and create a valid pool", async () => {
    // fetch routes
    const res = await request(app).get("/routes");
    expect(res.status).toBe(200);
    const routes = Array.isArray(res.body) ? res.body : res.body.routes;

    const r002 = routes.find((r: any) => r.routeId === "R002");
    const r003 = routes.find((r: any) => r.routeId === "R003");
    expect(r002).toBeDefined();
    expect(r003).toBeDefined();

    const cbR002 = computeCB(r002);
    const cbR003 = computeCB(r003);

    // bank a portion of R002's surplus
    const bankAmount = Math.min(1000000, Math.max(1, Math.floor(cbR002 / 10)));
    const bankResp = await request(app)
      .post("/banking/bank")
      .send({ shipId: r002.routeId, year: r002.year, amount: bankAmount });
    expect(bankResp.status).toBe(200);
    expect(bankResp.body.ok).toBeTruthy();
    expect(bankResp.body.cb_before).toBeGreaterThanOrEqual(bankAmount);

    // trying to apply bank to a different ship should fail (no available bank for that ship)
    const applyResp = await request(app)
      .post("/banking/apply")
      .send({ shipId: r003.routeId, year: r003.year, amount: bankAmount });
    expect([400, 404]).toContain(applyResp.status);

    // create a pool using two surplus ships (ensure sum >= 0)
    const surplusRoutes = routes.filter((r: any) => computeCB(r) > 0);
    expect(surplusRoutes.length).toBeGreaterThanOrEqual(2);
    const a = surplusRoutes[0];
    const b = surplusRoutes[1];
    const members = [
      { shipId: a.routeId, cb_before: computeCB(a) },
      { shipId: b.routeId, cb_before: computeCB(b) }
    ];

    const poolResp = await request(app).post("/pools").send({ members });
    expect(poolResp.status).toBe(200);
    expect(poolResp.body.ok).toBeTruthy();
    const returned = poolResp.body.members;
    expect(Array.isArray(returned)).toBeTruthy();
    const computedSumAfter = returned.reduce((s: number, m: any) => s + (m.cb_after || 0), 0);
    expect(computedSumAfter).toBeGreaterThanOrEqual(0);
  });
});
