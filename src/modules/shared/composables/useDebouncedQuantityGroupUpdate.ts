import { ref } from 'vue';
import type { Ref } from 'vue';
import { debounce, Dialog } from 'quasar';

interface Params {
  mutateFn: (payload: { productId: number; quantity: number; clientId: number }) => void;
  getProductId: () => number;
  getClientId: (idx: number) => number;
  getQuantities: () => number[];
  getStock: () => number;
  setQuantityAtIndex: (idx: number, value: number) => void;
  getPreviousQuantityAtIndex: (idx: number) => number;
  waitTime?: number;
}

const useDebouncedQuantityGroupUpdate = ({
  mutateFn,
  getProductId,
  getClientId,
  getQuantities,
  getStock,
  setQuantityAtIndex,
  getPreviousQuantityAtIndex,
  waitTime = 600,
}: Params) => {
  const debouncers: Ref<((value: number) => void)[]> = ref([]);

  const handleGroupQuantityChange = (idx: number, value: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const quantities = [...getQuantities()];
      const stock = getStock();
      const previousQuantity = getPreviousQuantityAtIndex(idx);
      quantities[idx] = value;
      const total = quantities.reduce((sum, qty) => sum + (Number(qty) || 0), 0);
      if (total > stock) {
        const sumaSinActual = total - value;
        const maxPermitido = Math.max(stock - sumaSinActual, 0);
        Dialog.create({
          title: 'Cantidad excedida',
          message: `La suma total (${total}) supera el stock disponible (${stock}). ¿Desea ajustar la cantidad de este grupo a ${maxPermitido}?`,
          persistent: true,
          ok: { label: 'Sí, ajustar', color: 'primary', unelevated: true, noCaps: true },
          cancel: { label: `No (mantener anterior)`, color: 'primary', flat: true, noCaps: true },
        })
          .onOk(() => {
            setQuantityAtIndex(idx, maxPermitido);
            if (!debouncers.value[idx]) {
              debouncers.value[idx] = debounce((val: number) => {
                mutateFn({
                  productId: getProductId(),
                  quantity: val,
                  clientId: getClientId(idx),
                });
              }, waitTime);
            }
            debouncers.value[idx](maxPermitido);
            resolve(true);
          })
          .onCancel(() => {
            setQuantityAtIndex(idx, previousQuantity);
            resolve(false);
          });
        return;
      }
      const doUpdate = () => {
        setQuantityAtIndex(idx, value);
        if (!debouncers.value[idx]) {
          debouncers.value[idx] = debounce((val: number) => {
            mutateFn({
              productId: getProductId(),
              quantity: val,
              clientId: getClientId(idx),
            });
          }, waitTime);
        }
        debouncers.value[idx](value);
        resolve(true);
      };
      if (value === previousQuantity) {
        resolve(true);
        return;
      }
      doUpdate();
    });
  };

  return { handleGroupQuantityChange };
};
export default useDebouncedQuantityGroupUpdate;
