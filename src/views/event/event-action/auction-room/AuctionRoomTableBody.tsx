'use client';
import { useState } from 'react';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { ArrowDown, ArrowDown2, ArrowUp2, Star1 } from 'iconsax-react';
import { BidderCellContainer } from './AuctionRoom.styled';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { AuctionRoomTableBodyProps } from 'types/table';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { AuctionRoomLotData } from 'services/event/event-action/auction-room/type';
import { renderTableCell, renderTableCellClick, renderTableCellFixed } from 'utils/renderTableCell';
import { getDescComparator, stableSort } from 'utils/react-table';
import { UserStatusIndicator } from 'views/common.styled';
import { formatNumber } from 'utils/formatPercentage';

const AuctionRoomTableBody = ({
  data,
  page,
  order,
  orderBy,
  rowsPerPage,
  loading,
  auctionDurations,
  onlineUserIds,
  handleProfileDetailsReadClick,
}: AuctionRoomTableBodyProps<AuctionRoomLotData>) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleToggleRow = (index: number) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  const renderRow = (row: AuctionRoomLotData, index: number) => {
    const isExpanded = expandedRow === index;

    return (
      <>
        <TableRow hover key={index}>
          <TableCell>
            <IconButton onClick={() => handleToggleRow(index)} size="small">
              {isExpanded ? <ArrowUp2 /> : <ArrowDown2 />}
            </IconButton>
          </TableCell>
          {renderTableCell({ content: row.stockNo })}
          {renderTableCell({ content: row.Size })}
          {renderTableCell({ content: row.stockDesc })}
          {renderTableCellFixed({
            content: row.cts,
            format: (value) => Number(value).toFixed(2),
            align: 'right',
          })}
          {renderTableCellFixed({
            content: row.SuggesetedMinBid,
            format: (value) => Number(value).toFixed(2),
            align: 'right',
          })}
          {renderTableCell({
            content: formatNumber(row?.Max_bid_value),
            align: 'right',
          })}
          {renderTableCell({
            content: formatNumber(row?.Max_lot_value),
            align: 'right',
          })}
          {renderTableCell({ content: auctionDurations[row.SeqNo] || '', align: 'right' })}
          {renderTableCell({
            content:
              row.noOfBids === '' && row.bidscss === 'gvdraw'
                ? 'Draw!'
                : row.noOfBids === '' && row.bidscss === 'gvblanknobids'
                  ? ''
                  : row.noOfBids,
            align: 'right',
          })}
        </TableRow>

        {isExpanded &&
          row.bidders?.length > 0 &&
          row.bidders.map((bidder, i) => {
            const isOnline = onlineUserIds.includes(bidder?.refBuyerID_EntityMas ?? '');

            return (
              <TableRow key={`collapse-${index}-${i}`}>
                {[...Array(5)].map((_, idx) => (
                  <TableCell key={`empty-${idx}`} />
                ))}
                {renderTableCellClick({
                  content: (
                    <BidderCellContainer>
                      <span>{bidder.bidderName}</span>
                      <UserStatusIndicator active={isOnline} />
                    </BidderCellContainer>
                  ),
                  onClick: () => handleProfileDetailsReadClick(bidder?.refBuyerID_EntityMas),
                })}
                {renderTableCellFixed({
                  content: bidder.Max_bid_value,
                  format: (value) => Number(value).toFixed(2),
                  align: 'right',
                })}
                {renderTableCellFixed({
                  content: bidder.Max_lot_value,
                  format: (value) => Number(value).toFixed(2),
                  align: 'right',
                })}
                {renderTableCell({
                  content:
                    bidder.noOfBids === '' && bidder.bidscss === 'gvdraw' ? (
                      'Draw!'
                    ) : bidder.noOfBids === '1' && bidder.bidscss === 'gvwinner' ? (
                      <Star1 size={22} style={{ verticalAlign: 'middle', color: '#3c64d0' }} />
                    ) : bidder.noOfBids === '' && bidder.bidscss === 'gvsecondbidder' ? (
                      <ArrowDown size={22} style={{ verticalAlign: 'middle', color: '#d32f2f' }} />
                    ) : bidder.noOfBids === '' && bidder.bidscss === 'gvwinner' ? (
                      <Star1 size={22} style={{ verticalAlign: 'middle', color: '#3c64d0' }} />
                    ) : (
                      ''
                    ),
                  align: 'right',
                })}
                {renderTableCell({ content: bidder.noOfBids, align: 'right' })}
              </TableRow>
            );
          })}
      </>
    );
  };
  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={11} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={11} padding />
      )}
    </TableBody>
  );
};

export default AuctionRoomTableBody;
