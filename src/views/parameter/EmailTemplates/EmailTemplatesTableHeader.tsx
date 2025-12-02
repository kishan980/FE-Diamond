'use client';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { EnhancedTableHeadProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { EMAIL_TEMPLATE_HEAD_CELLS } from 'constants/tableHeadCells';

const EmailTemplatesTableHeader = memo(({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => (
  <TableHead>
    <TableRow>{EMAIL_TEMPLATE_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
  </TableHead>
));

export default EmailTemplatesTableHeader;
