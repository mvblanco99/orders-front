// Usuario embebido en respuestas
export interface OrderUser {
  id: number;
  name: string;
  lastName: string;
}

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
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  Zone?: { id: number; name: string };
  User?: OrderUser;
  OrderDetails?: OrderDetail[];
  OrderPart?: OrderPart[]; // kept for backward compat
}

// Detalle de orden (backend real)
export interface OrderDetailPart {
  id: number;
  orderDetailId: number;
  pickerId: number | null;
  packerId: number | null;
  recheckerId: number | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Picker: OrderUser | null;
  Packer: OrderUser | null;
  Rechecker: OrderUser | null;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  partId: number;
  quantity: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Parts: OrderDetailPart[];
}

// Parte de una orden (legacy)
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
  CANCELLED = 'cancelled',
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
