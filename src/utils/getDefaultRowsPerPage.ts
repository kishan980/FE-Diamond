export const getDefaultRowsPerPage = (): number => {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  if (!envValue) return 5;

  const parsed = envValue
    .split(',')
    .map((v) => parseInt(v.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);

  return parsed.length > 0 ? parsed[0] : 5;
};
