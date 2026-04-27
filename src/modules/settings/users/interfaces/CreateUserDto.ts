export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
  profileId?: number;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  lastName?: string;
  profileId?: number;
}

export interface CreatedUser {
  email: string;
  name: string;
  lastName: string;
  id: number;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileId: number;
}

export interface UpdatedUser {
  id: number;
  email: string;
  name: string;
  lastName: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileId: number;
  slug: string;
}

export interface CreateUserResponse {
  message: string;
  user: CreatedUser;
}

export interface UpdateUserResponse {
  message: string;
  user: UpdatedUser;
}
