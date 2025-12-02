'use client';
import { ChangeEvent } from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { UploadButton } from 'components/UIComponent/UploadButton';
import { renderTableCellEllipsis } from 'utils/renderTableCell';
import { LegalTableBodyProps } from 'types/table';
import { getComparator, stableSort } from 'utils/react-table';
import { RoughBiddersDocumentList } from 'services/account/roughBidders/type';

const LegalDocumentTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  handleFileChange,
}: LegalTableBodyProps<RoughBiddersDocumentList>) => {
  const renderRow = (row: RoughBiddersDocumentList, index: number) => (
    <TableRow hover key={`${row?.seqno}-${index}`} tabIndex={-1}>
      {renderTableCellEllipsis({ content: row?.doctitle, width: '300px' })}
      {renderTableCellEllipsis({ content: row?.docDescription })}
      <TableCell width="1%" align="center">
        <UploadButton onChange={(event: ChangeEvent<HTMLInputElement>) => handleFileChange(row, event)} />
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
        <NoDataTableRow colSpan={10} />
      )}
    </TableBody>
  );
};

export default LegalDocumentTableBody;
