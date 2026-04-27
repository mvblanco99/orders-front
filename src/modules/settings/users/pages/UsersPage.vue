<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import TitlesComponent from 'src/modules/shared/components/TitlesComponent.vue';
import { useUsersQuery } from '../composables/useUsersQuery';
import type { UserItem, UserSearchParams } from '../interfaces/userInterface';
import { UsersRoutesEnum } from '../router';

const router = useRouter();
const search = ref<string>('');
const { users, usersQuery, columnTable, refreshQuery, searchParams, totalUsers } = useUsersQuery();

const pagination = ref({
  page: searchParams.value.page ?? 1,
  rowsPerPage: searchParams.value.limit ?? 10,
  rowsNumber: totalUsers.value,
});

watch(totalUsers, (val) => {
  pagination.value.rowsNumber = val;
});

const onRequest = (props: { pagination: { page: number; rowsPerPage: number } }) => {
  const { page, rowsPerPage } = props.pagination;
  searchParams.value = { ...searchParams.value, page, limit: rowsPerPage };
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
};

const onSearch = (val: string | number | null) => {
  const searchVal = typeof val === 'string' && val.length > 0 ? val : undefined;
  const newParams: UserSearchParams = { ...searchParams.value, page: 1 };
  if (searchVal !== undefined) {
    newParams.search = searchVal;
  } else {
    delete newParams.search;
  }
  searchParams.value = newParams;
  pagination.value.page = 1;
};

const goToUserAdd = async () => {
  await router.push({ name: UsersRoutesEnum.ADD_USER });
};

const goToUserEdit = async (user: UserItem) => {
  await router.push({ name: UsersRoutesEnum.EDIT_USER, params: { id: user.id } });
};
</script>

<template>
  <q-pull-to-refresh @refresh="refreshQuery">
    <q-page class="relative-position col" padding>
      <div>
        <TitlesComponent
          title="Usuarios"
          button-label="Nuevo usuario"
          :empty="users.length === 0"
          @open-dialog="goToUserAdd"
        />
      </div>

      <q-table
        bordered
        row-key="id"
        :rows="users"
        :columns="columnTable"
        :loading="usersQuery.isFetching.value"
        :rows-per-page-options="[10, 15, 20, 50]"
        v-model:pagination="pagination"
        :rows-number="totalUsers"
        server-side
        @request="onRequest"
        class="q-mt-md shadow-1"
      >
        <template v-slot:top-left>
          <q-input
            dense
            debounce="400"
            outlined
            clearable
            v-model="search"
            placeholder="Buscar"
            @update:model-value="onSearch"
          >
            <template v-slot:append>
              <q-icon name="sym_r_search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-isActive="prop">
          <q-td :props="prop">
            <q-chip
              :class="`${
                prop.row[prop.col.name] == true
                  ? 'state-active rounded-borders'
                  : 'state-desactive rounded-borders'
              } chip-dense`"
            >
              {{ prop.row[prop.col.name] == true ? 'Activo' : 'Desactivo' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="prop">
          <q-td :props="prop" auto-width>
            <q-btn dense color="primary" icon="sym_r_More_vert" flat>
              <q-menu anchor="top middle" self="bottom right">
                <q-list>
                  <q-item clickable v-close-popup @click="goToUserEdit(prop.row)">
                    <q-item-section style="font-size: 12px">Editar usuario</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-pull-to-refresh>
</template>

<style lang="scss" scoped>
.state-active {
  border: 1px solid #7cde63;
  background-color: rgba(124, 222, 99, 0.2);
  color: #6bc253;
}
.state-desactive {
  border: 1px solid #da615f;
  background-color: rgba(218, 97, 95, 0.2);
  color: #b84d4b;
}
.chip-dense {
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
}
</style>
