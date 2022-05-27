// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseRequest<T> {
  keyWord?: string;

  status?: string;

  page?: number;

  perPage?: number;

  sortDate?: string;

  startDate?: Date;

  endDate?: Date;
}
