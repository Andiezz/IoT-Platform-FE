import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { PAGINATION_CONFIGURATION, TABLE_SORT_DIRECTION } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { ResponseDTO } from 'src/dto/base.dto';
import {
  IThing,
  IThingItem,
  BodyCreateThingDTO,
  CreateThingDTO,
  DeleteThingDTO,
  DownloadCertificateDTO,
  GetThingDetailDTO,
  IThingListRequest,
  ListThingDTO,
  ResponseThingDTO,
  UpdateThingtDTO,
  IGetThingFile,
  IBodyGetUserAssignByEmail,
  IUserOwnerResponseGetByEmail,
  GetUserAssignManagerByEmailDTO
} from 'src/dto/thing.dto';
import { IHttpService } from 'src/services/http.service';

const DEFAULT_SORT_COLUMN = 'createdOn';

export interface IThingListStore {
  listThing: IThingItem[];
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: TABLE_SORT_DIRECTION;
  fetchList(request?: IThingListRequest): Promise<void>;
  getDetailThing(param: { id: string }): Promise<ResponseDTO<IThingItem>>;
  configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION): void;
  updateThing(
    body: BodyCreateThingDTO,
    param: { id: string }
  ): Promise<ResponseDTO<ResponseThingDTO>>;
  deleteThing(param: {
    thingId: string;
  }): Promise<ResponseDTO<ResponseThingDTO>>;
  createThing(
    body: BodyCreateThingDTO
  ): Promise<ResponseDTO<{ files: IGetThingFile[]; id: string }>>;
  downloadCertificate(param: {
    id: string;
  }): Promise<ResponseDTO<{ files: IGetThingFile[] }>>;
  getUserAssignOwnerByEmail(
    body: IBodyGetUserAssignByEmail
  ): Promise<ResponseDTO<IUserOwnerResponseGetByEmail>>;
}

export class ThingListStore implements IThingListStore {
  listThing: IThingItem[] = [];
  totalPages = 0;
  totalRecords = 0;
  pageSize = PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
  pageNumber = PAGINATION_CONFIGURATION.DEFAULT_PAGE;
  sortBy = DEFAULT_SORT_COLUMN;
  sortDirection = TABLE_SORT_DIRECTION.DESC;

  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      listThing: observable.ref,
      configSortOption: action.bound
    });
  }

  public configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  public async fetchList(request: IThingListRequest): Promise<void> {
    const requestDTO = new ListThingDTO(request);
    const res: ResponseDTO<IThing> = await this.http.request<
      ListThingDTO,
      IThing
    >(requestDTO);

    if (res.responseCode == HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      const listThingApplication = res.data;
      runInAction(() => {
        this.listThing = listThingApplication?.paginatedResults || [];
        this.totalPages = listThingApplication?.total ?? 0;

        this.totalRecords = listThingApplication?.total ?? 0;

        this.pageSize =
          listThingApplication?.limit ??
          PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
        this.pageNumber =
          listThingApplication?.page ?? PAGINATION_CONFIGURATION.DEFAULT_PAGE;
      });
    }
  }

  public async deleteThing(param: { thingId: string }) {
    const deleteThingDTO = new DeleteThingDTO(param);
    const res: ResponseDTO<ResponseThingDTO> = await this.http.request(
      deleteThingDTO
    );
    return res;
  }

  public async getDetailThing(query: { id: string }) {
    const getThingDetailDTO = new GetThingDetailDTO(query);
    const res: ResponseDTO<IThingItem> = await this.http.request(
      getThingDetailDTO
    );
    return res;
  }

  public async updateThing(body: BodyCreateThingDTO, param: { id: string }) {
    const updateThingDTO = new UpdateThingtDTO(body, param);
    const res: ResponseDTO<ResponseThingDTO> = await this.http.request(
      updateThingDTO
    );
    return res;
  }

  public async createThing(body: BodyCreateThingDTO) {
    const createThingDto = new CreateThingDTO(body);
    const res: ResponseDTO<{ files: IGetThingFile[]; id: string }> =
      await this.http.request(createThingDto);
    return res;
  }

  public async downloadCertificate(param: {
    id: string;
  }): Promise<ResponseDTO<{ files: IGetThingFile[] }>> {
    const downloadCertificateDto = new DownloadCertificateDTO(param);
    const res: ResponseDTO<{ files: IGetThingFile[] }> =
      await this.http.request(downloadCertificateDto);
    return res;
  }

  public async getUserAssignOwnerByEmail(
    body: IBodyGetUserAssignByEmail
  ): Promise<ResponseDTO<IUserOwnerResponseGetByEmail>> {
    const getUserAssignOwnerByEmailDTO = new GetUserAssignManagerByEmailDTO(
      body
    );
    return await this.http.request<
      GetUserAssignManagerByEmailDTO,
      IUserOwnerResponseGetByEmail
    >(getUserAssignOwnerByEmailDTO);
  }
}

export interface IThingStore {
  thingDetail?: any;
  setThing: (value: IThingItem, idx: number) => void;
}

export class ThingStore implements IThingStore {
  thingDetail?: any;
  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      thingDetail: observable.ref,
      setThing: action.bound
    });
  }

  public setThing(values: any, idx: number): void {
    if (!values) {
      this.thingDetail = values;
      return;
    }
    this.thingDetail = {
      values: values,
      key: idx
    };
  }
}
