import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { DropDown } from '../interface/DropDown';

export const useDropDownStore = defineStore('DropDown', () => {
  return {
    // General
    brands: ref<DropDown[]>([]),
    users: ref<DropDown[]>([]),
    clients: ref<DropDown[]>([]),
    manufacturers: ref<DropDown[]>([]),
    products: ref<DropDown[]>([]),
    salespeople: ref<DropDown[]>([]),
    menuItemsDropDown: ref<DropDown[]>([]),
    menuItems: ref<DropDown[]>([]),
    profiles: ref<DropDown[]>([]),
    erpClients: ref<DropDown[]>([]),
    ctSalespeople: ref<DropDown[]>([]),
    erpSalespeople: ref<DropDown[]>([]),
    collectionAnalyst: ref<DropDown[]>([]),
    triangulator: ref<DropDown[]>([]),
    teleoperator: ref<DropDown[]>([]),
    customerGroups: ref<DropDown[]>([]),
    orderSubStatus: ref<DropDown[]>([]),
    advertisingSpaces: ref<DropDown[]>([]),
    tenants: ref<DropDown[]>([]),
    paymentMethods: ref<DropDown[]>([]),
    banks: ref<DropDown[]>([]),
    keysCommercial: ref<DropDown[]>([]),

    // By Id
    clientsForTeleOperator: ref<DropDown[]>([]),
    usersByManufacturer: ref<DropDown[]>([]),

    // By Type
    profilesByTenant: ref<DropDown[]>([]),
  };
});
