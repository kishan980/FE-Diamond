'use client';
import { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { LEGAL_DOCUMENT_HEAD_CELLS } from 'constants/tableHeadCells';

const LegalDocumentTableHeader = memo(({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => (
  <TableHead>
    <TableRow>{LEGAL_DOCUMENT_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
  </TableHead>
));

export default LegalDocumentTableHeader;
