export interface ZoneItem {
  id: number;
  code: string;
  name: string;
  description: string;
  routeId: number | null;
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
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}
