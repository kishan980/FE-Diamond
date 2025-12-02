'use client';
import { memo } from 'react';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { renderTableCell } from 'utils/renderTableCell';
import { getDescComparator, stableSort } from 'utils/react-table';
import { EmailTemplateTableBodyProps } from 'types/table';
import { EmailTemplateData } from 'services/parameter/emailTemplate/type';

const EmailTemplatesTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  onDeleteClick,
}: EmailTemplateTableBodyProps<EmailTemplateData>) => {
  const renderRow = (row: EmailTemplateData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.EmailSubject })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={50}>
        <StyledLeftAlignedIconGroup>
          <Link href={`/master-setup/email-templates/upsert-email-templates/${row.SeqNo}`}>
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
        <LoadingTableRow colSpan={3} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={3} padding />
      )}
    </TableBody>
  );
};

export default memo(EmailTemplatesTableBody);
