export interface UserResponse {
  data: UserItem[];
  meta: Meta;
}

export interface UserItem {
  id: number;
  email: string;
  name: string;
  roles: string;
  tenant: Tenant;
  ct_teleoperator?: Teleoperator;
  isActive: boolean;
}

export enum TypeTenantEnum {
  VITAL = 'VITAL',
  SUPPLIER = 'SUPPLIER',
  CLIENT = 'CLIENT',
}

export interface Tenant {
  id: number;
  name: string;
  typeTenant: TypeTenantEnum;
  resourceId: number;
}

export interface Meta {
  total: number;
}

export interface UserDetail {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  tenantType: string;
  tenantResourceId: number;
  tenantName: string;
  profileId: number;
  profileName: string;
  relationId: number;
  erp_salespeopleId: number | string;
}

export interface Profile {
  id: number;
  name: string;
}

export interface VitalUser {
  id: number;
  email: string;
  phone: null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  typeTenant: TypeTenantEnum;
  resourceId: number;
  name: string;
}

export interface Profile {
  id: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  Permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  action: string;
  subject: string;
  type: string;
  conditions: null;
}

export interface Teleoperator {
  id: number;
}

export enum UserProfileId {
  SYSTEM_MANAGER = 1,
  CUSTOMER = 2,
  LAB_MANAGER = 3,
  LAB_SELLER = 4,
  TRIANGULATION_AGENT = 5,
  TRIANGULATION_MANAGER = 6,
  COLLECTIONS_MANAGER = 7,
  COLLECTIONS_ANALYST = 8,
  TELEOPERATOR_AGENT = 9,
  TELEOPERATOR_MANAGER = 10,
  COMMERCIAL_MANAGER = 11,
  TEST_CUSTOMER = 13,
  TEST_LAB_MANAGER = 14,
  TEST_LAB_SELLER = 15,
}
