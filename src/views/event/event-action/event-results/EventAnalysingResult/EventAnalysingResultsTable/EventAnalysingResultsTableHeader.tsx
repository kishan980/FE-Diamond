'use client';
import { SyntheticEvent } from 'react';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';

const headPolishedCells: HeadCell[] = [
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: false,
    label: 'Lot No',
  },
  {
    id: 'Shape',
    numeric: false,
    disablePadding: false,
    label: 'Shape',
    minWidth: 100,
  },
  {
    id: 'Clarity',
    numeric: true,
    disablePadding: false,
    label: 'Clarity',
  },
  {
    id: 'pcs',
    numeric: true,
    disablePadding: false,
    label: 'Stone Count',
  },
  {
    id: 'cts',
    numeric: true,
    disablePadding: false,
    label: 'Weight (Carats)',
  },
  {
    id: 'reserve',
    numeric: true,
    disablePadding: false,
    label: 'Reserve Price(US$)',
  },
  {
    id: 'noOfBids',
    numeric: true,
    disablePadding: false,
    label: 'No Of Bids',
    minWidth: 70,
  },
  {
    id: 'AcceptBid?',
    numeric: false,
    disablePadding: false,
    label: 'Accept Bid?',
  },
  {
    id: 'co_name',
    numeric: false,
    disablePadding: false,
    label: 'Best Bidder',
  },
  {
    id: 'bid_value',
    numeric: true,
    disablePadding: false,
    label: 'Bid Value Per Carats (US$)',
    minWidth: 130,
  },
  {
    id: 'variance',
    numeric: true,
    disablePadding: false,
    label: 'Reserve Price Variance',
    minWidth: 120,
  },
  {
    id: 'Win_Rate',
    numeric: true,
    disablePadding: false,
    label: 'Bid Value Per Lot(US$)',
    minWidth: 120,
  },
];

const headRoughCells: HeadCell[] = [
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: false,
    label: 'Lot No',
  },
  {
    id: 'SalesType',
    numeric: false,
    disablePadding: false,
    label: 'Type Of Sale',
    minWidth: 100,
  },
  {
    id: 'Size',
    numeric: false,
    disablePadding: false,
    label: 'Size Range',
  },
  {
    id: 'stockDesc',
    numeric: false,
    disablePadding: false,
    label: 'Lot Description',
  },
  {
    id: 'pcs',
    numeric: true,
    disablePadding: false,
    label: 'Stone Count',
  },
  {
    id: 'cts',
    numeric: true,
    disablePadding: false,
    label: 'Weight (Carats)',
  },
  {
    id: 'reserve',
    numeric: true,
    disablePadding: false,
    label: 'Reserve Price(US$)',
  },
  {
    id: 'noOfBids',
    numeric: true,
    disablePadding: false,
    label: 'No Of Bids',
    minWidth: 70,
  },
  {
    id: 'AcceptBid?',
    numeric: false,
    disablePadding: false,
    label: 'Accept Bid?',
  },
  {
    id: 'co_name',
    numeric: false,
    disablePadding: false,
    label: 'Best Bidder',
  },
  {
    id: 'bid_value',
    numeric: true,
    disablePadding: false,
    label: 'Bid Value Per Carats (US$)',
    minWidth: 130,
  },
  {
    id: 'variance',
    numeric: true,
    disablePadding: false,
    label: 'Reserve Price Variance',
    minWidth: 120,
  },
  {
    id: 'Win_Rate',
    numeric: true,
    disablePadding: false,
    label: 'Bid Value Per Lot(US$)',
    minWidth: 120,
  },
  {
    id: 'SellerName',
    numeric: false,
    disablePadding: false,
    label: 'Seller Compnay',
  },
  {
    id: 'MineID',
    numeric: false,
    disablePadding: false,
    label: 'Mines',
  },
];

const EventAnalysingResultsTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  rowCount,
  numSelected,
  onSelectAllClick,
  eventCategoryID,
}: EnhancedTableHeadProps & {
  eventCategoryID: number;
}) => {
  const headerCells = eventCategoryID === 1 ? headRoughCells : headPolishedCells;
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={Boolean(rowCount) && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-labelledby': 'select all' }}
          />
        </TableCell>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{ minWidth: headCell.minWidth }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EventAnalysingResultsTableHeader;
