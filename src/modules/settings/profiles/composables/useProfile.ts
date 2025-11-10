import type { QTable } from 'quasar';
import { ref } from 'vue';
import { stateProfileColumns } from '../helpers/tableColumns';

import { useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  delPermissions,
  patchProfile,
  PostPermissions,
  postProfile,
  delProfile,
} from '../api/profileApi';

import type { ProfileDtoI, ProfilePermissionsI } from '../interfaces/profileInterfaces';
import { useManageStore } from './useManageStore';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { profileDto, profilesPermission, profilePermissionToDel } = useManageStore();

  const columnTable = ref<QTable['columns']>(stateProfileColumns);

  const createProfileM = useMutation({ mutationFn: postProfile });

  const setPermissions = useMutation({
    mutationFn: async (params: { id: number; data: ProfilePermissionsI }) =>
      PostPermissions(params.id, params.data),
  });

  const updateProfile = useMutation({
    mutationFn: async (params: { id: number; body: ProfileDtoI }) =>
      patchProfile(params.id, params.body),
  });

  const deletePermissions = useMutation({
    mutationFn: async (params: { id: number; data: ProfilePermissionsI }) =>
      delPermissions(params.id, params.data),
  });

  const deleteProfile = useMutation({ mutationFn: async (id: number) => delProfile(id) });

  const handleCreateProfile = async () => {
    const res = await createProfileM.mutateAsync(profileDto.value);
    await setPermissions.mutateAsync({ id: res.id, data: profilesPermission.value });
    await queryClient.invalidateQueries({ queryKey: ['profiles'] });
  };

  const handleUpdateProfile = async (idP: number) => {
    await updateProfile.mutateAsync({ id: idP, body: profileDto.value });
    await setPermissions.mutateAsync({ id: idP, data: profilesPermission.value });
    await deletePermissions.mutateAsync({ id: idP, data: profilePermissionToDel.value });

    await queryClient.invalidateQueries({ queryKey: ['profileItem', idP] });
  };

  const handleDeleteProfile = async (idP: number) => {
    await deleteProfile.mutateAsync(idP);
    await queryClient.invalidateQueries({ queryKey: ['profiles'] });
  };

  return {
    columnTable,
    profileDto,
    profilesPermission,
    profilePermissionToDel,

    handleCreateProfile,
    handleUpdateProfile,
    handleDeleteProfile,
  };
};
