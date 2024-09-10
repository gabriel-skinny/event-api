export interface BaseControllerReturn<T = void> {
  message: string;
  data?: T;
  statusCode: HttpStatus;
}

export interface IBasePagination<T = void> {
  totalCount: number;
  actualPage: number;
  perPage: number;
  data: T;
  isNext: boolean;
}
