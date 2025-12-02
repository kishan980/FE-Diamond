import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { SyntheticEvent } from 'react';
import { visuallyHidden } from '@mui/utils';
import { ArrangementOrder, HeadCell } from 'types/table';

type RenderHeadCellParams = {
  headCell: HeadCell;
  order: ArrangementOrder;
  orderBy?: string;
  onRequestSort: (e: SyntheticEvent, p: string) => void;
};

export const renderHeadCell = ({ headCell, order, orderBy, onRequestSort }: RenderHeadCellParams) => {
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  const { id, label, numeric, disablePadding, sortable, fixedWith, isFixed } = headCell;
  return (
    <TableCell
      key={id}
      align={id === 'Options' ? 'center' : numeric ? 'right' : 'left'}
      padding={disablePadding ? 'none' : 'normal'}
      sortDirection={orderBy === id ? order : false}
      width={fixedWith}
      sx={{
        position: 'sticky !important',
        ...(isFixed && {
          right: 0,
          backgroundColor: '#F8F9FA',
          zIndex: 10,
          minWidth: 150,
        }),
      }}
    >
      {sortable ? (
        <TableSortLabel active={orderBy === id} direction={orderBy === id ? order : 'asc'} onClick={createSortHandler(id)}>
          {label}
          {orderBy === id ? (
            <Box component="span" sx={visuallyHidden}>
              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          ) : null}
        </TableSortLabel>
      ) : (
        label
      )}
    </TableCell>
  );
};
