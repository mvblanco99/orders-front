import { storeToRefs } from 'pinia';
import { useZoneStore } from '../stores/useZoneStore';

export const useManageZone = () => {
  const zoneStore = useZoneStore();
  const { zones, zoneDto, zoneDetail, zoneFilters, zonePagination } = storeToRefs(zoneStore);

  return {
    // Refs
    zones,
    zoneDto,
    zoneDetail,
    zoneFilters,
    zonePagination,

    // Actions
    setZonesPagination: zoneStore.setPagination,
    setZonesInputSearch: zoneStore.setInputSearch,
    resetZoneDto: zoneStore.resetZoneDto,
  };
};
