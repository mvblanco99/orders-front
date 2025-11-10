import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/vue-query';
import useNotify from 'src/modules/shared/composables/useNotify';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';
import { useUserStore } from '../stores/useUserStore';
import type { AddUserResponse, CreateUserDto } from '../interfaces/CreateUserDto';
import { updateUser } from '../api/usersApi';
import { queryKeyUsers } from './useUserQuery';

const useUpdateUserMutation = () => {
  const userStore = useUserStore();
  const { userDto, userDetail } = storeToRefs(userStore);
  const { successNotify, errorNotify } = useNotify();
  const { invalidQuery } = useVueQuery();

  const userUpdatedResponse = ref<AddUserResponse>();

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateUserDto> }) =>
      updateUser(id, payload),
    onSuccess: (data) => {
      successNotify('Usuario actualizado con éxito', 2000, 'sym_r_check_circle');
      invalidQuery({ queryKey: [queryKeyUsers.Users] });
      userDetail.value = data;
    },
    onError: (error) => {
      const errorResponse = error as AxiosError;
      if (errorResponse.status === 409) return errorNotify('Usuario se encuentra registrado');
      errorNotify('Error al actualizar usuario');
    },
  });
  return {
    userDto,
    userUpdatedResponse,
    updateUserMutation,
    resetDto: userStore.resetUserDto,
  };
};

export default useUpdateUserMutation;
