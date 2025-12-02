// Character generation helpers
const getRandomCharacters = (chars: string, length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const getRandomSpecialCharacters = (length: number): string => getRandomCharacters('$@$!%*?&', length);

export const getRandomUppercaseLetters = (length: number): string => getRandomCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);

export const getRandomLowercaseLetters = (length: number): string => getRandomCharacters('abcdefghijklmnopqrstuvwxyz', length);

export const getRandomDigits = (length: number): string => getRandomCharacters('0123456789', length);

export const generateRandomPassword = (): string => {
  return getRandomUppercaseLetters(2) + getRandomLowercaseLetters(2) + getRandomDigits(2) + getRandomSpecialCharacters(2);
};
