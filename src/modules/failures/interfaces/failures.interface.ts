import type {
  OrderPartFailure,
  RecheckerOrderPart,
  RecheckerOrderDetail,
  RecheckerOrder,
} from 'src/modules/rechecker/interfaces/rechecker.interface';
import type { OrderUser } from 'src/modules/orders/interfaces/order.interface';

export type PartFailure = OrderPartFailure;
export type FailuresOrderPart = RecheckerOrderPart;
export type FailuresOrderDetail = RecheckerOrderDetail;
export type FailuresOrder = RecheckerOrder;

export interface PartFailureItem {
  id: number;
  createdAt: string;
  observation: string;
  Part: {
    id: number;
    Picker: {
      id: number;
      name: string;
      lastName: string | null;
    } | null;
  };
  Creator: {
    id: number;
    name: string;
    lastName: string | null;
  };
}

export interface PartDetail {
  id: number;
  orderDetailId: number;
  pickerId: number | null;
  packerId: number | null;
  recheckerId: number | null;
  Picker: OrderUser | null;
  Packer: OrderUser | null;
  Rechecker: OrderUser | null;
  Failures: PartFailure[];
  OrderDetail?: {
    id: number;
    quantity: number;
    Order?: {
      id: number;
      orderNumber: string;
    };
  };
}

export interface FailuresPartRow {
  partRowId: string; // unique key: `${detailId}-${partId}`
  orderDetailId: number;
  partId: number;
  partIndex: number;
  quantity: number;
  pickerName: string;
  packerName: string;
  recheckerName: string;
  failuresCount: number;
}
