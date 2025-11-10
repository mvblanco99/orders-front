import { api } from 'src/boot/axios';
import type { UserDetail, UserResponse } from '../interfaces/userInterface';
import type { AddUserResponse, CreateUserDto } from '../interfaces/CreateUserDto';
import type {
  AssignedClientDto,
  ClientsAssociatesInterface,
  DisassociateClientDto,
} from '../interfaces/assingClientsInterfaces';

const resourceUrl = 'users';

export const findAllUsers = async (): Promise<UserResponse> => {
  const res = await api.get<UserResponse>(resourceUrl);
  return res.data;
};

export const findOneById = async (id: number): Promise<UserDetail> => {
  const res = await api.get(`${resourceUrl}/${id}`);
  return res.data;
};

export const findUserByProfileId = async (profileId: number): Promise<UserResponse> => {
  const res = await api.get(`${resourceUrl}/by-profile/${profileId}`);
  return res.data;
};

export const toggleActiveUser = async (payload: {
  id: number;
  body: CreateUserDto;
}): Promise<unknown> => {
  const { id, ...body } = payload;
  const res = await api.patch(`${resourceUrl}/${id}`, body);
  return res.data;
};

export const createUser = async (body: CreateUserDto) => {
  const res = await api.post<AddUserResponse>(`${resourceUrl}/create`, body);
  return res.data;
};

export const updateUser = async (userId: number, body: Partial<CreateUserDto>) => {
  const res = await api.patch(`${resourceUrl}/${userId}/update`, body);
  return res.data;
};

export const findClientsByProfile = async (userId: number, profileId: number) => {
  const res = await api.get<ClientsAssociatesInterface[]>(
    `users-clients/clients/by-profile/${profileId}/${userId}`,
  );
  return res.data;
};

export const assignedClient = async (body: AssignedClientDto) => {
  const res = await api.post(`users-clients/assigned-clients`, body);
  return res.data;
};

export const disassociateClient = async (body: DisassociateClientDto) => {
  const res = await api.patch(`users-clients/disassociate-client`, body);
  return res.data;
};
