'use client';
import { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EnhancedTableHeadProps } from 'types/table';
import { TENDER_BIDS_POLISHED_HEAD_CELLS, TENDER_BIDS_ROUGH_HEAD_CELLS } from 'constants/tableHeadCells';

const TenderBidsDetailsTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  eventCategoryID,
}: EnhancedTableHeadProps & {
  eventCategoryID: number;
}) => {
  const theme = useTheme();
  const upMD = useMediaQuery(theme.breakpoints.up('md'));

  const headerCells = eventCategoryID === 1 ? TENDER_BIDS_ROUGH_HEAD_CELLS : TENDER_BIDS_POLISHED_HEAD_CELLS;
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
              ...(headCell.isFixed &&
                upMD && {
                  right: `${headCell.fixedRight || 0}px !important`,
                  backgroundColor: '#F8F9FA',
                  zIndex: 10,
                  minWidth: '150px !important',
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

export default TenderBidsDetailsTableHeader;
