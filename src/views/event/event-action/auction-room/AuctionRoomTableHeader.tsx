'use client';
import { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';

const headCells: (HeadCell & {
  subHeaders?: { id: string; numeric?: boolean; label: string; sortable: boolean; minWidth?: number }[];
})[] = [
  {
    id: 'sr',
    numeric: false,
    disablePadding: true,
    label: '#',
    sortable: false,
    minWidth: 50,
  },
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: true,
    label: 'Lot No',
    sortable: true,
    minWidth: 80,
  },
  {
    id: 'Size',
    numeric: false,
    disablePadding: false,
    label: 'Size Range',
    sortable: true,
    minWidth: 100,
  },
  {
    id: 'stockDesc',
    numeric: false,
    disablePadding: false,
    label: 'Lot Description',
    sortable: true,
    minWidth: 150,
  },
  {
    id: 'cts',
    numeric: true,
    disablePadding: false,
    label: 'Weight (Carats)',
    sortable: true,
    minWidth: 100,
  },
  {
    id: 'SuggesetedMinBid',
    numeric: true,
    disablePadding: false,
    label: 'Min New Bid (US$/ct.)',
    sortable: true,
    minWidth: 130,
  },
  {
    id: 'highestBidGroup',
    numeric: false,
    disablePadding: false,
    label: 'Highest Bid',
    sortable: false,
    subHeaders: [
      { id: 'Max_bid_value', numeric: true, label: 'Price per Carat (US$/ct.)', sortable: true, minWidth: 130 },
      { id: 'Max_lot_value', numeric: true, label: 'Total Lot Value (US$)', sortable: true, minWidth: 130 },
    ],
  },
  {
    id: 'AuctionremainingTime',
    numeric: true,
    disablePadding: false,
    label: 'Time Left',
    sortable: true,
    minWidth: 120,
  },
  {
    id: 'noOfBids',
    numeric: true,
    disablePadding: false,
    label: 'No of Bids',
    sortable: false,
    minWidth: 100,
  },
];

const AuctionRoomTableHeader = ({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => {
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) =>
          headCell.subHeaders ? (
            <TableCell key={headCell.id} align="center" colSpan={headCell.subHeaders.length} sx={{ minWidth: headCell.minWidth || 0 }}>
              {headCell.label}
            </TableCell>
          ) : (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              rowSpan={2}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ minWidth: headCell.minWidth || 0 }}
            >
              {headCell.sortable ? (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  )}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          )
        )}
      </TableRow>

      <TableRow>
        {headCells
          .filter((cell) => cell.subHeaders)
          .flatMap((cell) =>
            cell.subHeaders!.map((sub, index) => (
              <TableCell
                key={`${cell.id}-sub-${index}`}
                align={sub.numeric ? 'right' : 'left'}
                sortDirection={orderBy === sub.id ? order : false}
                sx={{ minWidth: sub.minWidth || 0 }}
              >
                {sub.sortable ? (
                  <TableSortLabel
                    active={orderBy === sub.id}
                    direction={orderBy === sub.id ? order : 'asc'}
                    onClick={createSortHandler(sub.id)}
                  >
                    {sub.label}
                    {orderBy === sub.id && (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    )}
                  </TableSortLabel>
                ) : (
                  sub.label
                )}
              </TableCell>
            ))
          )}
      </TableRow>
    </TableHead>
  );
};

export default AuctionRoomTableHeader;
