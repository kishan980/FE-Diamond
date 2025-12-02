'use client';
import { ChangeEvent, SyntheticEvent, useMemo } from 'react';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';

const headPolishedCells: HeadCell[] = [
  { id: 'stockNo', numeric: false, disablePadding: false, label: 'Lot Number', sortable: true, fixedWith: '1%' },
  { id: 'SalesType', numeric: false, disablePadding: false, label: 'Type of Sale', sortable: true },
  { id: 'Shape', numeric: false, disablePadding: false, label: 'Shape', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight(Carats)', sortable: true },
  { id: 'rate', numeric: true, disablePadding: false, label: 'Reserve Price (US$/ct)', sortable: true },
  { id: 'MinesName', numeric: false, disablePadding: false, label: 'Mines', sortable: true },
  { id: 'PriceperCarats', numeric: false, disablePadding: false, label: 'Price per Carats(US$/ct.)', sortable: false },
  { id: 'TotalLotValue', numeric: false, disablePadding: false, label: 'Total Lot Value(US$)', sortable: false },
  { id: 'LotStatus', numeric: false, disablePadding: false, label: 'Bid Status', sortable: false },
  { id: 'Options', numeric: false, disablePadding: true, label: 'Image/Video', sortable: false, fixedWith: '1%' },
];

const headRoughCells: HeadCell[] = [
  { id: 'stockNo', numeric: false, disablePadding: false, label: 'Lot Number', sortable: true, fixedWith: '1%' },
  { id: 'SalesType', numeric: false, disablePadding: false, label: 'Type of Sale', sortable: true },
  { id: 'Size', numeric: false, disablePadding: false, label: 'Size Range', sortable: true },
  { id: 'stockDesc', numeric: false, disablePadding: false, label: 'Lot Description', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight(Carats)', sortable: true },
  { id: 'rate', numeric: true, disablePadding: false, label: 'Reserve Price (US$/ct)', sortable: true },
  { id: 'MinesName', numeric: false, disablePadding: false, label: 'Mines', sortable: true },
  { id: 'PriceperCarats', numeric: false, disablePadding: false, label: 'Price per Carats(US$/ct.)', sortable: false },
  { id: 'TotalLotValue', numeric: false, disablePadding: false, label: 'Total Lot Value(US$)', sortable: false },
  { id: 'LotStatus', numeric: false, disablePadding: false, label: 'Bid Status', sortable: false },
  { id: 'Options', numeric: false, disablePadding: true, label: 'Image/Video', sortable: false, fixedWith: '1%' },
];

const SubmittedBidsTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  onSelectAllClick,
  numSelected,
  rowCount,
  eventCategory,
  eventTenderData,
  remainingTime,
}: EnhancedTableHeadProps & {
  eventCategory: number | null;
  eventTenderData: GetViewParticipateData[];
  remainingTime: string | null;
}) => {
  const [firstEvent] = eventTenderData;
  const shouldShowSalesType = useMemo(() => firstEvent?.EventType === 'Mixed', [firstEvent]);

  const reservePrice = firstEvent?.ShowReservePrice;
  const shouldShowLotStatus =
    (eventTenderData[0]?.EventType === 'Auction' || eventTenderData[0]?.EventType === 'Mixed') &&
    (!remainingTime || remainingTime === 'Tender & pre-auction submission period is closed.' || remainingTime === 'Closed');

  const baseHeaders = useMemo(() => (eventCategory === 1 ? headRoughCells : headPolishedCells), [eventCategory]);

  const headerCells = useMemo(
    () =>
      baseHeaders.filter(({ id }) => {
        if (id === 'SalesType' && !shouldShowSalesType) return false;
        if (id === 'LotStatus' && !shouldShowLotStatus) return false;
        if (id === 'rate' && !reservePrice) return false;
        return true;
      }),
    [baseHeaders, shouldShowSalesType, shouldShowLotStatus, reservePrice]
  );

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

export default SubmittedBidsTableHeader;
