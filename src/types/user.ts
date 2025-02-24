export interface IUserInfo {
  id?: number;
  username: string;
  password: string;
  email?: string;
  avatar?: string;
  roles?: string;
  permissions?: string[];
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ILoginResult {
  token: string;
  userInfo: IUserInfo;
}
