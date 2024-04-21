import { ResponseType } from 'axios';
import { HTTP_METHOD } from 'src/constants/api';

export abstract class DTO {
  public abstract param: object | undefined;
  public abstract query: unknown;
  public abstract body: unknown;
  public abstract readonly url: string;
  public abstract readonly method: HTTP_METHOD;
  public responseType?: ResponseType;
  public headers?: object;
  public refresh_token?: string | null;
}

export abstract class ResponseDTO<T> {
  public readonly responseCode?: string;
  public readonly timestamp?: string;
  public readonly message?: string;
  public abstract readonly data: T | undefined;
}

export interface IBasePaginationRequest {
  pageNumber?: number;
  pageSize?: number;
}

export abstract class PaginationResponseDTO<T> extends ResponseDTO<T> {
  public readonly totalRecords?: number;
  public readonly totalPages?: number;
  public readonly pageNumber?: number;
  public readonly pageSize?: number;
}

export interface PaginationResponse<T> {
  current: number;
  limit: number;
  page: number;
  paginatedResults: Array<T>;
  total: number;
}
