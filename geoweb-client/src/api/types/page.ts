export type Pages<T> = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  pageable: PageableObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type SortObject = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type PageableObject = {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
};

export type PaginationRequest = {
  page?: number;
  size?: number;
  sort?: string[];
};
