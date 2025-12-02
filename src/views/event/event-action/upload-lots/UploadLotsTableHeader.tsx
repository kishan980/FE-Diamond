'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import { useMemo } from 'react';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';
import { UPLOAD_LOTS_POLISHED_HEAD_CELLS, UPLOAD_LOTS_ROUGH_HEAD_CELLS } from 'constants/tableHeadCells';

const UploadLotsTableHeader = ({
  order,
  orderBy,
  onSelectAllClick,
  numSelected,
  rowCount,
  eventCategoryID,
}: EnhancedTableHeadProps & { eventCategoryID: number | null }) => {
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  const headerCells = useMemo<HeadCell[]>(
    () => (eventCategoryID === 1 ? UPLOAD_LOTS_ROUGH_HEAD_CELLS : UPLOAD_LOTS_POLISHED_HEAD_CELLS),
    [eventCategoryID]
  );
  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ position: 'sticky !important' }}>
          <Checkbox
            checked={Boolean(rowCount) && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-labelledby': 'select all' }}
            sx={{ p: '5px' }}
          />
        </TableCell>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.fixedWith}
            sx={{
              position: 'sticky !important',
              minWidth: headCell.minWidth || 0,
              ...(headCell.isFixed &&
                isMediumUp && {
                  right: `${headCell.fixedRight || 0}px !important`,
                  backgroundColor: '#F8F9FA',
                  zIndex: 10,
                  minWidth: '150px !important',
                }),
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default UploadLotsTableHeader;
