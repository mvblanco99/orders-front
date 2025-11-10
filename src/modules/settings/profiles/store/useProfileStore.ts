import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  DataFilterI,
  ProfileDtoI,
  ProfileI,
  ProfileItemI,
  ProfilePermissionsI,
} from '../interfaces/profileInterfaces';
import type { Pagination } from 'src/modules/shared/interface/Pagination';

const initialProfilePagination: Pagination = {
  page: 1,
  rowsPerPage: 10,
  sortBy: 'desc',
  descending: false,
  rowsNumber: 0,
};

export const useProfileStore = defineStore('profilesStore', () => {
  const profiles = ref<ProfileItemI[]>([]);
  const profileDto = ref<ProfileDtoI>(structuredClone({ name: '' }));
  const profilesPermission = ref<ProfilePermissionsI>({ items: [] });
  const profilePermissionToDel = ref<ProfilePermissionsI>({ items: [] });
  const profileItem = ref<ProfileI>({
    name: '',
  });
  const dataFilter = ref<DataFilterI>({});
  const profilePagination = ref<Pagination>(initialProfilePagination);

  const setProfilePagination = (newPag: Pagination) => {
    profilePagination.value = newPag;
  };

  return {
    profiles,
    profileDto,
    profilesPermission,
    profilePermissionToDel,
    profileItem,
    dataFilter,
    profilePagination,

    setProfilePagination,
  };
});
