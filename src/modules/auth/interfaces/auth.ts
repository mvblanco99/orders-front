export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
  appVersion?: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  isActive: boolean;
  jwt: string;
}

export interface AuthUser {
  token: string;
  user: User;
}

export interface User {
  user: UserDetails;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileId: number;
  profileName: string;
  permissions: Permission[];
}

export interface Permission {
  action: string;
  subject: string;
  conditions: null;
  name: string;
}

export enum UserProfile {
  SYSTEM_MANAGER = 'Gerente de Sistemas',
  SUPPORT_SYSTEM = 'Soporte Sistema',
}
