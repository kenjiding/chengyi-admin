import { request } from "./request";

export const uploadImage = (data: any) => 
  request.post<any>(`/upload`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
