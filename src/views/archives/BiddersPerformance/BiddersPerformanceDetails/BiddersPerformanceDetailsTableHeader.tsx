'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { BIDDER_PERFORMANCE_POLISHED_HEAD_CELLS, BIDDER_PERFORMANCE_ROUGH_HEAD_CELLS } from 'constants/tableHeadCells';

const BiddersPerformanceDetailsTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  entityType,
}: EnhancedTableHeadProps & {
  entityType: string | null;
}) => {
  const headerCells = entityType === 'Rough' ? BIDDER_PERFORMANCE_ROUGH_HEAD_CELLS : BIDDER_PERFORMANCE_POLISHED_HEAD_CELLS;

  return (
    <TableHead>
      <TableRow>{headerCells.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
    </TableHead>
  );
};

export default BiddersPerformanceDetailsTableHeader;
