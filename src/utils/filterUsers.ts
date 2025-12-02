import { KeyedObject } from 'types/root';

export function filterUsers<T extends KeyedObject>(list: T[], search: string, keys: (keyof T)[]): T[] {
  if (!search) return list;
  const lowerSearch = search.toLowerCase();
  return list.filter((item) => keys.some((key) => item[key]?.toString().toLowerCase().includes(lowerSearch)));
}
