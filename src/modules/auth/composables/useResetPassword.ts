import { storeToRefs } from 'pinia';
import { Loading } from 'quasar';
import { useRouter } from 'vue-router';
import { useQuery, keepPreviousData, useMutation } from '@tanstack/vue-query';
import type { AxiosError } from 'axios'; // Import AxiosError
import {
  requestPassword,
  verifyCode,
  resetPassword as apiResetPassword,
} from '../api/resetPasswordApi'; // Renamed import
import { useResetPasswordStore } from '../stores/useResetPasswordStore';
import { AuthRoutes } from '../interfaces/auth-routes';
import useNotify from '../../shared/composables/useNotify';

const resetPassword = () => {
  const resetPasswordStore = useResetPasswordStore();
  const { requestPasswordForm, verifyCodeForm, resetPasswordForm } =
    storeToRefs(resetPasswordStore);

  const { errorNotify, successNotify } = useNotify();

  const router = useRouter();

  const requestPasswordQuery = useQuery({
    queryKey: ['requestPassword'],
    queryFn: () => requestPassword(requestPasswordForm.value),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: false,
  });

  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: (data) => {
      if (data.sessionToken) {
        successNotify(data.message || 'Código verificado correctamente.');
        resetPasswordStore.setSessionToken(data.sessionToken);
        void router.push({ name: AuthRoutes.CHANGE_PASSWORD_RESET });
      } else {
        errorNotify(
          data.message ||
            'Código incorrecto o expirado. Por favor, revise la respuesta de la API en la consola para más detalles.',
        );
      }
    },
    onError: (error: AxiosError) => {
      let errorMessage = 'Error al verificar el código. Intente de nuevo.';
      if (error.response && error.response.data) {
        const responseData = error.response.data as { message?: string; [key: string]: unknown };
        if (typeof responseData.message === 'string') {
          errorMessage = responseData.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      errorNotify(errorMessage);
    },
    onSettled: () => {
      Loading.hide('verify-code');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: apiResetPassword,
    onSuccess: (data) => {
      successNotify(data.message || 'Contraseña restablecida correctamente.');
      resetPasswordStore.clearAllForms();
      void router.push({ name: AuthRoutes.LOGIN });
    },
    onError: (error: AxiosError) => {
      let errorMessage = 'Error al restablecer la contraseña. Intente de nuevo.';
      let isSessionExpired = false;

      if (error.response && error.response.data) {
        const responseData = error.response.data as { message?: string; [key: string]: unknown };
        if (typeof responseData.message === 'string') {
          errorMessage = responseData.message;
          if (errorMessage === 'La sesión para restablecer la contraseña ha expirado.') {
            isSessionExpired = true;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      errorNotify(errorMessage);

      if (isSessionExpired) {
        resetPasswordStore.clearAllForms();
        void router.push({ name: AuthRoutes.CHANGE_PASSWORD_REQUEST });
      }
    },
    onSettled: () => {
      Loading.hide('reset-password');
    },
  });

  const submitVerificationCode = async () => {
    Loading.show({
      group: 'verify-code',
      message: 'Verificando código...',
    });
    if (!requestPasswordForm.value.email) {
      errorNotify('No se ha proporcionado un correo electrónico para la verificación.');
      Loading.hide('verify-code');
      return;
    }
    await verifyCodeMutation.mutateAsync({
      email: requestPasswordForm.value.email,
      code: verifyCodeForm.value.code,
    });
  };

  const verifyEmail = async () => {
    Loading.show({
      group: 'request-password',
      message: 'Verificando correo...',
    });
    try {
      const result = await requestPasswordQuery.refetch();

      if (result.isSuccess && result.data) {
        if (result.data.emailRegistered === true) {
          successNotify('Se ha enviado un código de verificación a tu correo.');
          void router.push({ name: AuthRoutes.CHANGE_PASSWORD_VERIFY });
        } else {
          errorNotify(
            result.data.message || 'El correo no está registrado o la cuenta está inactiva.',
          );
        }
      } else if (result.isError) {
        const errorMessage =
          result.error?.message || 'Error al verificar el correo. Intente de nuevo.';

        errorNotify(errorMessage);
      } else {
        errorNotify('Respuesta inesperada del servidor. Intente de nuevo más tarde.');
      }
    } catch (error: unknown) {
      console.error('Error in verifyEmail:', error);
      let errorMessage = 'Ocurrió un error inesperado al procesar su solicitud.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = error as any;
      if (errorResponse?.response?.data?.message) {
        errorMessage = errorResponse.response.data.message;
      }
      errorNotify(errorMessage);
    } finally {
      Loading.hide('request-password');
    }
  };

  const submitNewPassword = async () => {
    Loading.show({
      group: 'reset-password',
      message: 'Restableciendo contraseña...',
    });

    if (resetPasswordForm.value.newPassword !== resetPasswordForm.value.confirmPassword) {
      errorNotify('Las contraseñas no coinciden.');
      Loading.hide('reset-password');
      return;
    }
    if (!resetPasswordForm.value.sessionToken) {
      errorNotify(
        'No hay una sesión válida para restablecer la contraseña. Por favor, inicie el proceso de nuevo.',
      );
      Loading.hide('reset-password');
      void router.push({ name: AuthRoutes.CHANGE_PASSWORD_REQUEST });
      return;
    }

    await resetPasswordMutation.mutateAsync({
      sessionToken: resetPasswordForm.value.sessionToken,
      newPassword: resetPasswordForm.value.newPassword,
      confirmPassword: resetPasswordForm.value.confirmPassword,
    });
  };

  return {
    requestPasswordForm,
    requestPasswordQuery,
    verifyCodeForm,
    resetPasswordForm,
    verifyEmail,
    submitVerificationCode,
    submitNewPassword,
  };
};

export default resetPassword;
