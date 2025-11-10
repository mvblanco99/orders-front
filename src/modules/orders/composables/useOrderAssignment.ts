import { storeToRefs } from 'pinia';
import { Loading } from 'quasar';
import { useOrderStore } from '../stores/useOrderStore';
import { findOrderForAssign, assignParts as apiAssignParts } from '../api/ordersApi';
import useNotify from '../../shared/composables/useNotify';
import useHandlerErrors from '../../shared/composables/useHandlerErrors';
import type { AssignPartsDto } from '../interfaces/order.dto';

export const useOrderAssignment = () => {
  const orderStore = useOrderStore();
  const notify = useNotify();
  const { handleApiResponseError } = useHandlerErrors();

  const { orderForAssign } = storeToRefs(orderStore);

  /**
   * Obtener orden para asignación (partes sin asignar)
   */
  const fetchOrderForAssign = async (orderNumber: string) => {
    Loading.show({
      message: 'Buscando orden...',
    });

    try {
      const order = await findOrderForAssign(orderNumber);
      orderForAssign.value = order;

      if (order.unassignedPartsCount === 0) {
        notify.infoNotify('Esta orden no tiene partes pendientes de asignar');
      }

      return order;
    } catch (error) {
      handleApiResponseError(error);
      throw error;
    } finally {
      Loading.hide();
    }
  };

  /**
   * Asignar rechecker y packer a partes
   */
  const assignParts = async (dto: AssignPartsDto) => {
    Loading.show({
      message: 'Asignando partes...',
    });

    try {
      const response = await apiAssignParts(dto);
      notify.successNotify(
        `${response.partsUpdated} ${response.partsUpdated === 1 ? 'parte asignada' : 'partes asignadas'} exitosamente`,
      );
      orderStore.resetOrderForAssign();
      return response;
    } catch (error) {
      handleApiResponseError(error);
      throw error;
    } finally {
      Loading.hide();
    }
  };

  return {
    // State
    orderForAssign,

    // Actions
    fetchOrderForAssign,
    assignParts,
  };
};
