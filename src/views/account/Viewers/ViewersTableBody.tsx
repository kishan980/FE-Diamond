'use client';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { ViewersData } from 'services/account/viewers/type';
import { ViewersTableBodyProps } from 'types/table';
import { getComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';

const ViewersTableBody = ({ data, page, order, orderBy, loading, rowsPerPage, onDeleteClick }: ViewersTableBodyProps<ViewersData>) => {
  const renderRow = (row: ViewersData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.entityID} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.seqno, align: 'right' })}
      {renderTableCellEllipsis({ content: row?.co_name })}
      {renderTableCellEllipsis({ content: row?.ContactPerson })}
      {renderTableCell({ content: row?.co_country })}
      {renderTableCellEllipsis({ content: row?.telephone })}
      {renderTableCellEllipsis({
        content: (
          <Link href={`mailto:${row?.emailID1}`} style={{ color: '#1976d2' }}>
            {row?.emailID1}
          </Link>
        ),
      })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150} sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledLeftAlignedIconGroup>
          <Link href={`/account/viewers/upsert-viewers/${row.entityID}`}>
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

export default ViewersTableBody;
