export interface PermissionResponseI {
  data: Permission[];
  total: number;
}

export interface Permission {
  id: number;
  name: string;
  action: string;
  subject: string;
  type: Type;
  conditions?: null;
}

export enum Type {
  can = 'can',
  cannot = 'cannot',
}

export enum SubjectsEnum {
  DropDown = 'DropDown',
  User = 'User',
  Brand = 'Brand',
  Category = 'Category',
  Subcategory = 'Subcategory',
  Department = 'Department',
  Route = 'Route',
  DocumentType = 'DocumentType',
  Profile = 'Profile',
  Permission = 'Permission',
  Employee = 'Employee',
  EmployeeWarehouse = 'EmployeeWarehouse',
  Warehouse = 'Warehouse',
  Article = 'Article',
  Asset = 'Asset',
  Maintenance = 'Maintenance',
  OperationType = 'OperationType',
  OperationStatus = 'OperationStatus',
  Operation = 'Operation',
  OperationDetail = 'OperationDetail',
  DetailOperationAssets = 'DetailOperationAssets',
  DispatchGuide = 'DispatchGuide',
  Order = 'Order',
  Carrier = 'Carrier',
  OrderAsset = 'OrderAsset',
  DispatchGuideOperation = 'DispatchGuideOperation',
  All = 'all',
}

export enum Action {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}

export interface DataFilterI {
  limit?: number;
  offset?: number;
  action?: Action;
  type?: Type;
  subject?: SubjectsEnum;
  profileId?: number;
  inputSearch?: string;
}

export interface PermissionBySubjectI {
  subject?: string;
  permission?: Permission[];
}
