export interface Pagination {
  page: number;
  rowsPerPage: number;
  sortBy: string;
  descending: boolean;
  rowsNumber?: number;
  filter?: string;
}
