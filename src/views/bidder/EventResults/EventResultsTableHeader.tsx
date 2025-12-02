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
    id: 'sr',
    numeric: true,
    disablePadding: true,
    label: 'No',
    sortable: false,
    fixedWith: '1%',
  },
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: false,
    label: 'Lot Number',
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
    id: 'pcs',
    numeric: true,
    disablePadding: false,
    label: 'Stone Count',
    sortable: true,
  },
  {
    id: 'cts',
    numeric: true,
    disablePadding: false,
    label: 'Weight(Carats)',
    sortable: true,
  },
  {
    id: 'tenderresult',
    numeric: true,
    disablePadding: false,
    label: 'Event Outcomes(US$/ct.)',
    sortable: true,
  },
  {
    id: 'tenderresultVal',
    numeric: true,
    disablePadding: false,
    label: 'Lot Value(US$)',
    sortable: true,
  },
];

const EventResultsTableHeader = ({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) => {
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
            sx={{ position: 'sticky !important' }}
            width={headCell.fixedWith}
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

export default EventResultsTableHeader;
