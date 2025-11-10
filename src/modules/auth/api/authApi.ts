import { api } from 'src/boot/axios';
import type { User, LoginForm, LoginResponse } from '../interfaces/auth';

export const signIn = async (loginForm: LoginForm) => {
  const { email, password, appVersion } = loginForm;
  const resp = await api.post<LoginResponse>(
    'auth/login',
    {
      email,
      password,
      appVersion,
    },
    {
      timeout: 1000 * 5,
      timeoutErrorMessage: 'Tiempo de espera agotado para iniciar sesión',
    },
  );

  return resp.data.jwt;
};

export interface ValidateJwtResponse {
  token?: string;
  jwt?: string;
}

export const validateJwt = async () => {
  const resp = await api.get<ValidateJwtResponse>('auth/check-auth-token', {
    timeout: 1000 * 5,
    timeoutErrorMessage: 'Tiempo de espera agotado para validar el token',
  });
  return resp.data;
};

export const getMe = async () => {
  const resp = await api.get<User>('auth/me', {
    timeout: 1000 * 5,
    timeoutErrorMessage: 'Tiempo de espera agotado para validar el token',
  });
  return resp.data;
};
