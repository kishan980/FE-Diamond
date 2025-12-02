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
    id: 'ranks',
    numeric: false,
    disablePadding: false,
    label: 'Lot No',
    sortable: true,
    fixedWith: '1%',
  },
  {
    id: 'co_name',
    numeric: false,
    disablePadding: false,
    label: 'Bidding Company',
    sortable: true,
    fixedWith: '1%',
  },
  {
    id: 'bid_value',
    numeric: true,
    disablePadding: false,
    label: 'Bid Value per Carat (US$)',
    sortable: true,
    minWidth: 150,
  },
  {
    id: 'lot_value',
    numeric: true,
    disablePadding: false,
    label: 'Bid Value per Lot (US$)',
    sortable: true,
    minWidth: 130,
  },
  {
    id: 'diff',
    numeric: true,
    disablePadding: false,
    label: 'Different against Reserve Price',
    sortable: true,
    minWidth: 170,
  },
  {
    id: 'InsTimeStamp',
    numeric: false,
    disablePadding: false,
    label: 'Bidding Time',
    sortable: true,
  },
];

const LotOverviewDetailsTableHeader = ({
  showFinalStatusCell,
  order,
  orderBy,
  onRequestSort,
}: EnhancedTableHeadProps & { showFinalStatusCell: boolean }) => {
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.fixedWith}
            sx={{
              position: 'sticky !important',
              minWidth: headCell.minWidth || 0,
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

        {showFinalStatusCell && (
          <TableCell align="left" width="1%">
            Actions
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
};

export default LotOverviewDetailsTableHeader;
