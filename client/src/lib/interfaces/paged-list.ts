export interface PagedList<T, TCursor> {
  items: T[];
  nextCursor: TCursor;
}
