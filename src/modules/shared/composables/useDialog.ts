import { Dialog } from 'quasar';
import type { Component } from 'vue';
import DialogFormAuthorizationAdmin from '../components/DialogFormAuthorizationAdmin.vue';
type Color =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'positive'
  | 'negative'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light';

interface Props {
  message: string;
  title?: string;
  colorOk?: Color;
  colorCancel?: Color;
  labelOK?: string;
  labelCancel?: string;
  unelevatedOk?: boolean;
  component?: Component;
}

const useDialog = () => {
  const confirmDialog = (props: Props): Promise<boolean> => {
    return new Promise((resolve) => {
      Dialog.create({
        message: props.message,
        title: props.title ?? '',
        cancel: {
          label: props.labelCancel,
          flat: true,
          unelevated: props.unelevatedOk,
          noCaps: true,
          color: props.colorCancel ?? 'negative',
        },
        persistent: true,
        ok: {
          label: props.labelOK,
          flat: true,
          unelevated: props.unelevatedOk,
          color: props.colorOk,
          noCaps: true,
        },
      })
        .onOk(() => {
          resolve(true);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };
  const warningDialog = (props: Props): Promise<boolean> => {
    return new Promise((resolve) => {
      Dialog.create({
        message: props.message,
        title: props.title ?? '',
        persistent: true,
        cancel: {
          label: props.labelCancel,
          flat: true,
          unelevated: props.unelevatedOk,
          noCaps: true,
        },
        ok: {
          label: props.labelOK,
          flat: true,
          unelevated: props.unelevatedOk,
          color: props.colorOk,
          noCaps: true,
        },
      })
        .onOk(() => {
          resolve(true);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };
  const authorizationAdmin = (title: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Dialog.create({
        component: DialogFormAuthorizationAdmin,
        noBackdropDismiss: true,
        componentProps: {
          text: title,
        },
      })
        .onOk(() => {
          resolve(true);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };

  const customDialog = (props: Props): Promise<boolean> => {
    return new Promise((resolve) => {
      Dialog.create({
        class: 'customDialog',
        message: props.message,
        title: props.title ?? '',
        persistent: true,
        cancel: {
          label: props.labelCancel,
          flat: true,
          noCaps: true,
          color: 'negative',
        },
        ok: {
          label: props.labelOK,
          flat: true,
          color: props.colorOk,
          noCaps: true,
        },
      })
        .onOk(() => {
          resolve(true);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };

  return {
    confirmDialog,
    warningDialog,
    customDialog,
    authorizationAdmin,
  };
};

export default useDialog;
