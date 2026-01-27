export type TableSortState = {
  key: string | null;
  dir: 'ASC' | 'DESC' | null;
};

export type TableSortableHeaderProps = {
  w?: string;
  sortKey: string;
  sortState: TableSortState;
  onSort: (key: string) => void;
  children: React.ReactNode;
};
