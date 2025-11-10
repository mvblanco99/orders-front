import type { Permission } from './permissionInterface';

export interface ProfileDtoI {
  name: string;
  isActive?: boolean;
}
export interface DataFilterI {
  limit?: number;
  offset?: number;
  inputSearch?: string;
}

export interface ProfileResponseI {
  data: ProfileItemI[];
  total: number;
}

export interface ProfileItemI {
  id: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: Count;
}

export interface Count {
  Users: number;
  Permissions: number;
}

export interface ProfileI {
  id?: number;
  name: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  Permissions?: Permission[];
  _count?: Count;
}

export interface ProfilePermissionsI {
  items: PermissionI[];
}

export interface PermissionI {
  id: number;
}
