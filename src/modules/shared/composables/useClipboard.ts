import useNotify from './useNotify';

const useClipboard = () => {
  const { successNotify, errorNotify } = useNotify();

  const copyToClipboardFallback = (sku: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = sku;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        successNotify('Contenido copiado', 1500);
      }
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      errorNotify('Error al copiar al portapapeles. Por favor, intenta nuevamente.');
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = async (data: string) => {
    if (!navigator.clipboard) {
      console.warn('El navegador no soporta la API del portapapeles. Usando método alternativo.');
      copyToClipboardFallback(data);
      return;
    }
    try {
      await navigator.clipboard.writeText(data);
      successNotify('Contenido copiado', 1500);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      errorNotify('Error al copiar al portapapeles. Por favor, intenta nuevamente.');
    }
  };
  return {
    copyToClipboard,
  };
};

export default useClipboard;
