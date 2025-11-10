import { useMutation } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import useNotify from 'src/modules/shared/composables/useNotify';
import { useUserStore } from '../stores/useUserStore';
import type { AddUserResponse, CreateUserDto } from '../interfaces/CreateUserDto';
import { createUser } from '../api/usersApi';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';
import { queryKeyUsers } from './useUserQuery';
import type { AxiosError } from 'axios';
import { ref } from 'vue';

const useAddUserMutation = () => {
  const userStore = useUserStore();
  const { userDto } = storeToRefs(userStore);
  const { successNotify, errorNotify } = useNotify();
  const { invalidQuery } = useVueQuery();

  const userCreatedResponse = ref<AddUserResponse>();

  const createUserMutation = useMutation({
    mutationFn: (payload?: CreateUserDto) => createUser(payload!),
    onSuccess: (data) => {
      successNotify('Usuario creado con éxito', 2000, 'sym_r_check_circle');
      invalidQuery({ queryKey: [queryKeyUsers.Users] });
      userCreatedResponse.value = data;
    },
    onError: (error) => {
      const errorResponse = error as AxiosError;
      if (errorResponse.status === 409) return errorNotify('Usuario se encuentra registrado');
      errorNotify('Error al crear usuario');
    },
  });
  return {
    userDto,
    userCreatedResponse,
    createUserMutation,
    resetDto: userStore.resetUserDto,
  };
};

export default useAddUserMutation;
