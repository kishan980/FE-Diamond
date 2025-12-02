'use client';
import { memo } from 'react';
import Link from 'next/link';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import StatusChip from 'components/UIComponent/StatusChip';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { StickyColCell } from 'views/common.styled';
import { AccessData } from 'services/access/types';
import { AccessTableBodyProps } from 'types/table';
import { getComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';

const AccessTableBody = ({
  data,
  order,
  orderBy,
  page,
  loading,
  rowsPerPage,
  isSelected,
  handleClick,
}: AccessTableBodyProps<AccessData>) => {
  const renderRow = (row: AccessData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.EntityID);

    return (
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        aria-checked={isItemSelected}
        selected={isItemSelected}
        key={row?.EntityID}
        className="hover-row"
      >
        <TableCell padding="checkbox">
          <Checkbox checked={isItemSelected} onClick={() => handleClick(row.EntityID ?? '')} inputProps={{ 'aria-labelledby': labelId }} />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
        {renderTableCellEllipsis({ content: row?.CompanyName })}
        {renderTableCell({ content: row?.ContactPerson })}
        {renderTableCellEllipsis({ content: row?.Contact })}
        {renderTableCellEllipsis({
          content: (
            <Link href={`mailto:${row?.EmailID}`} style={{ color: '#1976d2' }}>
              {row?.EmailID}
            </Link>
          ),
        })}
        {renderTableCell({ content: row?.EntityType })}
        <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
          {row?.IsActive ? <StatusChip color="error" label="Deactive" /> : <StatusChip color="success" label="Active" />}
        </StickyColCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={8} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={8} />
      )}
    </TableBody>
  );
};

export default memo(AccessTableBody);
