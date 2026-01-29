import { Pagination } from '../../utils';
import { api } from '../axios';
import * as T from './types';

export const createAttachment = async ({ animalUuid, file }: T.CreateAttachmentRequest) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(`/attachments/animal/${animalUuid}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};
export const getAllAttachments = async ({
  animalUuid,
  page = 1,
  limit = 10,
  sortBy = 'createdAt:DESC',
  search,
}: T.GetAllAttachmentsParams) => {
  const { data } = await api.get<Pagination<T.GetAttachmentResponse>>(`/attachments/by-animal/${animalUuid}`, {
    params: { page, limit, sortBy, search },
  });

  return data;
};

export const deleteAttachment = async ({ uuid }: T.DeleteAttachmentRequest) => {
  const { data } = await api.delete(`/attachments/${uuid}`);
  return data;
};
