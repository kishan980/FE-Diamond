'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { ChildTableCell } from '../EventAnalysingResults.styled';

const EventAnalysingResultsDetailsTableHeader = () => (
  <TableHead>
    <TableRow>
      <ChildTableCell></ChildTableCell>
      <ChildTableCell align="right">Offered</ChildTableCell>
      <ChildTableCell align="right">Sold</ChildTableCell>
      <ChildTableCell align="right">Withdrawn</ChildTableCell>
      <ChildTableCell align="right">No Bids</ChildTableCell>
    </TableRow>
  </TableHead>
);

export default EventAnalysingResultsDetailsTableHeader;
