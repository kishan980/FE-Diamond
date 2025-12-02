'use client';
import { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';

const headCells: HeadCell[] = [
  {
    id: 'AuctionBidders',
    numeric: false,
    disablePadding: false,
    label: 'Auction Bidders',
    sortable: true,
    fixedWith: '1%',
  },
  {
    id: 'login',
    numeric: false,
    disablePadding: false,
    label: 'Logged In',
    sortable: true,
    isFixed: true,
    fixedWith: '1%',
  },
  {
    id: 'lot',
    numeric: true,
    disablePadding: false,
    label: 'Lot Value (US$)',
    sortable: true,
    isFixed: true,
    fixedWith: '1%',
  },
  {
    id: 'login',
    numeric: true,
    disablePadding: false,
    label: 'US$/ct.',
    sortable: true,
    isFixed: true,
    fixedWith: '1%',
  },
  {
    id: 'Options',
    numeric: false,
    disablePadding: false,
    label: 'Actions',
    sortable: false,
    isFixed: true,
    fixedWith: '1%',
  },
];
const AllLotsBidderTableHeader = ({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => {
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'Options' ? 'center' : headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.fixedWith}
            sx={{
              position: 'sticky !important',
              ...(headCell.isFixed && {
                right: 0,
                backgroundColor: '#F8F9FA',
                zIndex: 10,
                minWidth: 150,
              }),
            }}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default AllLotsBidderTableHeader;
