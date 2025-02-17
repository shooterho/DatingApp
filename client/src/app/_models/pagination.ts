export type Pagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items?: T;
  pagination?: Pagination; //use to config pagination  bar
};
