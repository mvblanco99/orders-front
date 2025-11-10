import { useMutation } from '@tanstack/vue-query';

import { createZone, updateZone } from '../api/zonesApi';
import useVueQuery from 'src/modules/shared/composables/useVueQuery';
import { useManageZone } from './useManageZone';
import type { ZoneItem } from '../interfaces/ZoneInterface';

export const useZoneMutation = () => {
  const { zoneDto, resetZoneDto } = useManageZone();
  const { invalidQuery } = useVueQuery();

  const createZoneMutation = useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      invalidQuery({ queryKey: ['zones'], exact: false });
      resetZoneDto();
    },
  });

  const updateZoneMutation = useMutation({
    mutationFn: updateZone,
    onSuccess: () => {
      invalidQuery({ queryKey: ['zones'], exact: false });
      resetZoneDto();
    },
  });

  const fillZoneDto = (zone: ZoneItem) => {
    zoneDto.value = {
      id: zone.id,
      code: zone.code,
      name: zone.name,
      description: zone.description,
      isActive: zone.isActive,
    };
  };

  return { zoneDto, createZoneMutation, updateZoneMutation, fillZoneDto };
};
