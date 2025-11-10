import { computed, watch } from 'vue';
import type { QTable, QTableProps } from 'quasar';
import { useQuery } from '@tanstack/vue-query';

import { useManageZone } from './useManageZone';
import { findAllZones } from '../api/zonesApi';

export enum queryKeyZones {
  ZONES = 'zones',
}

export const useZoneQuery = () => {
  const { zones, zoneFilters, zonePagination, setZonesPagination, setZonesInputSearch } =
    useManageZone();

  const queryKey = computed(() => [
    queryKeyZones.ZONES,
    zonePagination.value!.page,
    zonePagination.value!.rowsPerPage,
    zonePagination.value!.sortBy,
    zonePagination.value!.descending,
    zoneFilters.value,
  ]);

  const queryFn = async () => {
    const limit = zonePagination.value!.rowsPerPage || 10;
    const offset = (zonePagination.value!.page! - 1) * limit;

    return await findAllZones({ limit, offset, inputSearch: zoneFilters.value.inputSearch });
  };

  const zonesQuery = useQuery({
    queryKey,
    queryFn,
    retry: 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  watch(zonesQuery.data, (newVal) => {
    if (!newVal) return;
    zones.value = newVal.data;
    zonePagination.value!.rowsNumber = newVal.meta.total || 0;
  });

  const totalZones = computed(() => zonesQuery.data?.value?.meta.total || 0);

  const onRequest: QTableProps['onRequest'] = (props) => {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;

    setZonesPagination({
      page,
      rowsPerPage,
      sortBy,
      descending,
      rowsNumber: totalZones.value,
    });
  };

  const columnTable: QTable['columns'] = [
    { name: 'code', label: 'Código', field: 'code', align: 'left' },
    { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
    {
      name: 'description',
      label: 'Descripción',
      field: 'description',
      align: 'left',
    },
    { name: 'isActive', label: 'Activo', field: 'isActive', align: 'center' },
    {
      name: 'actions',
      required: true,
      label: 'Acc.',
      align: 'center',
      field: 'actions',
      style: 'position: sticky; right:0; background-color: #d6eaf8;',
      headerStyle: 'background-color: #d6eaf8; position: sticky; right:0',
    },
  ];

  return {
    // Refs
    zones,
    columnTable,
    zonesQuery,
    totalZones,
    zoneFilters,
    zonePagination,

    // Actions
    onRequest,
    setZonesPagination,
    setZonesInputSearch,
  };
};
