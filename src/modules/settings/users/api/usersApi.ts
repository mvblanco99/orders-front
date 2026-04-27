import { api } from 'src/boot/axios';
import type { UserDetail, UserResponse, UserSearchParams } from '../interfaces/userInterface';
import type {
  CreateUserDto,
  CreateUserResponse,
  UpdateUserDto,
  UpdateUserResponse,
} from '../interfaces/CreateUserDto';

const resourceUrl = 'users';

export const findAllUsers = async (params?: UserSearchParams): Promise<UserResponse> => {
  const res = await api.get<UserResponse>(resourceUrl, { params });
  return res.data;
};

export const findOneById = async (id: number): Promise<UserDetail> => {
  const res = await api.get<UserDetail>(`${resourceUrl}/${id}`);
  return res.data;
};

export const createUser = async (body: CreateUserDto): Promise<CreateUserResponse> => {
  const res = await api.post<CreateUserResponse>(resourceUrl, body);
  return res.data;
};

export const updateUser = async (id: number, body: UpdateUserDto): Promise<UpdateUserResponse> => {
  const res = await api.patch<UpdateUserResponse>(`${resourceUrl}/${id}`, body);
  return res.data;
};
