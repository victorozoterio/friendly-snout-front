type PaginatedLinks = {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
};

type PaginatedMeta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [string, 'ASC' | 'DESC'][];
  search?: string;
  filter?: Record<string, unknown>;
};

export type Pagination<T> = {
  data: T[];
  meta: PaginatedMeta;
  links: PaginatedLinks;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string[];
  search?: string;
  filter?: Record<string, string>;
};
