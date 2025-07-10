export interface ApiResponse<T> {
  statusMessage: string;
  data: T;
}