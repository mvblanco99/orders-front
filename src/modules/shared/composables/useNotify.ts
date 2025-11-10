import { Notify } from 'quasar';

const useNotify = () => {
  const successNotify = (
    message: string,
    timeout = 2000,
    icon?: string,
    position: 'top' | 'bottom' | 'top-left' | 'top-right' = 'bottom',
  ) => {
    Notify.create({
      message,
      ...(icon && { icon }),
      color: 'positive',
      textColor: 'white',
      position: position || 'bottom',
      badgeClass: 'hidden',
      timeout,
    });
  };

  const infoNotify = (message: string, timeout = 2000) => {
    Notify.create({
      message,
      color: 'primary',
      textColor: 'white',
      position: 'bottom',
      badgeClass: 'hidden',
      timeout,
    });
  };

  const errorNotify = (message: string, timeout = 5000) => {
    Notify.create({
      message,
      color: 'negative',
      textColor: 'white',
      position: 'bottom',
      badgeClass: 'hidden',
      timeout,
      actions: [
        {
          label: 'Cerrar',
          color: 'white',
        },
      ],
    });
  };

  return {
    successNotify,
    errorNotify,
    infoNotify,
  };
};

export default useNotify;
