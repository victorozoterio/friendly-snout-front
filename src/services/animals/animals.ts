import { api } from '../axios';
import * as T from './types';

export const totalAnimalsPerStage = async () => {
  const { data } = await api.get<T.TotalAnimalsPerStageResponse>('/animals/total-per-stage');
  return data;
};

export const getAllAnimals = async () => {
  const { data } = await api.get<T.GetAnimalResponse[]>('/animals');
  return data;
};
