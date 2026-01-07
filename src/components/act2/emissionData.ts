/**
 * Emission source data for Sankey flow visualization
 * Separated from component to avoid Fast Refresh warnings
 *
 * Sources:
 * - Global: WRI/IPCC sector breakdown
 * - Brazil: SEEG (Sistema de Estimativas de Emissões de Gases de Efeito Estufa)
 */

// Type for emission source IDs
export type EmissionSourceId = 'energy' | 'transport' | 'industry' | 'agriculture' | 'deforestation';

export interface EmissionSource {
  id: EmissionSourceId;
  label: string;
  value: number; // percentage (should sum to 100%)
  color: string;
  gasType: 'co2' | 'ch4' | 'n2o';
}

export function isValidSourceId(id: string): id is EmissionSourceId {
  return ['energy', 'transport', 'industry', 'agriculture', 'deforestation'].includes(id);
}

// Global emission sources (percentages - sum to 100%)
// Based on WRI/IPCC sector data
export const WORLD_SOURCES: EmissionSource[] = [
  { id: 'energy', label: 'Geração de energia', value: 31, color: '#6B7280', gasType: 'co2' },
  { id: 'transport', label: 'Transporte', value: 16, color: '#4B5563', gasType: 'co2' },
  { id: 'industry', label: 'Indústria', value: 21, color: '#374151', gasType: 'co2' },
  { id: 'agriculture', label: 'Agricultura', value: 14, color: '#F59E0B', gasType: 'ch4' },
  { id: 'deforestation', label: 'Desmatamento', value: 18, color: '#DC2626', gasType: 'co2' },
];

// Brazil emission sources (percentages - sum to 100%)
// Based on SEEG Brazil data - deforestation and agriculture dominate
export const BRAZIL_SOURCES: EmissionSource[] = [
  { id: 'energy', label: 'Geração de energia', value: 18, color: '#6B7280', gasType: 'co2' },
  { id: 'transport', label: 'Transporte', value: 4, color: '#4B5563', gasType: 'co2' },
  { id: 'industry', label: 'Indústria', value: 5, color: '#374151', gasType: 'co2' },
  { id: 'agriculture', label: 'Agropecuária', value: 27, color: '#F59E0B', gasType: 'ch4' },
  { id: 'deforestation', label: 'Desmatamento', value: 46, color: '#DC2626', gasType: 'co2' },
];

// Gas colors
export const GAS_COLORS = {
  co2: { from: 'rgba(127, 29, 29, 0.8)', to: 'rgba(127, 29, 29, 0.4)' }, // Dark red
  ch4: { from: 'rgba(245, 158, 11, 0.8)', to: 'rgba(245, 158, 11, 0.4)' }, // Orange
  n2o: { from: 'rgba(234, 179, 8, 0.8)', to: 'rgba(234, 179, 8, 0.4)' }, // Yellow
};
