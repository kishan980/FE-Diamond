export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  const formatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value >= 0 ? '+' : '-'}${formatted}%`;
};

export const formatNumber = (
  value: number | string | undefined | null,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  } = {}
): string => {
  if (value === undefined || value === null || value === '') return '';

  const number = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(number)) return '';

  const { minimumFractionDigits = 2, maximumFractionDigits = 2, locale = 'en-US' } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);
};

export const formatNumberWithSign = (
  value: number | string | undefined | null,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
  } = {}
): string => {
  if (value === undefined || value === null || value === '') return '';

  const { minimumFractionDigits = 2, maximumFractionDigits = 2, locale = 'en-US' } = options;

  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '';

  const sign = number > 0 ? '+' : ''; // let minus sign come automatically for negative values
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);

  return `${sign}${formatted}`;
};

export const formatPercentageWithSign = (
  value: number | string | undefined | null,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    locale?: string;
    includeSymbol?: boolean; // For '%' sign
  } = {}
): string => {
  if (value === undefined || value === null || value === '') return '';

  const { minimumFractionDigits = 2, maximumFractionDigits = 2, locale = 'en-US', includeSymbol = true } = options;

  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '';

  const sign = number > 0 ? '+' : '';
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(number);

  return `${sign}${formatted}${includeSymbol ? '%' : ''}`;
};
