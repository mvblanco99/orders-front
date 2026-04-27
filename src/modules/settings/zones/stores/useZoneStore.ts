import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ZoneDto, ZoneFilter, ZoneItem } from '../interfaces/ZoneInterface';
import type { QTableProps } from 'quasar';

const initStateDto: ZoneDto = {
  id: undefined,
  name: '',
  isActive: true,
};

export const useZoneStore = defineStore('zonesStore', () => {
  const zones = ref<ZoneItem[]>([]);
  const zoneDto = ref<ZoneDto>(structuredClone(initStateDto));
  const zoneFilters = ref<ZoneFilter>({});
  const zoneDetail = ref<ZoneItem | null>(null);
  const zonePagination = ref<QTableProps['pagination']>({
    sortBy: 'id',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  });

  const resetZones = () => {
    zones.value = [];
  };

  const resetZoneDetail = () => {
    zoneDetail.value = null;
  };

  const resetZoneDto = () => {
    zoneDto.value = structuredClone(initStateDto);
  };

  const resetFilters = () => {
    zoneFilters.value = {};
  };

  const setPagination = (newPagination: QTableProps['pagination']) => {
    zonePagination.value = { ...newPagination, rowsNumber: newPagination?.rowsNumber || 0 };
  };

  const setInputSearch = (newFilter: string) => {
    zoneFilters.value.inputSearch = newFilter;
    zonePagination.value!.page = 1; // Resetear a la primera página al cambiar el filtro
  };

  return {
    // State
    zones,
    zoneDto,
    zoneDetail,
    zoneFilters,
    zonePagination,

    // Actions
    resetZones,
    resetZoneDetail,
    resetZoneDto,
    resetFilters,
    setPagination,
    setInputSearch,
  };
});
