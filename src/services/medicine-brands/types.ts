import { PaginationParams } from '../../utils';

export type CreateMedicineBrandRequest = {
  name: string;
};

export type GetAllMedicineBrandsParams = PaginationParams & {
  search?: string;
};

export type GetMedicineBrandResponse = {
  uuid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateMedicineBrandRequest = {
  name?: string;
};

export type DeleteMedicineBrandRequest = {
  uuid: string;
};
