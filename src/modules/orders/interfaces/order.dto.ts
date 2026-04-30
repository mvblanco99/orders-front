// DTO para crear una orden
export interface CreateOrderDto {
  zoneId: number | null;
  totalUnits: number;
  totalParts: number;
  orderNumber: string;
  details: CreateOrderDetailDto[];
}

export interface CreateOrderDetailDto {
  partId: number;
  quantity: number;
  pickerId: number;
}

export interface AddOrderDetailDto {
  quantity: number;
  pickerId: number;
}

// DTO para actualizar una orden
export interface UpdateOrderDto {
  orderNumber?: string;
  zoneId?: number;
  totalUnits?: number;
  partsToCreate?: CreateOrderDetailDto[];
  partsToUpdate?: UpdateOrderPartDto[];
  partIdsToDelete?: number[];
}

// DTO para actualizar la cabecera de una orden
export interface UpdateOrderHeaderDto {
  orderNumber: string;
  zoneId: number;
  totalUnits: number;
}

// DTO para actualizar el detalle de una orden (una parte)
export interface UpdateOrderDetailDto {
  quantity: number;
  pickerId: number;
  recheckerId?: number | null;
  packerId?: number | null;
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
  status?: string;
}
