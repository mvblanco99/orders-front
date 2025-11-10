<!-- <script setup lang="ts">
import { ref, computed } from 'vue';
import useOrdersPendingQuery from 'src/modules/orders/composables/useOrdersPendingQuery';
import { OrderStatus } from 'src/modules/orders/interfaces/ordersInterface';
import { useRouter } from 'vue-router';
import { OrdersRoutes } from 'src/modules/orders/interfaces/orders-routes';

const { findOrderHistory, filterToHistoryPage } = useOrdersPendingQuery();
const router = useRouter();

const countOrdersPending = computed(() => {
  return (
    (findOrderHistory.data.value?.meta.totalPendingItem || 0) +
    (findOrderHistory.data.value?.meta.totalPreorderItem || 0)
  );
});

const fabPendingOrders = ref(false);

const openOrders = (val: string) => {
  void router.push({
    name: OrdersRoutes.ORDER_HISTORY,
    query: { status: val },
  });
};

const updateStatus = (status: string) => {
  openOrders(status);
  filterToHistoryPage.value.status = status;
};
</script>

<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-fab
      v-model="fabPendingOrders"
      vertical-actions-align="right"
      color="secondary"
      icon="sym_r_pending_actions"
      direction="up"
      :label="
        countOrdersPending === 0
          ? 'No tienes pedidos pendientes'
          : `Tienes ${countOrdersPending} pedido${countOrdersPending === 1 ? '' : 's'} pendiente${countOrdersPending === 1 ? '' : 's'}`
      "
      label-position="left"
      external-label
      :hide-label="false"
      label-class="text-caption bg-indigo-1 text-primary"
      class="pending-orders__fab"
    >
      <q-fab-action
        label-position="left"
        color="primary"
        @click="() => updateStatus(OrderStatus.PENDING)"
        :label="`Ver ${findOrderHistory.data.value?.meta.totalPendingItem || 0} pedido${
          findOrderHistory.data.value?.meta.totalPendingItem === 1 ? '' : 's'
        } pendiente`"
      />

      <q-fab-action
        label-position="left"
        color="primary"
        @click="() => updateStatus(OrderStatus.PREORDER)"
        :label="`Ver ${findOrderHistory.data.value?.meta.totalPreorderItem || 0} pedido${
          findOrderHistory.data.value?.meta.totalPreorderItem === 1 ? '' : 's'
        } en preorden`"
      />
    </q-fab>
  </q-page-sticky>
</template> -->
