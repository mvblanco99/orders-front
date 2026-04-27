export interface UserItem {
  id: number;
  email: string;
  name: string;
  lastName: string;
  slug: string;
  isActive: boolean;
  profileId: number;
  createdAt: Date;
}

export interface UserSearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserResponse {
  data: UserItem[];
  meta: Meta;
}

export interface Meta {
  total: number;
  page: number;
  totalPages: number;
}

export interface UserProfileDetail {
  id: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetail {
  id: number;
  email: string;
  name: string;
  lastName: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  Profile: UserProfileDetail;
}
