export const extractFirstItemValue = <T extends Record<string, any>, K extends keyof T>(
  res: { success: boolean; data: T[] } | string,
  key: K,
  fallback: T[K]
): T[K] => {
  if (typeof res !== 'string' && res.success && res.data.length > 0) {
    return res.data[0][key];
  }
  return fallback;
};
