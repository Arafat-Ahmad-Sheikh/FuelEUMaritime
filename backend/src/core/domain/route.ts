export type Route = {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumption: number; // t
  distance: number; // km
  totalEmissions: number; // t
  isBaseline?: boolean;
};
