import type { OrderUser } from 'src/modules/orders/interfaces/order.interface';

export interface OrderPartFailure {
  id: number;
  partId: number;
  observation: string;
  createdAt: string;
  CreatedBy?: OrderUser;
}

export interface RecheckerOrderPart {
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
  Failures: OrderPartFailure[];
}

export interface RecheckerOrderDetail {
  id: number;
  orderId: number;
  partId: number;
  quantity: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  Parts: RecheckerOrderPart[];
}

export interface RecheckerOrder {
  id: number;
  orderNumber: string;
  zoneId: number;
  totalUnits: number;
  totalParts: number;
  orderDate: string;
  createdBy: number;
  status: string;
  isActive: boolean;
  Zone?: { id: number; name: string };
  User?: OrderUser;
  OrderDetails?: RecheckerOrderDetail[];
}

export interface RecheckerPartRow {
  partRowId: string; // unique key: `${detailId}-${partId}`
  orderDetailId: number;
  partId: number;
  partIndex: number;
  quantity: number;
  pickerName: string;
  packerName: string;
}
