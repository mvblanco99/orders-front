export interface ZoneItem {
  id: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ZoneResponse {
  data: ZoneItem[];
  meta: {
    total: number;
  };
}

export interface ZoneFilter {
  limit?: number;
  offset?: number;
  profileId?: number;
  parentId?: number;
  inputSearch?: string;
}

export interface ZoneDto {
  id: number | undefined;
  name: string;
  isActive: boolean;
}
