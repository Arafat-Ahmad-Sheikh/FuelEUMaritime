import { Route } from "../domain/route";

export const TARGET_INTENSITY = 89.3368; // gCO2e/MJ
export const MJ_PER_TONNE = 41000; // MJ/t

export function energyInScope(fuelTons: number): number {
  return fuelTons * MJ_PER_TONNE;
}

export function computeCB(route: Route, target = TARGET_INTENSITY): number {
  // CB = (Target - Actual) * EnergyInScope
  const energy = energyInScope(route.fuelConsumption);
  return (target - route.ghgIntensity) * energy; // gCO2e
}
