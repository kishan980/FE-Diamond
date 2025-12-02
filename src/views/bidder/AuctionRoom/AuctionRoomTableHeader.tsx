'use client';
import { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';

const headRoughCells: (HeadCell & { subHeaders?: { id: string; label: string; sortable: boolean; minWidth?: number }[] })[] = [
  {
    id: 'sr',
    numeric: false,
    disablePadding: true,
    label: 'Sr No.',
    sortable: true,
  },
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: true,
    label: 'Lot No',
    sortable: true,
  },
  {
    id: 'Size',
    numeric: false,
    disablePadding: false,
    label: 'Size Range',
    sortable: true,
  },
  {
    id: 'stockDesc',
    numeric: false,
    disablePadding: false,
    label: 'Lot Description',
    sortable: true,
  },
  {
    id: 'cts',
    numeric: true,
    disablePadding: false,
    label: 'Weight (Carats)',
    sortable: true,
  },
  {
    id: 'WinBid',
    numeric: true,
    disablePadding: false,
    label: 'WINNING BIDS',
    sortable: true,
    subHeaders: [
      { id: 'Max_bid_value', label: 'Price per Carat (US$/ct.)', sortable: true, minWidth: 130 },
      { id: 'Max_lot_value', label: 'Total Lot Value (US$)', sortable: true, minWidth: 130 },
    ],
  },
  {
    id: 'SuggesetedMinBid',
    numeric: true,
    disablePadding: false,
    label: 'Minimum New Bid per Carat (US$/ct.)',
    sortable: false,
    minWidth: 150,
  },
  {
    id: 'MyBIds',
    numeric: false,
    disablePadding: false,
    label: 'MY BIDS',
    sortable: true,
    subHeaders: [
      { id: 'bid_value', label: 'Price per Carat (US$/ct.)', sortable: true, minWidth: 130 },
      { id: 'lot_value', label: 'Total Lot Value (US$)', sortable: true, minWidth: 130 },
    ],
  },
  {
    id: 'BidStatus',
    numeric: false,
    disablePadding: false,
    label: 'Bid Status',
    sortable: false,
    isFixed: true,
    minWidth: 110,
  },
  {
    id: 'TimeLeft',
    numeric: false,
    disablePadding: false,
    label: 'Time Left',
    sortable: false,
    minWidth: 150,
  },
];

const headPolishedCells: (HeadCell & { subHeaders?: { id: string; label: string; sortable: boolean; minWidth?: number }[] })[] = [
  {
    id: 'sr',
    numeric: false,
    disablePadding: true,
    label: 'Sr No.',
    sortable: true,
  },
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: true,
    label: 'Lot No',
    sortable: true,
  },
  {
    id: 'Shape',
    numeric: false,
    disablePadding: false,
    label: 'Shape',
    sortable: true,
  },
  {
    id: 'cts',
    numeric: true,
    disablePadding: false,
    label: 'Weight (Carats)',
    sortable: true,
  },
  {
    id: 'WinBid',
    numeric: true,
    disablePadding: false,
    label: 'WINNING BIDS',
    sortable: true,
    subHeaders: [
      { id: 'Max_bid_value', label: 'Price per Carat (US$/ct.)', sortable: true, minWidth: 130 },
      { id: 'Max_lot_value', label: 'Total Lot Value (US$)', sortable: true, minWidth: 130 },
    ],
  },
  {
    id: 'SuggesetedMinBid',
    numeric: true,
    disablePadding: false,
    label: 'Minimum New Bid per Carat (US$/ct.)',
    sortable: false,
    minWidth: 150,
  },
  {
    id: 'MyBIds',
    numeric: false,
    disablePadding: false,
    label: 'MY BIDS',
    sortable: true,
    subHeaders: [
      { id: 'bid_value', label: 'Price per Carat (US$/ct.)', sortable: true, minWidth: 130 },
      { id: 'lot_value', label: 'Total Lot Value (US$)', sortable: true, minWidth: 130 },
    ],
  },
  {
    id: 'BidStatus',
    numeric: false,
    disablePadding: false,
    label: 'Bid Status',
    sortable: false,
    isFixed: true,
    minWidth: 110,
  },
  {
    id: 'TimeLeft',
    numeric: false,
    disablePadding: false,
    label: 'Time Left',
    sortable: false,
    minWidth: 150,
  },
];

const AuctionRoomBidderTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  eventCategory,
}: EnhancedTableHeadProps & { eventCategory: number | null }) => {
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);
  const theme = useTheme();
  const upMD = useMediaQuery(theme.breakpoints.up('md'));
  const baseHeaders = eventCategory === 1 ? headRoughCells : headPolishedCells;

  return (
    <TableHead>
      <TableRow>
        {baseHeaders.map((headCell) =>
          headCell.subHeaders ? (
            <TableCell key={headCell.id} align="center" padding="normal" colSpan={headCell.subHeaders.length} sx={{ position: 'sticky' }}>
              {headCell.label}
            </TableCell>
          ) : (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              rowSpan={2}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{
                minWidth: headCell.minWidth || 0,
                ...(headCell.isFixed &&
                  upMD && {
                    position: 'sticky !important',
                    right: `${headCell.fixedRight || 0}px !important`,
                    backgroundColor: '#F8F9FA',
                    zIndex: 10,
                    minWidth: '100px !important',
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
        {baseHeaders
          .filter((cell) => cell.subHeaders)
          .flatMap((cell) =>
            cell.subHeaders!.map((sub, index) => (
              <TableCell key={`${cell.id}-sub-${index}`} align="left" padding="normal" sortDirection={orderBy === sub.id ? order : false}>
                {sub.sortable ? (
                  <TableSortLabel
                    active={orderBy === sub.id}
                    direction={orderBy === sub.id ? order : 'asc'}
                    onClick={createSortHandler(sub.id)}
                    sx={{ minWidth: sub.minWidth || 0 }}
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

export default AuctionRoomBidderTableHeader;
