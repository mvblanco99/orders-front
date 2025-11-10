import { TenantTypeKey, TenantTypeLabel } from '../interfaces/menuInterfaces';

export const getTypeUserByTenant = (tenant: string = TenantTypeLabel.CLIENT) => {
  if (Object.values(TenantTypeLabel).includes(tenant as TenantTypeLabel)) {
    return tenant;
  }
  if (Object.keys(TenantTypeLabel).includes(tenant)) {
    return TenantTypeLabel[tenant as keyof typeof TenantTypeLabel];
  }
  return '';
};

export const isClient = (tenant: TenantTypeKey) => {
  return tenant === TenantTypeKey.CLIENT;
};

export const isSupplier = (tenant: TenantTypeKey) => {
  return tenant === TenantTypeKey.SUPPLIER;
};

export const isVital = (tenant: TenantTypeKey) => {
  return tenant === TenantTypeKey.VITAL;
};
