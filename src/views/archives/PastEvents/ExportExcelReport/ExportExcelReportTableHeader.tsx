'use client';
import { ChangeEvent } from 'react';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { EnhancedTableHeadProps } from 'types/table';
import { EXPORT_EXCEL_HEAD_CELLS } from 'constants/tableHeadCells';
import { renderHeadCell } from 'utils/renderHeadCell';

const ExportExcelReportTableHeader = ({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}: EnhancedTableHeadProps) => {
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (onSelectAllClick) onSelectAllClick(event);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ position: 'sticky !important' }}>
          <Checkbox
            checked={Boolean(rowCount) && numSelected === rowCount}
            onChange={handleSelectAllClick}
            inputProps={{ 'aria-labelledby': 'select all' }}
          />
        </TableCell>
        {EXPORT_EXCEL_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}
      </TableRow>
    </TableHead>
  );
};

export default ExportExcelReportTableHeader;
