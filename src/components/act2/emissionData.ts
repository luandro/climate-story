/**
 * Emission source data for Sankey flow visualization
 * Separated from component to avoid Fast Refresh warnings
 */

export interface EmissionSource {
  id: string;
  label: string;
  value: number; // percentage
  color: string;
  gasType: 'co2' | 'ch4' | 'n2o';
}

// Global emission sources (percentages)
export const WORLD_SOURCES: EmissionSource[] = [
  { id: 'energy', label: 'Geração de energia', value: 30, color: '#6B7280', gasType: 'co2' },
  { id: 'transport', label: 'Transporte', value: 15, color: '#4B5563', gasType: 'co2' },
  { id: 'industry', label: 'Indústria', value: 12, color: '#374151', gasType: 'co2' },
  { id: 'agriculture', label: 'Agricultura', value: 12, color: '#F59E0B', gasType: 'ch4' },
  { id: 'deforestation', label: 'Desmatamento', value: 18, color: '#DC2626', gasType: 'co2' },
];

// Brazil emission sources (percentages) - deforestation and agriculture much larger
export const BRAZIL_SOURCES: EmissionSource[] = [
  { id: 'energy', label: 'Geração de energia', value: 8, color: '#6B7280', gasType: 'co2' },
  { id: 'transport', label: 'Transporte', value: 12, color: '#4B5563', gasType: 'co2' },
  { id: 'industry', label: 'Indústria', value: 8, color: '#374151', gasType: 'co2' },
  { id: 'agriculture', label: 'Agropecuária', value: 28, color: '#F59E0B', gasType: 'ch4' },
  { id: 'deforestation', label: 'Desmatamento', value: 27, color: '#DC2626', gasType: 'co2' },
];

// Gas colors
export const GAS_COLORS = {
  co2: { from: 'rgba(127, 29, 29, 0.8)', to: 'rgba(127, 29, 29, 0.4)' }, // Dark red
  ch4: { from: 'rgba(245, 158, 11, 0.8)', to: 'rgba(245, 158, 11, 0.4)' }, // Orange
  n2o: { from: 'rgba(234, 179, 8, 0.8)', to: 'rgba(234, 179, 8, 0.4)' }, // Yellow
};
