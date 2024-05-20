import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { PAGINATION_CONFIGURATION, TABLE_SORT_DIRECTION } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { PaginationResponseDTO, ResponseDTO } from 'src/dto/base.dto';
import {
  ResponseDeviceModelDTO,
  IDeviceModelListRequest,
  ListDeviceModelDTO,
  IDeviceModel,
  CreateDeviceModelDTO,
  UpdateDeviceModelDTO,
  GetDeviceModelDetailDTO,
  DeleteDeviceModelDTO,
  BodyCreateDeviceModelDTO,
  BodyUpdateDeviceModelDTO
} from 'src/dto/device-model.dto';
import { IUserRole } from 'src/interfaces/user';
import { IHttpService } from 'src/services/http.service';
import { IParameterItem } from '../parameter/parameter.store';

export interface IDeviceModelStore {
  listDeviceModel: IDeviceModelItem[];
  listRole: IUserRole[];
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  createDeviceModel(
    body: BodyCreateDeviceModelDTO
  ): Promise<ResponseDTO<ResponseDeviceModelDTO>>;
  updateDeviceModel(
    body: BodyUpdateDeviceModelDTO,
    param: { id: string }
  ): Promise<ResponseDTO<ResponseDeviceModelDTO>>;
  deleteDeviceModel(param: { id: string }): Promise<boolean>;
  sortDirection: TABLE_SORT_DIRECTION;
  fetchList(request?: IDeviceModelListRequest): Promise<void>;
  configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION): void;
  getDetailDeviceModel(param: {
    id: string;
  }): Promise<ResponseDTO<ResponseDeviceModelDTO>>;
}

export interface IDeviceModelItem {
  _id: string;
  name: string;
  information: string;
  type: string;
  parameterStandards: IParameterItem[];
}

const DEFAULT_SORT_COLUMN = 'updateTime';

export class DeviceModelStore implements IDeviceModelStore {
  listDeviceModel: IDeviceModelItem[] = [];
  listRole: IUserRole[] = [];
  totalPages = 0;
  totalRecords = 0;
  pageSize = PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
  pageNumber = PAGINATION_CONFIGURATION.DEFAULT_PAGE;
  sortBy = DEFAULT_SORT_COLUMN;
  sortDirection = TABLE_SORT_DIRECTION.DESC;

  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      listDeviceModel: observable.ref,
      listRole: observable.ref,
      configSortOption: action.bound
    });
  }

  public configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  public async fetchList(request: IDeviceModelListRequest): Promise<void> {
    const requestDTO = new ListDeviceModelDTO(request);

    const listDeviceModel: PaginationResponseDTO<IDeviceModel> =
      await this.http.request<ListDeviceModelDTO, IDeviceModel>(requestDTO);

    if (listDeviceModel.responseCode == HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.listDeviceModel =
          listDeviceModel.data &&
          (listDeviceModel.data.paginatedResults as any);
        this.totalPages =
          (listDeviceModel.data && listDeviceModel.data.total) || 0;
        this.totalRecords = listDeviceModel.totalRecords || 0;
        this.pageSize =
          listDeviceModel.pageSize ||
          PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
        this.pageNumber =
          listDeviceModel.pageNumber || PAGINATION_CONFIGURATION.DEFAULT_PAGE;
      });
    }
  }

  public async createDeviceModel(body: BodyCreateDeviceModelDTO) {
    const createDeviceModelDto = new CreateDeviceModelDTO(body);
    const res: ResponseDTO<ResponseDeviceModelDTO> = await this.http.request(
      createDeviceModelDto
    );
    return res;
  }
  public async updateDeviceModel(
    body: BodyUpdateDeviceModelDTO,
    param: { id: string }
  ) {
    const updateAccountDTO = new UpdateDeviceModelDTO(body, param);
    const res: ResponseDTO<ResponseDeviceModelDTO> = await this.http.request(
      updateAccountDTO
    );
    return res;
  }

  public async getDetailDeviceModel(query: { id: string }) {
    const getDeviceModelDetailDTO = new GetDeviceModelDetailDTO(query);
    const res: ResponseDTO<ResponseDeviceModelDTO> = await this.http.request(
      getDeviceModelDetailDTO
    );
    return res;
  }

  public async deleteDeviceModel(param: { id: string }): Promise<boolean> {
    const deleteEmsDto = new DeleteDeviceModelDTO(param);
    const res = await this.http.request(deleteEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      return true;
    }
    return false;
  }
}
