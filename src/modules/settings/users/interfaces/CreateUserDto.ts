enum TypeTenantEnum {
  VITAL = 'VITAL',
  SUPPLIER = 'SUPPLIER',
  CLIENT = 'CLIENT',
}

export interface CreateUserDto {
  typeTenant: TypeTenantEnum | '';
  resourceId: number | undefined;
  profileId: number | undefined;
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  userErpCode: string | undefined;
}

export interface AddUserResponse {
  id: number;
  email: string;
  phone: null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileId: number;
  tenantId: number;
}
