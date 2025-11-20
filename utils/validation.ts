
export const validateNationalId = (code: string): boolean => {
  if (!code || code.length !== 10 || !/^\d+$/.test(code)) return false;

  const check = parseInt(code[9]);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]) * (10 - i);
  }
  const remainder = sum % 11;

  if (remainder < 2) {
    return check === remainder;
  } else {
    return check === 11 - remainder;
  }
};
