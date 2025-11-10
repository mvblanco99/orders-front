import { api } from 'src/boot/axios';
import type {
  RequestPassword,
  VerifyCode,
  ResetPassword,
} from '../interfaces/resetPasswordInterface';

export const requestPassword = async (requestPassword: RequestPassword) => {
  const { email } = requestPassword;
  const resp = await api.post(
    'auth/request-password-reset',
    {
      email,
    },
    {
      timeout: 1000 * 5,
      timeoutErrorMessage: 'Tiempo de espera agotado para solicitar el cambio de contraseña',
    },
  );
  return resp.data;
};

export const verifyCode = async (verifyCode: VerifyCode) => {
  const { email, code } = verifyCode;
  const resp = await api.post(
    'auth/verify-reset-code',
    {
      email,
      code,
    },
    {
      timeout: 1000 * 5,
      timeoutErrorMessage: 'Tiempo de espera agotado para verificar el código',
    },
  );
  return resp.data;
};

export const resetPassword = async (resetPassword: ResetPassword) => {
  const { sessionToken, newPassword, confirmPassword } = resetPassword;
  const resp = await api.post(
    'auth/reset-password',
    {
      sessionToken,
      newPassword,
      confirmPassword,
    },
    {
      timeout: 1000 * 5,
      timeoutErrorMessage: 'Tiempo de espera agotado para cambiar la contraseña',
    },
  );
  return resp.data;
};
