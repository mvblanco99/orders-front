// Entidad principal Order
export interface Order {
  id: number;
  orderNumber: string;
  zoneId: number;
  totalUnits: number;
  totalParts: number;
  orderDate: string; // ISO date string
  createdBy: number;
  status: OrderStatus;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  OrderPart: OrderPart[];
}

// Parte de una orden (hoja)
export interface OrderPart {
  id: number;
  orderId: number;
  partNumber: number;
  quantity: number;
  pickerId: number;
  recheckerId: number | null;
  packerId: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Estados posibles de una orden
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}

// Response de lista de órdenes
export interface OrdersResponse {
  data: Order[];
  meta: OrdersMeta;
}

export interface OrdersMeta {
  total: number;
  page: number;
  totalPages: number;
}

// Response para detalle de asignación
export interface OrderAssignResponse {
  id: number;
  orderNumber: string;
  totalParts: number;
  unassignedPartsCount: number;
  unassignedParts: OrderPart[];
}

// Response de asignación masiva
export interface AssignPartsResponse {
  message: string;
  partsUpdated: number;
}
