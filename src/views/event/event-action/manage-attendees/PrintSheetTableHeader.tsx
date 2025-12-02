'use client';
import { ChangeEvent, SyntheticEvent, useCallback, useMemo } from 'react';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import { EnhancedTableHeadProps } from 'types/table';
import { PRINTSHEET_POLISHED_HEAD_CELLS, PRINTSHEET_ROUGH_HEAD_CELLS } from 'constants/tableHeadCells';

const PrintSheetTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  onSelectAllClick,
  numSelected,
  rowCount,
  eventCategoryId,
}: EnhancedTableHeadProps & { eventCategoryId: number | null }) => {
  const headerCells = useMemo(
    () => (eventCategoryId === 1 ? PRINTSHEET_ROUGH_HEAD_CELLS : PRINTSHEET_POLISHED_HEAD_CELLS),
    [eventCategoryId]
  );

  const createSortHandler = useCallback(
    (property: string) => (event: SyntheticEvent) => {
      onRequestSort(event, property);
    },
    [onRequestSort]
  );

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (onSelectAllClick) onSelectAllClick(event);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ position: 'sticky !important' }} className="print-hidden-column">
          <Checkbox
            checked={Boolean(rowCount) && numSelected === rowCount}
            onChange={handleSelectAllClick}
            inputProps={{ 'aria-labelledby': 'select all' }}
          />
        </TableCell>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ position: 'sticky !important' }}
            className={headCell.id === 'Options' ? 'print-hidden-column' : ''}
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

export default PrintSheetTableHeader;
