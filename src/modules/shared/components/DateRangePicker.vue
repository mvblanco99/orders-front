<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import DatePicker from 'src/modules/shared/components/DatePicker.vue';
import useDates from '../composables/useDates';
import type { DateRange, DateRangePickerProps } from '../interface/DateRangePicker';

interface Props {
  dateRange: DateRange;
  dense?: boolean;
}
const props = defineProps<Props>();

interface Emits {
  (event: 'onSelection', dateRange: DateRange): void;
}
const emits = defineEmits<Emits>();

const dateRanges = useDates();
const newDateRange = ref<DateRange>({
  startDate: new Date().toISOString().substring(0, 10),
  endDate: new Date().toISOString().substring(0, 10),
});

const ranges: { key: DateRangePickerProps; label: string; range: DateRange }[] = [
  { key: 'today', label: 'Hoy', range: dateRanges.rangeToday },
  { key: 'yesterday', label: 'Ayer', range: dateRanges.rangeYesterday },
  {
    key: 'last7Days',
    label: 'Últimos 7 días',
    range: dateRanges.rangeLast7Days,
  },
  {
    key: 'lastWeek',
    label: 'Semana anterior',
    range: dateRanges.rangeLastWeek,
  },
  {
    key: 'currentMonth',
    label: 'Mes actual',
    range: dateRanges.rangeCurrentMonth,
  },
  {
    range: dateRanges.rangeLastMonth,
    label: 'Mes anterior',
    key: 'lastMonth',
  },
  {
    key: 'last12Months',
    label: 'Últimos 12 meses',
    range: dateRanges.rangeLast12Months,
  },
  {
    key: 'currentYear',
    label: 'Año actual',
    range: dateRanges.rangeCurrentYear,
  },
  { key: 'lastYear', label: 'Año anterior', range: dateRanges.rangeLastYear },
];

const onStartDateChange = (startDate: string) => {
  emits('onSelection', { startDate, endDate: newDateRange.value.endDate });
};

const onEndDateChange = (endDate: string) => {
  emits('onSelection', { startDate: newDateRange.value.startDate, endDate });
};

const optionsStartDateFunction = (date: string) => {
  if (!newDateRange.value.endDate) return true;
  return date <= newDateRange.value.endDate.replaceAll('-', '/');
};

const optionsEndDateFunction = (date: string) => {
  if (!newDateRange.value.startDate) return true;
  return date >= newDateRange.value.startDate.replaceAll('-', '/');
};

const onRangeSelection = (range: DateRangePickerProps) => {
  const dat = ranges.find((r) => r.key === range);
  if (dat?.range) newDateRange.value = dat.range;
  emits('onSelection', newDateRange.value);
};

watchEffect(() => {
  if (props.dateRange) newDateRange.value = props.dateRange;
});
</script>

<template>
  <div>
    <div class="row q-gutter-sm">
      <div class="col">
        <DatePicker
          :dense="dense"
          label="Fecha inicio"
          :date="newDateRange.startDate"
          :options-fn="optionsStartDateFunction"
          @selection="onStartDateChange"
        ></DatePicker>
      </div>

      <div class="col">
        <DatePicker
          :dense="dense"
          label="Fecha final"
          :date="newDateRange.endDate"
          :options-fn="optionsEndDateFunction"
          @selection="onEndDateChange"
        ></DatePicker>
      </div>

      <div class="col-auto self-center">
        <q-btn flat rounded icon="sym_r_more_vert" dense>
          <q-tooltip class="text-body2"> Ver opciones </q-tooltip>
          <q-menu auto-close>
            <q-list style="min-width: 100px">
              <q-item
                v-for="{ key, label } in ranges"
                :key="key"
                clickable
                @click="onRangeSelection(key)"
              >
                <q-item-section>{{ label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
