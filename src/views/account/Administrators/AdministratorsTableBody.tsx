'use client';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import StatusChip from 'components/UIComponent/StatusChip';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { AdministratorsData } from 'services/account/administrators/type';
import { getComparator, stableSort } from 'utils/react-table';
import { AdministratorsTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';

const AdministratorsTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  isDownloadAccess,
  onDeleteClick,
}: AdministratorsTableBodyProps<AdministratorsData>) => {
  const renderRow = (row: AdministratorsData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.entityID} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.seqno, align: 'right' })}
      {renderTableCellEllipsis({ content: row?.ContactPerson })}
      {renderTableCellEllipsis({ content: row?.contact })}
      {renderTableCellEllipsis({
        content: (
          <Link href={`mailto:${row?.emailID1}`} style={{ color: '#1976d2' }}>
            {row?.emailID1}
          </Link>
        ),
      })}
      {isDownloadAccess &&
        renderTableCellEllipsis({
          content: row?.IsAccessArchives ? <StatusChip color="success" label="Active" /> : <StatusChip color="error" label="Deactive" />,
        })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledLeftAlignedIconGroup sx={{ justifyContent: 'center' }}>
          <Link href={`/account/administrators/upsert-administrators/${row.entityID}`}>
            <EditIconButton title="Edit" />
          </Link>
          <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.entityID ?? '')} />
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

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

export default AdministratorsTableBody;
