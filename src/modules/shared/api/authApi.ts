import { api } from 'src/boot/axios';

interface ILogin {
  email: string;
  password: string;
}

export const isAuthorizedApi = async (body: ILogin) => {
  return api.post('/auth/check-user-is-admin', {
    email: body.email,
    password: body.password,
  });
};
