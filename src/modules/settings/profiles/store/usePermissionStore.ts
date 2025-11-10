import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Permission, PermissionBySubjectI } from '../interfaces/permissionInterface';

export const usePermissionStore = defineStore('permission', () => {
  const permissionBySubject = ref<PermissionBySubjectI[]>([]);
  const permissionItem = ref<Permission[]>([]);

  const resetPermissionStore = () => {
    permissionBySubject.value = structuredClone([]);
  };
  return {
    permissionBySubject,
    permissionItem,
    resetPermissionStore,
  };
});
