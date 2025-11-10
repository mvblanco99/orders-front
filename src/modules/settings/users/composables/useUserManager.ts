import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/useUserStore';

export const useUserManager = () => {
  const store = useUserStore();
  const { users, userDetail, userDto } = storeToRefs(store);

  return {
    // State
    users,
    userDetail,
    userDto,

    // Actions
    resetUsers: store.resetUsers,
    resetUserDetail: store.resetUserDetail,
    resetUserDto: store.resetUserDto,
  };
};
