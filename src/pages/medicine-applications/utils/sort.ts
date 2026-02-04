import { createSortConfig, type SortState as SortStateGeneric } from '../../../utils';

const sortConfig = createSortConfig({
  fields: {
    medicine: 'medicine.name',
    quantity: 'quantity',
    frequency: 'frequency',
    appliedAt: 'appliedAt',
    endsAt: 'endsAt',
  },
  defaultSortBy: 'appliedAt:DESC',
});

export type SortableKey = keyof typeof sortConfig.fields;
export type SortState = SortStateGeneric<SortableKey>;
export const DEFAULT_SORT_BY = sortConfig.DEFAULT_SORT_BY;
export const DEFAULT_SORT_STATE = sortConfig.DEFAULT_SORT_STATE;
export const SORT_FIELDS = sortConfig.fields;
export const nextSort = sortConfig.nextSort;
export const buildSortBy = sortConfig.buildSortBy;
export const applySort = sortConfig.applySort;
