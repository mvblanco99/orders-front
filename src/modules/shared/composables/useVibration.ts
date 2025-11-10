import { ref } from 'vue';

const useVibration = () => {
  const isSupported = ref('vibrate' in navigator);

  const vibrate = (pattern: number | number[]) => {
    if (isSupported.value) {
      window.navigator.vibrate(pattern);
    } else {
      console.warn('Vibration API is not supported in this browser.');
    }
  };

  const stopVibration = () => {
    if (isSupported.value) {
      navigator.vibrate(0);
    }
  };

  return {
    isSupported,
    vibrate,
    stopVibration,
  };
};

export default useVibration;
