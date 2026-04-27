import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserItem, UserDetail, UserSearchParams } from '../interfaces/userInterface';
import type { CreateUserDto, UpdateUserDto } from '../interfaces/CreateUserDto';

const initialCreateUserDto: CreateUserDto = {
  email: '',
  password: '',
};

const initialSearchParams: UserSearchParams = {
  page: 1,
  limit: 10,
};

export const useUserStore = defineStore('usersStore', () => {
  // State
  const users = ref<UserItem[]>([]);
  const userDetail = ref<UserDetail | null>(null);
  const createUserDto = ref<CreateUserDto>(structuredClone(initialCreateUserDto));
  const updateUserDto = ref<UpdateUserDto>({});
  const searchParams = ref<UserSearchParams>(structuredClone(initialSearchParams));
  const totalUsers = ref<number>(0);
  const currentPage = ref<number>(1);
  const totalPages = ref<number>(1);

  // Actions
  const resetUsers = () => {
    users.value = [];
    totalUsers.value = 0;
    currentPage.value = 1;
    totalPages.value = 1;
  };

  const resetUserDetail = () => {
    userDetail.value = null;
  };

  const resetCreateUserDto = () => {
    createUserDto.value = structuredClone(initialCreateUserDto);
  };

  const resetUpdateUserDto = () => {
    updateUserDto.value = {};
  };

  const resetSearchParams = () => {
    searchParams.value = structuredClone(initialSearchParams);
  };

  return {
    // State
    users,
    userDetail,
    createUserDto,
    updateUserDto,
    searchParams,
    totalUsers,
    currentPage,
    totalPages,

    // Actions
    resetUsers,
    resetUserDetail,
    resetCreateUserDto,
    resetUpdateUserDto,
    resetSearchParams,
  };
});
