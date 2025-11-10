import { useMutation } from '@tanstack/vue-query';
import useNotify from 'src/modules/shared/composables/useNotify';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';
import type { AssignedClientDto } from '../interfaces/assingClientsInterfaces';
import { assignedClient } from '../api/usersApi';
import { queryKeyClientsByUser } from './useClientsByUserQuery';

const useAssignedClientMutation = () => {
  const { successNotify, errorNotify } = useNotify();
  const { invalidQuery } = useVueQuery();

  const assignedUserMutation = useMutation({
    mutationFn: (payload?: AssignedClientDto) => assignedClient(payload!),
    onSuccess: () => {
      successNotify('Cliente asignado exitosamente', 2000, 'sym_r_check_circle');
      invalidQuery({ queryKey: [queryKeyClientsByUser.client] });
    },
    onError: () => {
      //if (errorResponse.status === 409) return errorNotify('Usuario se encuentra registrado');
      errorNotify('Error al asignar cliente');
    },
  });
  return {
    assignedUserMutation,
  };
};
export default useAssignedClientMutation;
