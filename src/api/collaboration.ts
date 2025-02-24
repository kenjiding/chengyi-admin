import { request } from "./request";
import { ICollaboration } from '@/types/collaboration';

export const getCollaborations = () => 
  request.get<ICollaboration[]>('/collaborations');

export const getCollaboration = (id: number) => 
  request.get<ICollaboration>(`/collaborations/${id}`);

export const addCollaboration = (data: ICollaboration) => 
  request.post<ICollaboration>('/collaborations', data);

export const updateCollaboration = (id: number, data: Partial<ICollaboration>) => 
  request.put<ICollaboration>(`/collaborations/${id}`, data);

export const deleteCollaboration = (id: number) => 
  request.delete<void>(`/collaborations/${id}`);