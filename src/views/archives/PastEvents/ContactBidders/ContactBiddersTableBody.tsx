'use client';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { renderTableCell } from 'utils/renderTableCell';
import { GetContactBiddersData } from 'services/archives/pastEvents/types';
import { getDescComparator, stableSort } from 'utils/react-table';
import { ContactBiddersBodyProps } from 'types/table';

const ContactBiddersTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  isSelected,
  handleClick,
}: ContactBiddersBodyProps<GetContactBiddersData>) => {
  const renderRow = (row: GetContactBiddersData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row.SeqNo);

    return (
      <TableRow hover role="checkbox" tabIndex={-1} key={row?.SeqNo}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={() => handleClick(row.SeqNo ?? '', row.EmailID ?? '', row.emailID2 ?? '')}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px' })}
        {renderTableCell({ content: row?.co_name })}
        {renderTableCell({ content: row?.contactPerson })}
        {renderTableCell({ content: row?.PhoneNO })}
        {renderTableCell({
          content: row?.EmailID ? (
            <>
              <Link href={`mailto:${row?.EmailID}`} style={{ color: '#1976d2' }}>
                {row?.EmailID}
              </Link>
              <br />
              <Link href={`mailto:${row?.emailID2}`} style={{ color: '#1976d2' }}>
                {row?.emailID2 || ''}
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
        <LoadingTableRow colSpan={10} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={10} padding />
      )}
    </TableBody>
  );
};

export default ContactBiddersTableBody;
