
// Converts English digits to Persian digits
export const toPersianDigits = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '';
  const str = String(value);
  return str.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

// Formats a number with commas and converts to Persian digits
export const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return toPersianDigits(num.toLocaleString('en-US'));
};

// Ensures dates are displayed with Persian digits
export const formatDate = (date: string): string => {
  return toPersianDigits(date);
};

// Formats currency (if needed later)
export const formatCurrency = (value: number): string => {
  return formatNumber(value) + ' ریال';
};
