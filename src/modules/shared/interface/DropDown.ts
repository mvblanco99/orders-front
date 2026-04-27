export interface DropDown {
  value: number | string;
  label: string;
}

export interface DropDownWithType extends DropDown {
  type: 'client' | 'group';
}

export type ResourceDD =
  | 'users'
  | 'clients'
  | 'manufacturers'
  | 'brands'
  | 'products'
  | 'menu-items-drop-down'
  | 'menu-items'
  | 'erp_clients'
  | 'ct_salespeople'
  | 'erp_salespeople'
  | 'profiles'
  | 'teleoperator'
  | 'collectionAnalyst'
  | 'triangulator'
  | 'customer-groups'
  | 'order-substatus'
  | 'advertisingSpaces'
  | 'tenants'
  | 'payment-methods'
  | 'banks'
  | 'keys-commercial'
  | 'payment_methods'
  | 'zones';

export type ResourceDDById =
  | 'assets-by-warehouse'
  | 'assets-without-warehouse'
  | 'warehouses-by-operation-subtype'
  | 'searchForTeleoperatorClientsByUserId'
  | 'users-by-manufacturer-id';

export type DropDownsParamByType = 'profiles-by-tenant';
