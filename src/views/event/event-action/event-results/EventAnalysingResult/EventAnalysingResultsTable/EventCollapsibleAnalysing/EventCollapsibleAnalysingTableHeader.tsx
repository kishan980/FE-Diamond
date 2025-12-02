'use client';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableHeadProps } from 'types/table';
import { HeadCell } from 'types/table';

const headPolishedCells: HeadCell[] = [
  {
    id: 'sr',
    numeric: false,
    disablePadding: false,
    label: '',
    sortable: true,
    fixedWith: '1%',
  },
  {
    id: 'stockNo',
    numeric: false,
    disablePadding: false,
    label: 'Lot No',
    sortable: true,
    fixedWith: '1%',
  },
  {
    id: 'Shape',
    numeric: false,
    disablePadding: false,
    label: 'Shape',
    sortable: true,
  },
  {
    id: 'colour',
    numeric: false,
    disablePadding: false,
    label: 'Colour',
    sortable: true,
  },
  {
    id: 'Clarity',
    numeric: false,
    disablePadding: false,
    label: 'Clarity',
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
    label: 'Weight (Carats)',
    sortable: true,
  },
  {
    id: 'rate',
    numeric: true,
    disablePadding: false,
    label: 'Reserve Price (US$)',
    sortable: true,
    minWidth: 130,
  },
];

const headRoughCells: HeadCell[] = [
  {
    id: 'sr',
    numeric: false,
    disablePadding: false,
    label: '',
    sortable: true,
    fixedWith: '1%',
  },
  {
    id: 'stockNo',
    numeric: true,
    disablePadding: false,
    label: 'Lot No',
    sortable: true,
    fixedWith: '1%',
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
    label: 'Weight (Carats)',
    sortable: true,
  },
  {
    id: 'rate',
    numeric: true,
    disablePadding: false,
    label: 'Reserve Price (US$)',
    sortable: true,
    minWidth: 130,
  },
];

const EventCollapsibleAnalysingTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  eventCategoryID,
}: EnhancedTableHeadProps & {
  eventCategoryID: number | null;
}) => {
  const headerCells = eventCategoryID === 1 ? headRoughCells : headPolishedCells;

  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'Options' ? 'center' : headCell.numeric ? 'right' : 'left'}
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
      </TableRow>
    </TableHead>
  );
};

export default EventCollapsibleAnalysingTableHeader;
