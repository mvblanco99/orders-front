export interface ClientDto {
  clientId: number;
  clientGroupId?: number;
}

export interface AssignedClientDto {
  userId: number;
  profileId: number;
  clients: ClientDto[];
}

export interface ClientsAssociatesInterface {
  id: number;
  ct_customerId: number;
  ct_teleoperatorId: number;
  ct_sales_peopleId: null;
  ct_collection_analystId: null;
  createdAt: Date;
  updatedAt: Date;
  email: null;
  customer: Customer;
}

export interface Customer {
  id: number;
  code: string;
  name: string;
  rif: string;
  nit: string;
  creditLimit: number;
  balance: number;
  customerTypeId: string;
  customerSegmentId: string;
  salespersonId: string;
  address: string;
  phone: string;
  email: string;
  specialTaxpayer: boolean;
  city: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  groupName: string;
}

export interface DisassociateClientDto {
  userId: number;
  profileId: number;
  clientsIds: number[];
}
