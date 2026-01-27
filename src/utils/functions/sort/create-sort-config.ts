import * as React from 'react';

export type SortDir = 'ASC' | 'DESC';

export type SortState<K extends string> = {
  key: K | null;
  dir: SortDir | null;
};

export type CreateSortConfigParams<K extends string> = {
  fields: Record<K, string>;
  defaultSortBy: string;
};

export function createSortConfig<K extends string>({
  fields,
  defaultSortBy,
}: CreateSortConfigParams<K>) {
  const DEFAULT_SORT_BY = defaultSortBy;
  const DEFAULT_SORT_STATE: SortState<K> = { key: null, dir: null };

  function nextSort(prev: SortState<K>, clickedKey: K): SortState<K> {
    if (prev.key !== clickedKey) return { key: clickedKey, dir: 'ASC' };
    if (prev.dir === 'ASC') return { key: clickedKey, dir: 'DESC' };
    return DEFAULT_SORT_STATE;
  }

  function buildSortBy(sort: SortState<K>): string {
    if (!sort.key || !sort.dir) return DEFAULT_SORT_BY;
    return `${fields[sort.key]}:${sort.dir}`;
  }

  function applySort(
    key: K,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    setSortState: React.Dispatch<React.SetStateAction<SortState<K>>>,
    setSortBy: React.Dispatch<React.SetStateAction<string>>,
  ) {
    setPage(1);
    setSortState((prev) => {
      const next = nextSort(prev, key);
      setSortBy(buildSortBy(next));
      return next;
    });
  }

  return {
    DEFAULT_SORT_BY,
    DEFAULT_SORT_STATE,
    fields,
    nextSort,
    buildSortBy,
    applySort,
  };
}
