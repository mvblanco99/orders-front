import { ref } from 'vue';
import type { Permission } from '../interfaces/permissionInterface';

import { useManageStore } from './useManageStore';

export enum PermissionName {
  MANAGEALL = 'all:manage',
}

export const usePermission = () => {
  const { permissionItem } = useManageStore();
  const isManageAllSelected = ref(false);

  const isSelected = (permission: Permission) => {
    const isSelected = permissionItem.value.some(
      (p) => p.action === permission.action && p.id === permission.id,
    );

    return isSelected;
  };

  const handlePermissionInList = (permission: Permission) => {
    const isFound = permissionItem.value.some(
      (p) => p.action === permission.action && p.id === permission.id,
    );

    if (isFound)
      return (permissionItem.value = permissionItem.value.filter(
        (p) => p.action !== permission.action || p.id !== permission.id,
      ));

    if ((permission.name as PermissionName) === PermissionName.MANAGEALL)
      return (permissionItem.value = [permission]);

    permissionItem.value = [...permissionItem.value, permission];
  };

  const togglePermission = (permission: Permission) => {
    if (
      (permission.name as PermissionName) !== PermissionName.MANAGEALL &&
      isManageAllSelected.value
    )
      return;
    const isManage = permission.action === 'manage';

    if (isManage) {
      permissionItem.value = permissionItem.value.filter(
        (p) => p.subject !== permission.subject || p.action === 'manage',
      );

      handlePermissionInList(permission);
    } else {
      const hasManage = permissionItem.value.some(
        (p) => p.action === 'manage' && p.subject === permission.subject,
      );

      if (hasManage) {
        return;
      }

      handlePermissionInList(permission);
    }
  };

  return {
    permissionItem,
    isManageAllSelected,
    isSelected,
    togglePermission,
  };
};
