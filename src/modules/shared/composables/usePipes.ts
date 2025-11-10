const usePipes = () => {
  // number in format 1,000,000 with 2 decimal places
  const integer = (value = 0) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // number in format 1,000,000 with 2 decimal places
  const number = (value = 0, digits = 2, locale = 'en-US') => {
    return value.toLocaleString(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  // number in format 1.000.000 without decimal places separated by dot
  const numberNoDecimal = (value = 0, locale = 'en-US') => {
    return value
      .toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, '.');
  };

  // number in format currency
  const currency = (value = 0, locale = 'en-US', currency = 'USD') =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);

  //currency in format 1.000.000,00 (USD, con símbolo)
  const currencyUSD = (value = 0) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace(/,/g, '.')
      .replace(/\.(\d{2})$/, ',$1');

  const currencyUSDNoSymbol = (value = 0) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value ?? 0)
      .replace(/,/g, '.')
      .replace(/\.(\d{2})$/, ',$1');

  // currency in format Bs. 1.000.000,00
  const currencyBs = (value = 0) =>
    new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace(/,/g, '.')
      .replace(/Bs\.S/, 'Bs.')
      .replace(/\.(\d{2})$/, ',$1');

  // number in format percentage
  const percentage = (value = 0) =>
    new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
    }).format(value);

  // string in format date
  const date = (value: string) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(new Date(value));

  // string max length
  const maxLength = (value: string, length: number) => {
    if (value.length > length) {
      return value.substring(0, length) + '...';
    }
    return value;
  };

  // string capitalize
  const capitalizeString = (text: string) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /**
   * Convierte un string con formato de monto español a número
   * Ejemplo: "200.000,10" -> 200000.10
   */
  const parseFormattedAmount = (value: string): number => {
    if (!value) return 0;
    // Eliminar puntos (separadores de miles) y reemplazar coma por punto (decimal)
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  return {
    integer,
    number,
    numberNoDecimal,
    currency,
    currencyBs,
    percentage,
    currencyUSD,
    currencyUSDNoSymbol,
    date,
    maxLength,
    capitalizeString,
    parseFormattedAmount,
  };
};

export default usePipes;
