'use client';
import { ChangeEvent, SyntheticEvent } from 'react';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import { EnhancedTableHeadProps } from 'types/table';
import { UPLOAD_PAPER_BIDS_POLISHED_HEAD_CELLS, UPLOAD_PAPER_BIDS_ROUGH_HEAD_CELLS } from 'constants/tableHeadCells';

const UploadPaperBidsTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  onSelectAllClick,
  numSelected,
  rowCount,
  eventCategoryId,
}: EnhancedTableHeadProps & {
  eventCategoryId: number;
}) => {
  const headerCells = eventCategoryId === 1 ? UPLOAD_PAPER_BIDS_ROUGH_HEAD_CELLS : UPLOAD_PAPER_BIDS_POLISHED_HEAD_CELLS;
  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

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
            sx={{ position: 'sticky !important', minWidth: headCell.minWidth || 0 }}
            className={headCell.id === 'Options' ? 'print-hidden-column' : ''}
            width={headCell.fixedWith}
          >
            {headCell.sortable && headCell.sortable ? (
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

export default UploadPaperBidsTableHeader;
