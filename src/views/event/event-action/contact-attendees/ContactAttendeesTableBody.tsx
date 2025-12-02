'use client';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';
import { ContactAttendeesTableBodyProps } from 'types/table';
import { ContactAttendeesData } from 'services/event/event-action/contact-attendees/type';
import { getComparator, stableSort } from 'utils/react-table';

const ContactAttendeesTableBody = ({
  data,
  page,
  loading,
  rowsPerPage,
  order,
  orderBy,
  isSelected,
  handleClick,
}: ContactAttendeesTableBodyProps<ContactAttendeesData>) => {
  const renderRow = (row: ContactAttendeesData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.SeqNo);

    return (
      <TableRow hover role="checkbox" aria-checked={isItemSelected} selected={isItemSelected} tabIndex={-1} key={row?.SeqNo}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={() => handleClick(row?.SeqNo ?? '', row?.emailID1 ?? '', row?.emailID2 ?? '')}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
        {renderTableCellEllipsis({ content: row?.co_name })}
        {renderTableCellEllipsis({ content: row?.contactPerson })}
        {renderTableCell({ content: row?.PhoneNO })}
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
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={7} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={7} padding />
      )}
    </TableBody>
  );
};

export default ContactAttendeesTableBody;
