import { Dialog, debounce } from 'quasar';
import type { Ref, ComputedRef } from 'vue';

interface UseDebouncedQuantityUpdateOptions<T> {
  itemsRef: Ref<T[]> | ComputedRef<T[]>;
  mutateFn: (payload: { productId: number; quantity: number; clientId?: number }) => void;
  getStock: (item: T) => number;
  getQuantity: (item: T, clientId?: number | string) => number;
  getId: (item: T) => number;
  waitTime?: number;
}

const useDebouncedQuantityUpdate = <T>({
  itemsRef,
  mutateFn,
  getStock,
  getQuantity,
  getId,
  waitTime = 600,
}: UseDebouncedQuantityUpdateOptions<T>) => {
  const debouncedUpdate = debounce(
    (itemId: number, value: number | string, clientId?: number | string) => {
      const item = itemsRef.value.find((i) => getId(i) === itemId);
      if (!item) {
        return;
      }
      const previousQuantity = getQuantity(item, clientId);
      const stock = getStock(item);

      if (value.toString().length === 0) return;

      const numberValue = Number(value);

      if (isNaN(numberValue)) return;

      if (numberValue > stock) {
        Dialog.create({
          title: 'Ajustar cantidad',
          message: `La cantidad ingresada (${value}) es mayor al stock disponible (${stock}). ¿Desea ajustar al stock disponible?`,
          persistent: true,
          ok: { label: 'Sí, ajustar', color: 'primary', unelevated: true, noCaps: true },
          cancel: {
            label: `No (mantener ${previousQuantity})`,
            color: 'primary',
            flat: true,
            noCaps: true,
          },
        }).onOk(() => {
          const payload: { productId: number; quantity: number; clientId?: number } = {
            productId: itemId,
            quantity: stock,
          };
          if (clientId !== undefined) payload.clientId = Number(clientId);
          mutateFn(payload);
        });
      } else {
        const payload: { productId: number; quantity: number; clientId?: number } = {
          productId: itemId,
          quantity: numberValue || 0,
        };
        if (clientId !== undefined) payload.clientId = Number(clientId);
        mutateFn(payload);
      }
    },
    waitTime,
  );

  const handleQuantityChange = (itemId: number, value: number | string, clientId?: number) => {
    debouncedUpdate(itemId, value, clientId);
  };

  return { handleQuantityChange };
};
export default useDebouncedQuantityUpdate;
