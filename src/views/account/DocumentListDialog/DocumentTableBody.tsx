'use client';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DeleteIconButton from '../../../components/UIComponent/IconButtons/DeleteButton';
import FolderIconButton from '../../../components/UIComponent/IconButtons/FolderButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { StyledLeftAlignedIconGroup } from 'views/common.styled';
import { DocumentTableBodyProps } from 'types/table';
import { getComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellClick, renderTableCellEllipsis } from 'utils/renderTableCell';
import { DocumentEntityWiseData } from 'services/account/roughBidders/type';

const DocumentTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  onSingleFileClick,
  onMoreMenuClick,
  onDeleteClick,
}: DocumentTableBodyProps<DocumentEntityWiseData>) => {
  const renderRow = (row: DocumentEntityWiseData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo}>
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCellEllipsis({ content: row?.Docname })}
      {renderTableCellClick({ content: row?.DocPath, onClick: () => onMoreMenuClick(row.DocPath ?? '') })}
      <TableCell align="center" width="1%">
        <StyledLeftAlignedIconGroup>
          <FolderIconButton title="Upload Document" onClick={() => onSingleFileClick(row.SeqNo, row?.DocPath ?? '')} />
          <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.SeqNo ?? '')} />
        </StyledLeftAlignedIconGroup>
      </TableCell>
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
        <NoDataTableRow colSpan={10} padding />
      )}
    </TableBody>
  );
};

export default DocumentTableBody;
