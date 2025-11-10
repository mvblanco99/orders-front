import { storeToRefs } from 'pinia';
import { useProfileStore } from '../store/useProfileStore';
import { usePermissionStore } from '../store/usePermissionStore';

export const useManageStore = () => {
  const profileStore = useProfileStore();
  const {
    dataFilter,
    profileDto,
    profileItem,
    profilePermissionToDel,
    profiles,
    profilesPermission,
    profilePagination,
  } = storeToRefs(profileStore);

  const permissionStore = usePermissionStore();
  const { permissionBySubject, permissionItem } = storeToRefs(permissionStore);

  return {
    dataFilter,
    profileDto,
    profileItem,
    profilePermissionToDel,
    profiles,
    profilesPermission,
    permissionBySubject,
    permissionItem,
    profilePagination,

    resetPermissionStore: permissionStore.resetPermissionStore,
    setProfilePagination: profileStore.setProfilePagination,
  };
};
