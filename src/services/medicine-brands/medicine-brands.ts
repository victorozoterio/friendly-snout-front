import { Pagination } from '../../utils';
import { api } from '../axios';
import * as T from './types';

export const createMedicineBrand = async ({ name }: T.CreateMedicineBrandRequest) => {
  const { data } = await api.post('/medicine-brands', {
    name,
  });

  return data;
};

export const getAllMedicineBrands = async ({
  page = 1,
  limit = 10,
  sortBy = 'createdAt:DESC',
  search,
}: T.GetAllMedicineBrandsParams) => {
  const { data } = await api.get<Pagination<T.GetMedicineBrandResponse>>('/medicine-brands', {
    params: { page, limit, sortBy, search },
  });

  return data;
};

export const getMedicineBrandByUuid = async (uuid: string) => {
  const { data } = await api.get<T.GetMedicineBrandResponse>(`/medicine-brands/${uuid}`);
  return data;
};

export const updateMedicineBrand = async (uuid: string, { name }: T.UpdateMedicineBrandRequest) => {
  const { data } = await api.put(`/medicine-brands/${uuid}`, {
    name,
  });

  return data;
};

export const deleteMedicineBrand = async ({ uuid }: T.DeleteMedicineBrandRequest) => {
  const { data } = await api.delete(`/medicine-brands/${uuid}`);
  return data;
};
