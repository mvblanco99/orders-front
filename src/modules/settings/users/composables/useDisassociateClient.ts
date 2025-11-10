import { useMutation } from '@tanstack/vue-query';
import useNotify from 'src/modules/shared/composables/useNotify';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';
import type { DisassociateClientDto } from '../interfaces/assingClientsInterfaces';
import { disassociateClient } from '../api/usersApi';
import { queryKeyClientsByUser } from './useClientsByUserQuery';

const useDisassociateClientMutation = () => {
  const { successNotify, errorNotify } = useNotify();
  const { invalidQuery } = useVueQuery();

  const disassociateClientMutation = useMutation({
    mutationFn: (payload?: DisassociateClientDto) => disassociateClient(payload!),
    onSuccess: () => {
      successNotify('Cliente remover exitosamente', 2000, 'sym_r_check_circle');
      invalidQuery({ queryKey: [queryKeyClientsByUser.client] });
    },
    onError: () => {
      //if (errorResponse.status === 409) return errorNotify('Usuario se encuentra registrado');
      errorNotify('Error al asignar cliente');
    },
  });

  return {
    disassociateClientMutation,
  };
};
export default useDisassociateClientMutation;
