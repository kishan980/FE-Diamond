'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { CANAL_WINNING_BID_POLISHED_HEAD_CELLS, CANAL_WINNING_BID_ROUGH_HEAD_CELLS } from 'constants/tableHeadCells';

const CancelWinningBidHeader = ({
  order,
  orderBy,
  onRequestSort,
  eventCategoryID,
}: EnhancedTableHeadProps & {
  eventCategoryID: number;
}) => {
  const headerCells = eventCategoryID === 1 ? CANAL_WINNING_BID_ROUGH_HEAD_CELLS : CANAL_WINNING_BID_POLISHED_HEAD_CELLS;

  return (
    <TableHead>
      <TableRow>{headerCells.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
    </TableHead>
  );
};

export default CancelWinningBidHeader;
