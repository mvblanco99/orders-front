import dayjs from 'dayjs';
import { computed } from 'vue';

const useUtils = () => {
  const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
  };

  const currentDate = computed(() => {
    return formatDate(new Date());
  }).value;

  const startOfMonth = computed(() => {
    return dayjs(currentDate).startOf('month').format('YYYY-MM-DD');
  }).value;

  const endOfMonth = computed(() => {
    return dayjs(currentDate).endOf('month').format('YYYY-MM-DD');
  }).value;

  const setTimeoutPromise = async (time: number) => {
    await new Promise((resolver) => setTimeout(resolver, time));
  };

  return {
    formatDate,
    setTimeoutPromise,
    currentDate,
    startOfMonth,
    endOfMonth,
  };
};

export default useUtils;
