<script setup lang="ts">
import { useQuasar } from 'quasar';
import EssentialLinks from './EssentialLinks.vue';
import { useMenuUi } from '../composables/usMenuUi';
import { useMenuItemByUserQuery } from '../composables/useMenuItemByUserQuery';
import useAuth from 'src/modules/auth/composables/useAuth';
import useCapitalize from 'src/modules/shared/composables/useCapitalize';
import useMenuItems from '../composables/useMenuItems';
import useSyncMenuWithRoute from '../composables/useSyncMenuWithRoute';

const { menuItemsFormatted } = useMenuItemByUserQuery();
const { isMiniState } = useMenuUi();
const { user, logout } = useAuth();
const { resetMenuItemLink } = useMenuItems();
const $q = useQuasar();
const { capitalizeString } = useCapitalize();

useSyncMenuWithRoute();

const handleLogout = async () => {
  await logout();
  resetMenuItemLink();
};
const verticalThumbStyle = {
  right: '2px',
  borderRadius: '5px',
  backgroundColor: '#fff',
  width: '5px',
  opacity: '0.75',
};
const horizontalThumbStyle = {
  backgroundColor: 'transparent',
};
</script>
<template>
  <div
    class="logo__container flex items-center justify-start q-pt-lg q-px-md q-mb-lg"
    loading="eager"
    no-spinner
  >
    <template v-if="isMiniState && !$q.platform.is.mobile">
      <q-img src="images/logos/Isotype.png" width="32px" height="32px" no-spinner />
    </template>
    <template v-else>
      <q-img
        src="images/logos/logo_vital_clinic_dark.png"
        height="72px"
        width="150px"
        fit="contain"
        no-spinner
        transition-show="jump-down"
        transition-hide="jump-up"
      />
    </template>
  </div>
  <q-scroll-area
    style="height: calc(100% - 250px)"
    :vertical-thumb-style="verticalThumbStyle"
    :horizontal-thumb-style="horizontalThumbStyle"
  >
    <q-list class="q-px-sm q-gutter-sm sidebar__menu text-white" padding>
      <EssentialLinks v-for="link in menuItemsFormatted" :key="link.title!" v-bind="link" />
    </q-list>
  </q-scroll-area>
  <div class="sidebar__footer q-px-sm q-py-lg absolute-bottom">
    <q-separator class="q-my-md bg-blue-grey-4" />
    <div class="flex justify-center items-center full-width sidebar__footer__content">
      <template v-if="isMiniState && !$q.platform.is.mobile">
        <q-avatar size="48px">
          <img src="/images/no_profile_image_available.jpg" />
        </q-avatar>
      </template>
      <template v-else>
        <transition
          appear
          enter-active-class="animated fadeIn slower delay-1s"
          leave-active-class="animated fadeOut"
        >
          <div v-if="user" class="flex items-center q-gutter-md col">
            <q-avatar size="48px">
              <img src="/images/no_profile_image_available.jpg" />
            </q-avatar>
            <div class="flex column col">
              <div class="ellipsis-3-lines text-weight-medium text-body2 text-white">
                <template>
                  {{ capitalizeString(user?.user.name || '') }}
                </template>
              </div>
              <div class="text-caption text-blue-grey-4">
                {{ user?.user.profileName }}
              </div>
            </div>
          </div>
          <div v-else class="flex items-center q-gutter-md col">
            <q-avatar size="48px">
              <q-skeleton type="QAvatar" />
            </q-avatar>
            <div class="flex column col">
              <q-skeleton type="text" width="120px" />
              <q-skeleton type="text" width="80px" />
            </div>
          </div>
        </transition>
        <transition
          appear
          enter-active-class="animated fadeIn slower delay-1s"
          leave-active-class="animated fadeOut"
        >
          <q-btn
            flat
            aria-label="Cerrar sesión"
            @click="handleLogout"
            color="white"
            size="md"
            padding="sm"
            icon="sym_r_exit_to_app"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[0, 10]"
              class="bg-color-primary-50 text-primary"
            >
              Cerrar sesión
            </q-tooltip>
          </q-btn>
        </transition>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
