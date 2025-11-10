const useValidators = () => {
  return {
    isRequired: (val: string) => !!val || 'Este campo es requerido',

    isRequiredIf: (val: string, condition: boolean) =>
      condition ? true : !!val || 'Este campo es requerido',

    isAlpha: (val: string) => /^[a-zA-Z]+$/.test(val) || 'Por favor ingrese solo letras',

    isEmail: (val: string) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
      'Por favor ingrese un correo válido',

    isNumber: (val: number) => !isNaN(val) || 'Por favor ingrese un número válido',

    isBoolean: (val: boolean) => typeof val === 'boolean' || 'Por favor ingrese un valor booleano',

    isLengthAutocomplete: (val: string, length: number) => {
      return val.length >= length || `Ingrese al menos ${length} caracteres`;
    },

    isLength: (length: number) => (val: string) =>
      val.length >= length || `Ingrese al menos ${length} caracteres`,

    max: (val: string, max: number) => val.length <= max || `El máximo de caracteres es ${max}`,

    min: (val: string, min: number) => val.length >= min || `El mínimo de caracteres es ${min}`,

    maxLength: (val: string, max: number) =>
      val.length <= max || `El máximo de caracteres es ${max}`,

    minLength: (val: string, min: number) =>
      val.length >= min || `El mínimo de caracteres es ${min}`,

    isEqual: (val: string | number, compare: string | number) =>
      val === compare || 'Los valores no coinciden',

    isUrl: (val: string) =>
      /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i.test(
        val,
      ) || 'Por favor ingrese una URL válida',

    isPassword: (val: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$.!%*?&.]{6,}$/.test(val) ||
      'La contraseña debe tener al menos 6 caracteres e incluir una mayúscula, un número y un símbolo especial.',

    isNumberPositive: (val: number) => val > 0 || 'Tiene que ingresar un valor mayor que 0',

    isLengthMin13: (val: string) => val.length === 13 || 'El valor tiene que ser igual a 13',

    isLengthMin8: (val: string) => val.length === 8 || 'El valor tiene que ser igual a 8',

    isCaracterSpecial: (val: number) =>
      /^[a-zA-Z0-9\s?!]+$/.test(val.toString()) || 'Caracter no permitido',

    isAlphaNumeric: (val: string) => /^([a-zA-Z0-9_-]){1,13}$/.test(val) || 'Caracter no permitido',

    isNumericOperation: (val: string) =>
      /^[\d+\-*]+$/.test(val) || 'Por favor ingrese solo números y operadores + - *',

    isNumberPhone: (val: string) =>
      /^(\+58)?[0-9]{9,12}$/.test(val) ||
      'Por favor ingrese un número de teléfono válido, ej: +581234567',

    isNumericString: (val: string) => /^[0-9]+$/.test(val) || 'Por favor ingrese solo números',

    isDriverLicense: (val: string) =>
      /^[A-Za-z]\d{7,9}$/.test(val) || 'Por favor, ingrese un formato valido, ej: C12345678',

    isISODate: (val: string) => {
      // 1. Primero, verifica que el formato sea 'AAAA-MM-DD'
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(val)) {
        return 'El formato debe ser AAAA-MM-DD';
      }

      // 2. Luego, verifica que la fecha sea válida (ej. no es 30 de febrero)
      const date = new Date(val);
      // getTime() devuelve NaN para fechas inválidas
      const timestamp = date.getTime();
      if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return 'Por favor ingrese una fecha válida';
      }

      // 3. Finalmente, asegúrate de que new Date() no "corrigió" la fecha.
      // ej. new Date('2024-02-30') se convierte en 1 de marzo.
      // toISOString().slice(0, 10) devuelve la fecha en formato AAAA-MM-DD
      return date.toISOString().slice(0, 10) === val || 'Por favor ingrese una fecha válida';
    },
  };
};

export default useValidators;
