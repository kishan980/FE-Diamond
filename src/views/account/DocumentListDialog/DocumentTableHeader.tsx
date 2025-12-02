'use client';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { DocumentTableHeaderProps } from 'types/table';
import { renderHeadCell } from 'utils/renderHeadCell';
import { DOCUMENT_TABLE_HEAD_CELLS } from 'constants/tableHeadCells';

const DocumentTableHeader = ({ order, orderBy, onRequestSort, companyNameSearch }: DocumentTableHeaderProps) => (
  <TableHead>
    <TableRow>
      <TableCell colSpan={DOCUMENT_TABLE_HEAD_CELLS.length + 1}>
        Member Document <span style={{ textTransform: 'capitalize' }}> ({companyNameSearch}) </span>
      </TableCell>
    </TableRow>
    <TableRow>{DOCUMENT_TABLE_HEAD_CELLS.map((headCell) => renderHeadCell({ headCell, order, orderBy, onRequestSort }))}</TableRow>
  </TableHead>
);

export default DocumentTableHeader;
