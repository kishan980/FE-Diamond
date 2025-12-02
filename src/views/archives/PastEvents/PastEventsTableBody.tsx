'use client';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import ContactIconButton from 'components/UIComponent/IconButtons/ContactButton';
import DocumentIconButton from 'components/UIComponent/IconButtons/DocumentButton';
import DownloadCSVXSButton from 'components/UIComponent/IconButtons/DownloadCSVButton/DownloadCSVXSButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { formatDate } from 'utils/format-date';
import { PastEventSeachData } from 'services/archives/pastEvents/types';
import { getComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';
import { PastEventsTableBodyProps } from 'types/table';
import { EVENT_TYPE } from 'constants/event.constants';
import StatusChip from 'components/UIComponent/StatusChip';
import { formatNumber } from 'utils/formatPercentage';

const PastEventsTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  isDownloadAccess,
  onExcelClick,
  isPastEventsInitialLoading,
}: PastEventsTableBodyProps<PastEventSeachData>) => {
  const renderRow = (row: PastEventSeachData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.auTen_EvtId} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCellEllipsis({ content: row?.auTen_EvtId ? `Event ${row?.auTen_EvtId}` : '-' })}
      {renderTableCellEllipsis({ content: row?.co_name })}
      <TableCell component="th" align="left">
        <StatusChip label={row?.EventCatType} color={row?.EventCatType === EVENT_TYPE.ROUGH ? 'success' : 'primary'} />
      </TableCell>
      {renderTableCellEllipsis({ content: formatDate(row?.EndDate) })}
      {renderTableCell({ content: row?.Attendance, align: 'right' })}
      {renderTableCell({ content: row?.Participant, align: 'right' })}
      {renderTableCell({ content: row?.Totallots, align: 'right' })}
      {renderTableCell({
        content: formatNumber(row?.TotalCts),
        align: 'right',
      })}
      {renderTableCell({ content: row?.lotssold, align: 'right' })}
      {renderTableCell({
        content: formatNumber(row?.caratsold),
        align: 'right',
      })}
      {renderTableCell({
        content: formatNumber(row?.valuesold),
        align: 'right',
      })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledLeftAlignedIconGroup>
          <Link href={`/history/past-events/contact-bidders?eventId=${row.auTen_EvtId}&eventCategoryID=${row.EventCategory}`}>
            <ContactIconButton title="Contact Bidders" />
          </Link>
          <Link href={`/history/past-events/tenderbids-details?eventId=${row.auTen_EvtId}&eventCategoryID=${row.EventCategory}`}>
            <DocumentIconButton title="Details" />
          </Link>
          {isDownloadAccess && (
            <DownloadCSVXSButton title="Bid Statistics Report" onClick={() => onExcelClick(row.auTen_EvtId, row.EventCategory)} />
          )}
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading || isPastEventsInitialLoading ? (
        <LoadingTableRow colSpan={13} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={13} />
      )}
    </TableBody>
  );
};

export default PastEventsTableBody;
