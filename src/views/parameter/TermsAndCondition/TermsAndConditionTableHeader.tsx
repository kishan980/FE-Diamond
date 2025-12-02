'use client';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { TERMS_HEAD_CELLS } from 'constants/tableHeadCells';

const TermsAndConditionTableHeader = memo(function TermsAndConditionTableHeader({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) {
  return (
    <TableHead>
      <TableRow>{TERMS_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
    </TableHead>
  );
});

export default TermsAndConditionTableHeader;
