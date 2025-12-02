// TYPES
import { KeyedObject } from 'types/root';
import { GetComparator } from 'types/table';

// ==============================|| CUSTOM FUNCTION - REACT TABLE ||============================== //

// New
export function descendingComparator<T extends KeyedObject>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const getComparator: GetComparator = (order, orderBy) =>
  order === 'asc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

export const getDescComparator: GetComparator = (order, orderBy) =>
  order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

export function stableSort<T extends KeyedObject>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
