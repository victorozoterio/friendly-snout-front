import type { SortableKey, SortState } from '../../utils';

export type SortIconProps = {
  colKey: SortableKey;
  sortState: SortState;
};

export type SortableThProps = {
  w: string;
  colKey: SortableKey;
  sortState: SortState;
  onSort: (key: SortableKey) => void;
  children: React.ReactNode;
};
