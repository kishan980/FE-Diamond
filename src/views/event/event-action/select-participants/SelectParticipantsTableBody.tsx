'use client';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TickIcon from 'components/UIComponent/IconButtons/TickButton';
import CloseIcon from 'components/UIComponent/IconButtons/CloseButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { SelectParticipantsData } from 'services/event/event-action/select-participants/type';
import { getDescComparator, stableSort } from 'utils/react-table';
import { SelectParticipantsTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellEllipsis, renderTableCellLink } from 'utils/renderTableCell';
import { formatDate } from 'utils/format-date';
import { StickyColCell } from 'views/common.styled';
import { formatNumber } from 'utils/formatPercentage';

const SelectParticipantsTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  eventCategoryId,
  handleClick,
  isSelected,
}: SelectParticipantsTableBodyProps<SelectParticipantsData>) => {
  const renderRow = (row: SelectParticipantsData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.EntityID);

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        selected={isItemSelected}
        tabIndex={-1}
        key={row.EntityID}
        className="hover-row"
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={() => handleClick(row.EntityID ?? '', row.EmailID ?? '', row.emailID2 ?? '')}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
        {renderTableCellLink({
          content: row?.CompanyName,
          redirectUrl: `${eventCategoryId === 1 ? `/account/rough-bidders/upsert-rough-bidders/${row.EntityID}` : `/account/polished-bidders/upsert-polished-bidders/${row.EntityID}`}`,
        })}
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
        <StickyColCell width="1%" align="center" fixRight={0} fixWidth={100}>
          {row?.st === 1 ? <TickIcon /> : <CloseIcon />}
        </StickyColCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={14} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={14} padding />
      )}
    </TableBody>
  );
};

export default SelectParticipantsTableBody;
