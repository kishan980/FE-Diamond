'use client';
import React from 'react';

// MATERIAL - UI
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

const EventBidLotsTableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell sx={{ pl: 3 }}>Bidding Company</TableCell>
      <TableCell align="left">Contact Person</TableCell>
      <TableCell align="left">Mobile</TableCell>
      <TableCell align="left" sx={{ minWidth: 110 }}>
        Bid Value per Carat (US$)
      </TableCell>
      <TableCell align="left" sx={{ minWidth: 110 }}>
        Bid Value per Lot (US$)
      </TableCell>
      <TableCell align="left">Comment</TableCell>
      <TableCell align="left">Status</TableCell>
      <TableCell sx={{ pr: 3 }} align="left">
        Actions
      </TableCell>
    </TableRow>
  </TableHead>
);

export default EventBidLotsTableHeader;
