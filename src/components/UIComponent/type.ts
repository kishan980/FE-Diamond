import { TableCellProps } from '@mui/material/TableCell';

export type MultipleOptions = {
  id: number | string | boolean;
  name: string;
};

export type ChildTableHeadersProps = { id: string; label: string; align: TableCellProps['align'] };
