import type { AxiosError } from 'axios';
import useNotify from './useNotify';

const useHandlerErrors = () => {
  const { errorNotify } = useNotify();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  const handleApiResponseError = (error: AxiosError<any> | any) => {
    if (error.response) {
      const { status, data } = error.response;

      // Log del mensaje original del servidor para depuración
      console.error(`Error del servidor: ${data.message || 'Sin mensaje del servidor'}`);

      // Manejo de códigos de estado específicos con mensajes en español
      switch (status) {
        case 400:
          errorNotify(
            data.message || 'Solicitud incorrecta. Por favor, verifica los datos ingresados.',
          );
          break;
        case 401:
          errorNotify('No autorizado. Por favor, inicia sesión.');
          break;
        case 403:
          errorNotify('Acceso denegado. No tienes permisos para realizar esta acción.');
          break;
        case 404:
          errorNotify(
            data.message ||
              'Recurso no encontrado. Por favor, verifica la URL o el recurso solicitado.',
          );
          break;
        case 409:
          // Manejo de errores específicos de Prisma
          if (data.message.includes('Duplicate entry')) {
            errorNotify(
              'Ya existe un registro con los mismos datos. Por favor, verifica la información.',
            );
          } else {
            errorNotify(data.message || 'Conflicto de datos. Por favor, verifica la información.');
          }
          break;
        case 500:
          errorNotify('Error interno del servidor. Intenta nuevamente más tarde.');
          break;
        default:
          errorNotify(data.message || 'Ocurrió un error inesperado. Intenta nuevamente.');
          break;
      }
    } else if (error.request) {
      // Log del error de red para depuración
      console.error('Error de red: No se recibió respuesta del servidor.');
      errorNotify('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      // Log del error desconocido para depuración
      console.error(`Error desconocido: ${error.message}`);
      errorNotify('Error al procesar la petición. Intenta nuevamente.');
    }
  };

  return {
    handleApiResponseError,
  };
};

export default useHandlerErrors;
