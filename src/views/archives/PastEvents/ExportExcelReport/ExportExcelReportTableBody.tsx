'use client';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Checkbox from '@mui/material/Checkbox';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { PastEventsData } from 'services/archives/pastEvents/types';
import { renderTableCell } from 'utils/renderTableCell';
import { getComparator, stableSort } from 'utils/react-table';
import { ExportExcelReportBodyProps } from 'types/table';
import { formatDate } from 'utils/format-date';

const ExportExcelReportTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  isSelected,
  handleClick,
}: ExportExcelReportBodyProps<PastEventsData>) => {
  const renderRow = (row: PastEventsData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.auTen_EvtId);

    return (
      <TableRow hover role="checkbox" aria-checked={isItemSelected} selected={isItemSelected} tabIndex={-1} key={row?.auTen_EvtId}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={() => handleClick(row.auTen_EvtId ?? '')}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px' })}
        {renderTableCell({ content: row?.EventID })}
        {renderTableCell({ content: formatDate(row?.startDate) })}
        {renderTableCell({ content: row?.SellingCompany })}
        {renderTableCell({ content: row?.EventCategory })}
      </TableRow>
    );
  };

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

export default ExportExcelReportTableBody;
