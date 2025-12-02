'use client';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { memo } from 'react';
import { LEGAL_DOC_HEAD_CELLS } from 'constants/tableHeadCells';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';

const LegalDocumentTableHeader = memo(({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => (
  <TableHead>
    <TableRow>{LEGAL_DOC_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
  </TableHead>
));

export default LegalDocumentTableHeader;
