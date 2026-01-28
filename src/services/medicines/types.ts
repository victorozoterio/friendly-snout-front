import { PaginationParams } from '../../utils';

export type CreateMedicineRequest = {
  name: string;
  description?: string;
  quantity: number;
  medicineBrandUuid: string;
};

export type GetAllMedicinesParams = PaginationParams & {
  search?: string;
};

export type GetMedicineResponse = {
  uuid: string;
  name: string;
  description?: string;
  quantity: number;
  isActive: boolean;
  medicineBrand: {
    uuid: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateMedicineRequest = {
  name?: string;
  description?: string;
  quantity: number;
  medicineBrandUuid?: string;
};

export type ActivateMedicineRequest = {
  uuid: string;
};

export type DeactivateMedicineRequest = {
  uuid: string;
};

export type DeleteMedicineRequest = {
  uuid: string;
};
