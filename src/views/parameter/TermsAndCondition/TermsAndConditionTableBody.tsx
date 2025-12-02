'use client';
import { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import { StyledRightAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { renderTableCell } from 'utils/renderTableCell';
import { TermsAndConditionData } from 'services/parameter/termsAndCondition/type';
import { getComparator, stableSort } from 'utils/react-table';
import { TermsAndConditionTableBodyProps } from 'types/table';
import PdfButton from 'components/UIComponent/IconButtons/PdfButton';

const TermsAndConditionTableBody = ({
  data,
  page,
  order,
  orderBy,
  rowsPerPage,
  onDeleteClick,
  loading,
  onViewPDFClick,
}: TermsAndConditionTableBodyProps<TermsAndConditionData>) => {
  const renderRow = (row: TermsAndConditionData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.SeqNo, width: '100px', align: 'right' })}
      {renderTableCell({ content: row?.Title })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledRightAlignedIconGroup>
          <Link href={`/master-setup/term-and-condition/upsert-term-and-condition/${row?.SeqNo}`}>
            <EditIconButton title="Edit" />
          </Link>
          <PdfButton title="View Pdf" onClick={() => onViewPDFClick(row.Description ?? '')} />
          <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.SeqNo ?? '')} />
        </StyledRightAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={4} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={4} padding />
      )}
    </TableBody>
  );
};

export default memo(TermsAndConditionTableBody);
