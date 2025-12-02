'use client';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import PasswordIconButton from 'components/UIComponent/IconButtons/PasswordCheckButton';
import DocumentIconButton from 'components/UIComponent/IconButtons/DocumentButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { getDescComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellEllipsis, renderTableCellFixed } from 'utils/renderTableCell';
import { TenderBidsDetailsData } from 'services/archives/pastEvents/types';
import { TenderBidsDetailsTableBodyProps } from 'types/table';
import { formatNumber } from 'utils/formatPercentage';

const TenderBidsDetailsTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  eventCategoryID,
  onDetailsClick,
  onModifyClick,
}: TenderBidsDetailsTableBodyProps<TenderBidsDetailsData>) => {
  const renderRow = (row: TenderBidsDetailsData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px' })}
      {eventCategoryID === 1 && renderTableCellEllipsis({ content: row?.stockNo })}
      {eventCategoryID === 1 && renderTableCell({ content: row?.Size })}
      {eventCategoryID === 1 &&
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
      {eventCategoryID === 2 && renderTableCell({ content: row?.Shape })}
      {eventCategoryID === 2 && renderTableCell({ content: row?.Colour })}
      {eventCategoryID === 2 && renderTableCell({ content: row?.Clarity })}
      {renderTableCell({ content: row?.pcs, align: 'right' })}
      {renderTableCellFixed({ content: formatNumber(row?.cts), align: 'right' })}
      {renderTableCellFixed({ content: formatNumber(row?.rate), align: 'right' })}
      {renderTableCell({ content: row?.NoOfBids, align: 'right' })}
      {renderTableCellFixed({ content: formatNumber(row?.WinnerAmt), align: 'right' })}
      {renderTableCellFixed({
        content: formatNumber(row?.lotsvalue),
        align: 'right',
      })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledLeftAlignedIconGroup sx={{ justifyContent: 'center' }}>
          <DocumentIconButton title="Details" onClick={() => onDetailsClick(row.SeqNo ?? '')} />
          <PasswordIconButton title="Modify Bid" onClick={() => onModifyClick(row.SeqNo ?? '')} />
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={12} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={12} padding />
      )}
    </TableBody>
  );
};

export default TenderBidsDetailsTableBody;
