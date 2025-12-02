'use client';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { BidderPerformanceData } from 'services/archives/bidder-performance-details/type';
import { getComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellFixed } from 'utils/renderTableCell';
import { BiddersPerformanceDetailsTableBodyProps } from 'types/table';

const BiddersPerformanceDetailsTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  entityType,
}: BiddersPerformanceDetailsTableBodyProps<BidderPerformanceData>) => {
  const renderRow = (row: BidderPerformanceData, index: number) => (
    <TableRow hover tabIndex={-1} key={index}>
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px' })}
      {renderTableCell({ content: row?.startDate })}
      {renderTableCell({ content: row?.co_name })}
      {renderTableCell({ content: row?.contactPerson })}
      {renderTableCell({ content: row?.scompnay })}
      {renderTableCell({ content: row?.stockNo })}
      {entityType === 'Polished' && renderTableCell({ content: row?.Shape })}
      {entityType === 'Polished' && renderTableCell({ content: row?.Colour })}
      {entityType === 'Polished' && renderTableCell({ content: row?.Clarity })}
      {entityType === 'Rough' && renderTableCell({ content: row?.Size })}
      {entityType === 'Rough' &&
        renderTableCell({
          content:
            row?.stockDesc?.length > 20 ? (
              <Tooltip title={row?.stockDesc} arrow>
                <span>{row?.stockDesc.substring(0, 20)}...</span>
              </Tooltip>
            ) : (
              row?.stockDesc
            ),
        })}

      {renderTableCell({ content: row?.pcs })}
      {renderTableCellFixed({
        content: row?.rate,
        format: (value) => Number(value).toFixed(2),
      })}
      {renderTableCellFixed({
        content: row?.cts,
        format: (value) => Number(value).toFixed(2),
      })}
      {renderTableCellFixed({
        content: row?.bid_value,
        format: (value) => Number(value).toFixed(2),
      })}
      {renderTableCell({ content: row?.ranks })}
      {renderTableCell({ content: row?.noofbidder })}
      {renderTableCell({ content: row?.pvale })}
    </TableRow>
  );
  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={16} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={16} />
      )}
    </TableBody>
  );
};

export default BiddersPerformanceDetailsTableBody;
