'use client';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import { memo } from 'react';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { renderTableCell } from 'utils/renderTableCell';
import { LegalDocumentData } from 'services/parameter/legalDocument/type';
import { getComparator, stableSort } from 'utils/react-table';
import { LegalDocumentTableBodyProps } from 'types/table';
import { EVENT_TYPE } from 'constants/event.constants';
import StatusChip from 'components/UIComponent/StatusChip';

const LegalDocumentTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  onDeleteClick,
}: LegalDocumentTableBodyProps<LegalDocumentData>) => {
  const renderRow = (row: LegalDocumentData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.DocTitle })}
      {renderTableCell({ content: row?.docDescription })}
      <TableCell component="th" align="left">
        <StatusChip label={row.EventCategory} color={row.EventCategory === EVENT_TYPE.ROUGH ? 'success' : 'primary'} />
      </TableCell>
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledLeftAlignedIconGroup sx={{ justifyContent: 'center' }}>
          <Link href={`/master-setup/legal-document/upsert-legal-document/${row.SeqNo}`}>
            <EditIconButton title="Edit" />
          </Link>
          <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.SeqNo ?? '')} />
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={6} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={6} padding />
      )}
    </TableBody>
  );
};

export default memo(LegalDocumentTableBody);
