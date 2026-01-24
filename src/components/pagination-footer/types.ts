export type PaginationFooterProps = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  isFetching?: boolean;
  onChangeLimit: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
};
