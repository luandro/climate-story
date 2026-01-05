// Act 1 Demo Data
// All numeric values are sourced from story-data.json metrics
// This file provides typed access for components

export interface Act1Data {
  thermometer: {
    brazilAnomaly: number;
    globalAnomaly: number;
    baselineYear: number;
    referenceYear: number;
  };
  timeline: {
    dataPoints: Array<{
      year: number;
      anomaly: number;
    }>;
  };
  comparison: {
    globalAnomaly: number;
    brazilRegionalMax: number;
  };
}

// Demo data extracted from story-data.json metrics
export const act1Data: Act1Data = {
  thermometer: {
    brazilAnomaly: 2.2,      // brazil_regional_warming_max
    globalAnomaly: 1.6,      // global_warming_2024
    baselineYear: 1850,      // Pre-industrial reference
    referenceYear: 2024,
  },
  timeline: {
    dataPoints: [
      { year: 1900, anomaly: 0 },
      { year: 1920, anomaly: 0.1 },
      { year: 1940, anomaly: 0.15 },
      { year: 1960, anomaly: 0.2 },
      { year: 1980, anomaly: 0.4 },
      { year: 2000, anomaly: 0.8 },
      { year: 2010, anomaly: 1.1 },
      { year: 2020, anomaly: 1.4 },
      { year: 2024, anomaly: 1.6 },
    ],
  },
  comparison: {
    globalAnomaly: 1.6,
    brazilRegionalMax: 2.2,
  },
};
