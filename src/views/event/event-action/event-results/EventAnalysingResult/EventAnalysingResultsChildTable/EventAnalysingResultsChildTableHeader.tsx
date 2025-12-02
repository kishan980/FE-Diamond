'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { ChildTableCell } from '../EventAnalysingResults.styled';
import { CHILD_TABLE_HEADERS } from 'constants/event.constants';

const EventAnalysingResultsChildTableHeader = () => (
  <TableHead>
    <TableRow>
      {CHILD_TABLE_HEADERS.map((header) => (
        <ChildTableCell key={header.id} align={header.align}>
          {header.label}
        </ChildTableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default EventAnalysingResultsChildTableHeader;
