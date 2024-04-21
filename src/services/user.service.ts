import {
  AccountChangePasswordDTO,
  IUpdatePasswordBody
} from 'src/dto/account.dto';
import { IHttpService } from './http.service';
import {
  GetProfileDTO,
  UpdateProfileDTO,
  UpdateProfileResponse
} from 'src/dto/user.dto';
import { ResponseDTO } from 'src/dto/base.dto';
import { IUserInfo } from 'src/interfaces/user';
import { IAuthenticationService } from './authentication.service';

export interface IUserService {
  changePassword(dto: IUpdatePasswordBody): Promise<any>;
  getUserProfile(): Promise<ResponseDTO<IUserInfo>>;
  updateUserProfile(
    body: FormData
  ): Promise<ResponseDTO<UpdateProfileResponse>>;
}
export class UserService implements IUserService {
  constructor(private readonly httpService: IHttpService,
    private readonly authService: IAuthenticationService
    ) {}
  public async changePassword(dto: IUpdatePasswordBody): Promise<any> {
    const changePasswordDTO = new AccountChangePasswordDTO(dto);
    // ResponseDTO<IChangePasswordResponse>
    const res = await this.httpService.request(changePasswordDTO);
    return res;
  }
  public async getUserProfile(): Promise<ResponseDTO<IUserInfo>> {
    const getProfileDTO = new GetProfileDTO();
    
    const res = await this.httpService.request<GetProfileDTO, IUserInfo>(
      getProfileDTO
    )

    res.data?.role && this.authService.setPermissionRole(res.data.role,this.httpService.getRememberMe())
    return res;
  }
  public async updateUserProfile(
    body: FormData
  ): Promise<ResponseDTO<UpdateProfileResponse>> {
    const updateProfileDTO = new UpdateProfileDTO(body);
    return await this.httpService.request<
      UpdateProfileDTO,
      UpdateProfileResponse
    >(updateProfileDTO);
  }
}
