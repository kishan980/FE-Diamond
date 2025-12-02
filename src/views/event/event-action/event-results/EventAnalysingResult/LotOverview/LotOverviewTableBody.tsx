'use client';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { GetLotsOverviewTable1 } from 'services/event/event-action/event-results/type';
import { renderTableCellEllipsis } from 'utils/renderTableCell';
import { LotOverviewTableBodyProps } from 'types/table';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { getComparator, stableSort } from 'utils/react-table';

const LotOverviewTableBody = ({
  data,
  page,
  order,
  orderBy,
  rowsPerPage,
  loading,
  eventCategoryID,
}: LotOverviewTableBodyProps<GetLotsOverviewTable1> & { eventCategoryID: number }) => {
  const renderRow = (row: GetLotsOverviewTable1, index: number) => (
    <TableRow hover tabIndex={-1} key={index}>
      {renderTableCellEllipsis({ content: row?.stockNo })}
      {eventCategoryID === 1 && renderTableCellEllipsis({ content: row?.SalesType })}
      {eventCategoryID === 1 && renderTableCellEllipsis({ content: row?.Size })}
      {eventCategoryID === 1 &&
        renderTableCellEllipsis({
          content:
            row?.stockDesc?.length > 20 ? (
              <Tooltip title={row.stockDesc} arrow>
                <span>{row.stockDesc.substring(0, 20)}...</span>
              </Tooltip>
            ) : (
              row?.stockDesc || '-'
            ),
        })}
      {eventCategoryID === 2 && renderTableCellEllipsis({ content: row?.Shape })}
      {eventCategoryID === 2 && renderTableCellEllipsis({ content: row?.Colour })}
      {eventCategoryID === 2 && renderTableCellEllipsis({ content: row?.Clarity })}
      {renderTableCellEllipsis({ content: row?.pcs, align: 'right' })}
      {renderTableCellEllipsis({ content: row?.cts, align: 'right' })}
      {renderTableCellEllipsis({ content: row?.rate, align: 'right' })}
      <TableCell>
        {row?.marketprice !== null ? (row.marketprice > 0 ? `+${row.marketprice}` : row.marketprice < 0 ? row.varianceprice : 0) : 'N.A.'}
      </TableCell>
      <TableCell>
        {row?.varianceprice !== null
          ? row.varianceprice > 0
            ? `+${row.varianceprice}%`
            : row.varianceprice < 0
              ? `${row.varianceprice}%`
              : '0%'
          : 'N.A.'}
      </TableCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={9} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={9} padding />
      )}
    </TableBody>
  );
};

export default LotOverviewTableBody;
