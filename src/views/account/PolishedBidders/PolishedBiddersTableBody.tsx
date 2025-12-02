'use client';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Link from 'next/link';
import { PolishedbiddersData } from 'services/account/polishedBidders/type';
import StatusChip from 'components/UIComponent/StatusChip';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import FolderIconButton from 'components/UIComponent/IconButtons/FolderButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { getComparator, stableSort } from 'utils/react-table';
import { PolishedBidderTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';

const PolishedBiddersTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  onDocumentClick,
  onDeleteClick,
}: PolishedBidderTableBodyProps<PolishedbiddersData>) => {
  const getStatusChip = (status: string) => {
    const statusMap = {
      Active: { color: 'success', label: 'Active' },
      Inactive: { color: 'error', label: 'Deactive' },
      Blacklisted: { color: 'info', label: 'BlackListed' },
    };

    if (status in statusMap) {
      const { color, label } = statusMap[status as keyof typeof statusMap];
      return <StatusChip color={color as any} label={label} />;
    }

    return <StatusChip color="default" label={status} />;
  };

  const renderRow = (row: PolishedbiddersData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.entityID} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.seqno, align: 'right' })}
      {renderTableCellEllipsis({ content: row?.co_name })}
      {renderTableCellEllipsis({ content: row?.ContactPerson })}
      {renderTableCell({ content: row?.co_country })}
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
          <Link href={`/account/polished-bidders/upsert-polished-bidders/${row.entityID}`}>
            <EditIconButton title="Edit" />
          </Link>
          <FolderIconButton title="Document" onClick={() => onDocumentClick(row.entityID, row.co_name ?? '')} />
          <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.entityID ?? '')} />
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={10} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={10} />
      )}
    </TableBody>
  );
};

export default PolishedBiddersTableBody;
