import { api } from './axios';
import * as T from './types';

export const signIn = async ({ email, password }: T.SignIn) => {
  const { data } = await api.post('/auth/sign-in', {
    email,
    password,
  });
  return data;
};

export const refreshToken = async ({ refreshToken }: T.RefreshToken) => {
  const { data } = await api.post('/auth/refresh-token', {
    refreshToken,
  });
  return data;
};
