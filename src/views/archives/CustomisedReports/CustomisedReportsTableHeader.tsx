'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { CUSTOMISED_REPORT_HEAD_CELLS } from 'constants/tableHeadCells';

const CustomisedReportsTableHeader = ({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => (
  <TableHead>
    <TableRow>{CUSTOMISED_REPORT_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
  </TableHead>
);

export default CustomisedReportsTableHeader;
