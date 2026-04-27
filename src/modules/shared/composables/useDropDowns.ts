import { watch } from 'vue';
import { Loading } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { useDropDownStore } from '../store/useDropDownStore';
import type { ResourceDD } from '../interface/DropDown';
import { getDropDown } from '../api/DropDownsApi';

const useDropDown = (resource: ResourceDD) => {
  const store = useDropDownStore();
  const {
    brands,
    users,
    clients,
    manufacturers,
    products,
    salespeople,
    tenants,
    menuItemsDropDown,
    menuItems,
    erpClients,
    erpSalespeople,
    profiles,
    profilesByTenant,
    teleoperator,
    collectionAnalyst,
    triangulator,
    customerGroups,
    orderSubStatus,
    advertisingSpaces,
    keysCommercial,
    paymentMethods,
    banks,
    zones,
  } = storeToRefs(store);

  const queryDropDown = useQuery({
    queryKey: ['dd-' + resource],
    queryFn: () => getDropDown(resource),
    retry: 0,
    staleTime: Infinity,
  });

  watch(queryDropDown.isLoading, (isLoading) => {
    if (isLoading) {
      Loading.show({ group: 'loading' });
    } else {
      Loading.hide('loading');
    }
  });

  watch(
    queryDropDown.data,
    (newVal) => {
      if (!newVal?.length) return;

      switch (resource) {
        case 'brands':
          brands.value = newVal;
          break;
        case 'users':
          users.value = newVal;
          break;
        case 'clients':
          clients.value = newVal;
          break;
        case 'manufacturers':
          manufacturers.value = newVal.map((item) => ({
            label: item.label,
            value: Number(item.value),
          }));
          break;
        case 'products':
          products.value = newVal;
          break;
        case 'menu-items-drop-down':
          menuItemsDropDown.value = newVal;
          break;
        case 'menu-items':
          menuItems.value = newVal;
          break;
        case 'ct_salespeople':
          salespeople.value = newVal;
          break;
        case 'erp_clients':
          erpClients.value = newVal;
          break;
        case 'erp_salespeople':
          erpSalespeople.value = newVal;
          break;
        case 'profiles':
          profiles.value = newVal;
          break;
        case 'triangulator':
          triangulator.value = newVal;
          break;
        case 'collectionAnalyst':
          collectionAnalyst.value = newVal;
          break;
        case 'teleoperator':
          teleoperator.value = newVal;
          break;
        case 'customer-groups':
          customerGroups.value = newVal;
          break;
        case 'order-substatus':
          orderSubStatus.value = newVal;
          break;
        case 'advertisingSpaces':
          advertisingSpaces.value = newVal;
          break;
        case 'tenants':
          tenants.value = newVal;
          break;
        case 'payment_methods':
          paymentMethods.value = newVal;
          break;
        case 'banks':
          banks.value = newVal;
          break;
        case 'zones':
          zones.value = newVal;
          break;
        default:
        case 'keys-commercial':
          keysCommercial.value = newVal;
          break;
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );

  return {
    brands,
    users,
    clients,
    manufacturers,
    products,
    salespeople,
    tenants,
    menuItemsDropDown,
    menuItems,
    erpClients,
    erpSalespeople,
    profiles,
    profilesByTenant,
    teleoperator,
    collectionAnalyst,
    triangulator,
    queryDropDown,
    customerGroups,
    orderSubStatus,
    advertisingSpaces,
    keysCommercial,
    paymentMethods,
    banks,
    zones,
  };
};

export default useDropDown;
