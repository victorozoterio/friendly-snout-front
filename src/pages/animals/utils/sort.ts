import type * as React from 'react';

export type SortDir = 'ASC' | 'DESC';
export type SortState = { key: SortableKey | null; dir: SortDir | null };

export const DEFAULT_SORT_BY = 'createdAt:DESC';
export const DEFAULT_SORT_STATE: SortState = { key: null, dir: null };

export const SORT_FIELDS = {
  status: 'status',
  name: 'name',
  species: 'species',
  breed: 'breed',
  size: 'size',
  castrated: 'castrated',
  fiv: 'fiv',
  felv: 'felv',
} as const;

export type SortableKey = keyof typeof SORT_FIELDS;

export const nextSort = (prev: SortState, clickedKey: SortableKey): SortState => {
  if (prev.key !== clickedKey) return { key: clickedKey, dir: 'ASC' };
  if (prev.dir === 'ASC') return { key: clickedKey, dir: 'DESC' };
  return DEFAULT_SORT_STATE;
};

export const buildSortBy = (sort: SortState): string => {
  if (!sort.key || !sort.dir) return DEFAULT_SORT_BY;
  return `${SORT_FIELDS[sort.key]}:${sort.dir}`;
};

export const applySort = (
  key: SortableKey,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  setSortState: React.Dispatch<React.SetStateAction<SortState>>,
  setSortBy: React.Dispatch<React.SetStateAction<string>>,
) => {
  setPage(1);
  setSortState((prev) => {
    const next = nextSort(prev, key);
    setSortBy(buildSortBy(next));
    return next;
  });
};
