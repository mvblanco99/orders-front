// DTO para crear una orden
export interface CreateOrderDto {
  zoneId: number;
  totalUnits: number;
  totalParts: number;
  orderNumber: string;
  parts: CreateOrderPartDto[];
}

export interface CreateOrderPartDto {
  partNumber: number;
  quantity: number;
  pickerId: number;
}

// DTO para actualizar una orden
export interface UpdateOrderDto {
  orderNumber?: string;
  zoneId?: number;
  totalUnits?: number;
  partsToCreate?: CreateOrderPartDto[];
  partsToUpdate?: UpdateOrderPartDto[];
  partIdsToDelete?: number[];
}

export interface UpdateOrderPartDto {
  id: number;
  quantity?: number;
  pickerId?: number;
  partNumber?: number;
}

// DTO para asignar partes masivamente
export interface AssignPartsDto {
  recheckerId: number;
  packerId: number;
  partIds: number[];
}

// Parámetros de búsqueda/filtrado
export interface OrderSearchParams {
  limit?: number;
  offset?: number;
  zoneId?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  isActive?: boolean;
  creatorBy?: number;
  pickerId?: number;
  packerId?: number;
  recheckerId?: number;
  orderNumber?: string;
}
