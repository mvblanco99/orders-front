import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserDetail, UserItem } from '../interfaces/userInterface';
import type { CreateUserDto } from '../interfaces/CreateUserDto';

const initStateDto: CreateUserDto = {
  typeTenant: '',
  resourceId: undefined,
  profileId: undefined,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  userErpCode: undefined,
};

export const useUserStore = defineStore('discountsheaderSupplierStore', () => {
  const users = ref<UserItem[]>([]);
  const userDto = ref<CreateUserDto>(structuredClone(initStateDto));
  const userDetail = ref<UserDetail | null>(null);

  const resetUsers = () => {
    users.value = [];
    localStorage.removeItem('menuItems');
  };

  const resetUserDetail = () => {
    userDetail.value = null;
    localStorage.removeItem('userDetail');
  };

  const resetUserDto = () => {
    userDto.value = structuredClone(initStateDto);
  };

  return {
    // State
    users,
    userDto,
    userDetail,

    // Actions
    resetUsers,
    resetUserDetail,
    resetUserDto,
  };
});
