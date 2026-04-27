import { storeToRefs } from 'pinia';
import { useMutation } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import useNotify from 'src/modules/shared/composables/useNotify';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';
import { useUserStore } from '../stores/useUserStore';
import { createUser } from '../api/usersApi';
import { queryKeyUsers } from './useUsersQuery';

const useCreateUserMutation = () => {
  const userStore = useUserStore();
  const { createUserDto } = storeToRefs(userStore);
  const { successNotify, errorNotify } = useNotify();
  const { invalidQuery } = useVueQuery();

  const createUserMutation = useMutation({
    mutationFn: () => createUser(createUserDto.value),
    onSuccess: () => {
      successNotify('Usuario creado con éxito', 2000, 'sym_r_check_circle');
      invalidQuery({ queryKey: [queryKeyUsers.Users] });
      invalidQuery({ queryKey: ['dd-users'] });
      userStore.resetCreateUserDto();
    },
    onError: (error: AxiosError) => {
      if (error.status === 409) {
        errorNotify('El correo ya se encuentra registrado');
        return;
      }
      errorNotify('Error al crear usuario');
    },
  });

  return {
    createUserDto,
    createUserMutation,
    resetDto: userStore.resetCreateUserDto,
  };
};

export default useCreateUserMutation;
