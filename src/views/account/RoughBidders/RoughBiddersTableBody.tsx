'use client';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Link from 'next/link';
import StatusChip from 'components/UIComponent/StatusChip';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import FolderIconButton from 'components/UIComponent/IconButtons/FolderButton';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { getComparator, stableSort } from 'utils/react-table';
import { RoughBiddersTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';
import { RoughbiddersData } from 'services/account/roughBidders/type';

const RoughBiddersTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  isSelected,
  handleClick,
  onDocumentClick,
  onDeleteClick,
}: RoughBiddersTableBodyProps<RoughbiddersData>) => {
  const getStatusChip = (status: string) => {
    const statusMap = {
      Active: { color: 'success', label: 'Active' },
      Inactive: { color: 'error', label: 'Deactive' },
      Blacklisted: { color: 'warning', label: 'Black Listed' },
    };

    if (status in statusMap) {
      const { color, label } = statusMap[status as keyof typeof statusMap];
      return <StatusChip color={color as any} label={label} />;
    }

    return <StatusChip color="default" label={status} />;
  };

  const renderRow = (row: RoughbiddersData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.entityID);

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        selected={isItemSelected}
        tabIndex={-1}
        key={row?.entityID}
        className="hover-row"
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={() => handleClick(row.entityID ?? '', row.emailID1 ?? '', row.emailID2 ?? '')}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
        {renderTableCell({ content: row?.seqno, align: 'right' })}
        {renderTableCellEllipsis({ content: row?.co_name })}
        {renderTableCellEllipsis({ content: row?.ContactPerson })}
        {renderTableCellEllipsis({ content: row?.co_country })}
        {renderTableCellEllipsis({
          content: row?.telephone ? (
            <>
              {row?.telephone}
              <br />
              {row?.contact || ''}
            </>
          ) : (
            row?.contact
          ),
        })}
        {renderTableCellEllipsis({
          content: row?.emailID1 ? (
            <>
              <Link href={`mailto:${row?.emailID1}`} style={{ color: '#1976d2' }}>
                {row?.emailID1}
              </Link>
              <br />
              <Link href={`mailto:${row?.emailID2}`} style={{ color: '#1976d2' }}>
                {row?.emailID2}
              </Link>
            </>
          ) : (
            <Link href={`mailto:${row?.emailID2}`} style={{ color: '#1976d2' }}>
              {row?.emailID2}
            </Link>
          ),
        })}
        {renderTableCellEllipsis({ content: row?.reqdocs })}
        <TableCell>{getStatusChip(row?.isActive ?? '')}</TableCell>
        <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
          <StyledLeftAlignedIconGroup>
            <Link href={`/account/rough-bidders/upsert-rough-bidders/${row.entityID}`}>
              <EditIconButton title="Edit" />
            </Link>
            <FolderIconButton title="Document" onClick={() => onDocumentClick(row.entityID, row.co_name ?? '')} />
            <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.entityID ?? '')} />
          </StyledLeftAlignedIconGroup>
        </StickyColCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={11} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={11} padding />
      )}
    </TableBody>
  );
};

export default RoughBiddersTableBody;
