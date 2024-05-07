import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { PAGINATION_CONFIGURATION, TABLE_SORT_DIRECTION } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { PaginationResponseDTO, ResponseDTO } from 'src/dto/base.dto';
import {
  BodyCreateParameterDTO,
  BodyUpdateParameterDTO,
  CreateParameterDTO,
  DeleteParameterDTO,
  GetParameterDetailDTO,
  IParameter,
  IParameterListRequest,
  IThreshold,
  ListParameterDTO,
  ResponseParameterDTO,
  UpdateParameterDTO
} from 'src/dto/parameter.dto';
import { IUserRole } from 'src/interfaces/user';
import { IHttpService } from 'src/services/http.service';

export interface IParameterStore {
  listParameter: IParameterItem[];
  listRole: IUserRole[];
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  createParameter(
    body: BodyCreateParameterDTO
  ): Promise<ResponseDTO<ResponseParameterDTO>>;
  updateParameter(
    body: BodyUpdateParameterDTO,
    param: { id: string }
  ): Promise<ResponseDTO<ResponseParameterDTO>>;
  deleteParameter(param: { id: string }): Promise<boolean>;
  sortDirection: TABLE_SORT_DIRECTION;
  fetchList(request?: IParameterListRequest): Promise<void>;
  configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION): void;
  getDetailParameter(param: { id: string }): Promise<ResponseDTO<ResponseParameterDTO>>;
}

export interface IParameterItem {
  _id: string;
  name: string;
  unit: string;
  weight: number;
  thresholds: IThreshold[];
}

const DEFAULT_SORT_COLUMN = 'updateTime';

export class ParameterStore implements IParameterStore {
  listParameter: IParameterItem[] = [];
  listRole: IUserRole[] = [];
  totalPages = 0;
  totalRecords = 0;
  pageSize = PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
  pageNumber = PAGINATION_CONFIGURATION.DEFAULT_PAGE;
  sortBy = DEFAULT_SORT_COLUMN;
  sortDirection = TABLE_SORT_DIRECTION.DESC;

  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      listParameter: observable.ref,
      listRole: observable.ref,
      configSortOption: action.bound
    });
  }

  public configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  public async fetchList(request: IParameterListRequest): Promise<void> {
    const requestDTO = new ListParameterDTO(request);

    const listParameter: PaginationResponseDTO<IParameter> =
      await this.http.request<ListParameterDTO, IParameter>(requestDTO);

    if (listParameter.responseCode == HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.listParameter =
          listParameter.data && (listParameter.data.paginatedResults as any);
        this.totalPages = (listParameter.data && listParameter.data.total) || 0;
        this.totalRecords = listParameter.totalRecords || 0;
        this.pageSize =
          listParameter.pageSize || PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
        this.pageNumber =
          listParameter.pageNumber || PAGINATION_CONFIGURATION.DEFAULT_PAGE;
      });
    }
  }

  public async createParameter(body: BodyCreateParameterDTO) {
    const createParameterDto = new CreateParameterDTO(body);
    const res: ResponseDTO<ResponseParameterDTO> = await this.http.request(
      createParameterDto
    );
    return res;
  }
  public async updateParameter(
    body: BodyUpdateParameterDTO,
    param: { id: string }
  ) {
    const updateAccountDTO = new UpdateParameterDTO(body, param);
    const res: ResponseDTO<ResponseParameterDTO> = await this.http.request(
      updateAccountDTO
    );
    return res;
  }

  public async getDetailParameter(query: { id: string }) {
    const getParameterDetailDTO = new GetParameterDetailDTO(query);
    const res: ResponseDTO<ResponseParameterDTO> = await this.http.request(
      getParameterDetailDTO
    );
    return res;
  }

  public async deleteParameter(param: { id: string }): Promise<boolean> {
    const deleteEmsDto = new DeleteParameterDTO(param);
    const res = await this.http.request(deleteEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      return true;
    }
    return false;
  }
}
