import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { PAGINATION_CONFIGURATION, TABLE_SORT_DIRECTION } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { PaginationResponseDTO, ResponseDTO } from 'src/dto/base.dto';
import { IHttpService } from 'src/services/http.service';
import {
  BodyCreateAccountDTO,
  BodyUpdateAccountDTO,
  CreateAccountDTO,
  GetAccountDetailDTO,
  GetListUserAssignDTO,
  GetNewLinkActiveAccount,
  GetUserAssignByEmailDTO,
  IAccountManagement,
  IAccountManagementItem,
  IAccountManagementListRequest,
  IBodyGetUserAssignByEmail,
  ListAccountManagementDTO,
  ResponseAccountDTO,
  ResponseActiveLinkDTO,
  UpdateAccountDTO
} from 'src/dto/account-management-list.dto';
import {
  IAccountInfo,
  IUserResponseGetByEmail,
  IUserRole,
  Role
} from 'src/interfaces/user';

const DEFAULT_SORT_COLUMN = 'updateTime';

export interface IAccountListStore {
  listAccountManagement: IAccountManagementItem[];
  listRole: IUserRole[];
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  getRole(): Promise<boolean>;
  createAccount(
    body: BodyCreateAccountDTO
  ): Promise<ResponseDTO<ResponseAccountDTO>>;
  updateAccount(
    body: BodyUpdateAccountDTO,
    param: { id: string }
  ): Promise<ResponseDTO<ResponseAccountDTO>>;
  sortDirection: TABLE_SORT_DIRECTION;
  fetchList(request?: IAccountManagementListRequest): Promise<void>;
  configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION): void;
  getDetailAccount(param: { id: string }): Promise<ResponseDTO<IAccountInfo>>;
  getListUserAssign(
    request: IAccountManagementListRequest & { exclude_roles?: string }
  ): Promise<ResponseDTO<IAccountManagement>>;
  getNewLinkActiveAccount(body: {
    email: string;
  }): Promise<ResponseDTO<ResponseActiveLinkDTO>>;
  getUserAssignByEmail(
    body: IBodyGetUserAssignByEmail
  ): Promise<ResponseDTO<IUserResponseGetByEmail>>;
}
export class AccountManagementListStore implements IAccountListStore {
  listAccountManagement: IAccountManagementItem[] = [];
  listRole: IUserRole[] = [];
  totalPages = 0;
  totalRecords = 0;
  pageSize = PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
  pageNumber = PAGINATION_CONFIGURATION.DEFAULT_PAGE;
  sortBy = DEFAULT_SORT_COLUMN;
  sortDirection = TABLE_SORT_DIRECTION.DESC;

  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      listAccountManagement: observable.ref,
      listRole: observable.ref,
      configSortOption: action.bound
    });
  }

  public configSortOption(sortBy: string, sortDirection: TABLE_SORT_DIRECTION) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  public async fetchList(
    request: IAccountManagementListRequest
  ): Promise<void> {
    const requestDTO = new ListAccountManagementDTO(request);

    const listAccountApplication: PaginationResponseDTO<IAccountManagement> =
      await this.http.request<ListAccountManagementDTO, IAccountManagement>(
        requestDTO
      );

    if (
      listAccountApplication.responseCode == HTTP_STATUS_RESPONSE_KEY.SUCCESS
    ) {
      runInAction(() => {
        this.listAccountManagement =
          listAccountApplication.data &&
          (listAccountApplication.data.paginatedResults as any);
        this.totalPages = listAccountApplication?.data?.total ?? 0;
        this.totalRecords = listAccountApplication.totalRecords ?? 0;
        this.pageSize =
          listAccountApplication.pageSize ??
          PAGINATION_CONFIGURATION.DEFAULT_PAGE_SIZE;
        this.pageNumber =
          listAccountApplication.pageNumber ??
          PAGINATION_CONFIGURATION.DEFAULT_PAGE;
      });
    }
  }

  public async getListUserAssign(
    request: IAccountManagementListRequest & { exclude_roles?: string }
  ): Promise<ResponseDTO<IAccountManagement>> {
    const requestDTO = new GetListUserAssignDTO(request);
    return this.http.request(requestDTO);
  }
  public async createAccount(body: BodyCreateAccountDTO) {
    const createAccountDto = new CreateAccountDTO(body);
    const res: ResponseDTO<ResponseAccountDTO> = await this.http.request(
      createAccountDto
    );
    return res;
  }
  public async updateAccount(
    body: BodyUpdateAccountDTO,
    param: { id: string }
  ) {
    const updateAccountDTO = new UpdateAccountDTO(body, param);
    const res: ResponseDTO<ResponseAccountDTO> = await this.http.request(
      updateAccountDTO
    );
    return res;
  }

  public async getNewLinkActiveAccount(body: ResponseActiveLinkDTO) {
    const getNewLinkActiveDto = new GetNewLinkActiveAccount(body);
    const res: ResponseDTO<ResponseActiveLinkDTO> = await this.http.request(
      getNewLinkActiveDto
    );
    return res;
  }

  public async getDetailAccount(query: { id: string }) {
    const getAccountDetailDTO = new GetAccountDetailDTO(query);
    const res: ResponseDTO<IAccountInfo> = await this.http.request(
      getAccountDetailDTO
    );
    return res;
  }

  public async getRole(): Promise<boolean> {
    runInAction(() => {
      this.listRole = [
        { _id: '1', name: 'admin', role: Role.ADMIN },
        { _id: '2', name: 'user', role: Role.USER }
      ];
    });
    return true;
  }

  public async getUserAssignByEmail(
    body: IBodyGetUserAssignByEmail
  ): Promise<ResponseDTO<IUserResponseGetByEmail>> {
    const getUserAssignByEmailDTO = new GetUserAssignByEmailDTO(body);
    return await this.http.request<
      GetUserAssignByEmailDTO,
      IUserResponseGetByEmail
    >(getUserAssignByEmailDTO);
  }
}
