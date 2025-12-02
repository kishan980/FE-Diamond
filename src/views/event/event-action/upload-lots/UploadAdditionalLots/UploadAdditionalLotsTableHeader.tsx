'use client';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import { EnhancedTableHeadProps, HeadCell } from 'types/table';

const headPolishedCells: HeadCell[] = [
  {
    id: 'LotNo',
    numeric: false,
    disablePadding: false,
    label: 'Lot No',
    fixedWith: '1%',
  },
  {
    id: 'Shape',
    numeric: false,
    disablePadding: false,
    label: 'Shape',
  },
  {
    id: 'cts',
    numeric: false,
    disablePadding: false,
    label: 'Carats',
  },
  {
    id: 'Colour',
    numeric: false,
    disablePadding: false,
    label: 'Color',
  },
  {
    id: 'Clarity',
    numeric: false,
    disablePadding: false,
    label: 'Clarity',
  },
  {
    id: 'Cut',
    numeric: false,
    disablePadding: false,
    label: 'Cut',
  },
  {
    id: 'pcs',
    numeric: false,
    disablePadding: false,
    label: 'Stone Count',
  },
  {
    id: 'Comment',
    numeric: false,
    disablePadding: false,
    label: 'Comment',
  },
  {
    id: 'Rfor',
    numeric: false,
    disablePadding: false,
    label: 'Reserve Price (US$/ct.)',
    minWidth: 150,
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type of Sale',
    minWidth: 150,
  },
];

const headRoughCells: HeadCell[] = [
  {
    id: 'LotNo',
    numeric: false,
    disablePadding: false,
    label: 'Lot No',
    fixedWith: '1%',
  },
  {
    id: 'Size',
    numeric: false,
    disablePadding: false,
    label: 'Size Range',
  },
  {
    id: 'stockDesc',
    numeric: false,
    disablePadding: false,
    label: 'Lot Desc',
  },
  {
    id: 'SellerID',
    numeric: false,
    disablePadding: false,
    label: 'Seller',
  },
  {
    id: 'MineID',
    numeric: false,
    disablePadding: false,
    label: 'Mine',
  },
  {
    id: 'pcs',
    numeric: false,
    disablePadding: false,
    label: 'Stone Count',
  },
  {
    id: 'cts',
    numeric: false,
    disablePadding: false,
    label: 'Weight (Carats)',
  },
  {
    id: 'reserve',
    numeric: false,
    disablePadding: false,
    label: 'Reserve Price (US$/ct.)',
    minWidth: 150,
  },
  {
    id: 'totAmt',
    numeric: false,
    disablePadding: false,
    label: 'Type of Sale',
    minWidth: 130,
  },
];

const UploadAdditionalLotsTableHeader = ({
  order,
  orderBy,
  onSelectAllClick,
  numSelected,
  rowCount,
  eventCategoryID,
}: EnhancedTableHeadProps & {
  eventCategoryID: number | null;
}) => {
  const headerCells = eventCategoryID === 1 ? headRoughCells : headPolishedCells;

  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ position: 'sticky !important' }}>
          <Checkbox
            checked={Boolean(rowCount) && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-labelledby': 'select all' }}
            sx={{ padding: '5px' }}
          />
        </TableCell>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ position: 'sticky !important', minWidth: headCell.minWidth || 0 }}
            width={headCell.fixedWith}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default UploadAdditionalLotsTableHeader;
