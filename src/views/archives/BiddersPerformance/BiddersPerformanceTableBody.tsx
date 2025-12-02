'use client';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DocumentIconButton from 'components/UIComponent/IconButtons/DocumentButton';
import DownloadCSVXSButton from 'components/UIComponent/IconButtons/DownloadCSVButton/DownloadCSVXSButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { formatDate } from 'utils/format-date';
import { BidderPerformanceDetailsData } from 'services/archives/bidder-performance-details/type';
import { BidderPerformanceTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';
import { formatNumber } from 'utils/formatPercentage';
import { stableSort, getDescComparator } from 'utils/react-table';

const BiddersPerformanceTableBody = ({
  data,
  page,
  loading,
  order,
  orderBy,
  rowsPerPage,
  isDownloadAccess,
  entityType,
  onExcelClick,
}: BidderPerformanceTableBodyProps<BidderPerformanceDetailsData>) => {
  const renderRow = (row: BidderPerformanceDetailsData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCellEllipsis({ content: row?.co_name })}
      {renderTableCell({ content: row?.totalinvited, align: 'right' })}
      {renderTableCell({ content: row?.TotalEventsAttended, align: 'right' })}
      {renderTableCell({ content: row?.totalparticipate, align: 'right' })}
      {renderTableCell({ content: row?.totalbidplaced, align: 'right' })}
      {renderTableCell({ content: row?.topHighBid, align: 'right' })}
      {renderTableCell({ content: row?.totalwon, align: 'right' })}
      {renderTableCell({
        content: formatNumber(row?.totalwoncarat),
        align: 'right',
      })}
      {renderTableCell({
        content: formatNumber(row?.totalwoncaratprice),
        align: 'right',
      })}
      {renderTableCellEllipsis({ content: formatDate(row?.LastBidDate) })}
      {renderTableCellEllipsis({ content: formatDate(row?.LastPurchaseDate) })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledLeftAlignedIconGroup sx={{ justifyContent: 'center' }}>
          <Link
            href={
              entityType === 'Rough'
                ? `/history/roughbidders-performance/details?eventId=${row.entityID}&entityType=${entityType}`
                : `/history/polishedbidders-performance/details?eventId=${row.entityID}&entityType=${entityType}`
            }
          >
            <DocumentIconButton title="Details" />
          </Link>
          {isDownloadAccess && <DownloadCSVXSButton title="Export Bidders Performance" onClick={() => onExcelClick(row.entityID ?? '')} />}
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );
  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={13} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={13} padding />
      )}
    </TableBody>
  );
};

export default BiddersPerformanceTableBody;
