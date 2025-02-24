import { request } from "./request";
import { ILoginResult, IUserInfo } from '@/types/user';

export const login = (data: IUserInfo) => request.post<ILoginResult>('/login', data);

export const register = (data: IUserInfo) => request.post<any>('/register', data);
