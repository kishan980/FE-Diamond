'use client';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import { Repeat, TickSquare } from 'iconsax-react';
import { StyledTableCell, StyledTableRow, TenderHistoryTableContainer } from '../TenderBidsDetails/Dialog/TenderBidsDetailsDialog.styled';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { CANCEL_BIDDING_TABLE_HEADERS } from 'constants/cancelBiddingHeader.constants';
import { CancelWinningTableBodyProps } from 'types/table';
import { GetCancelBiddingData, BidsData, LotsData } from 'services/archives/pastEvents/types';
import { formatNumber } from 'utils/formatPercentage';

const isBidsData = (item: BidsData | LotsData): item is BidsData => {
  return (item as BidsData).bid_value !== undefined;
};

const CancelBiddingBidTable = ({
  data,
  handleReallocateBid,
  handleWithdrawBid,
  loading,
  handleProfileDetailsReadClick,
}: CancelWinningTableBodyProps<GetCancelBiddingData>) => (
  <TenderHistoryTableContainer sx={{ mt: 2.5 }} className="print-table-container">
    <Table sx={{ minWidth: 700 }} aria-label="canal winning table">
      <TableHead>
        <StyledTableRow>
          {CANCEL_BIDDING_TABLE_HEADERS?.map((header) => (
            <StyledTableCell
              key={header}
              align={
                [
                  'Bid Value per Carat(US$)',
                  'Bid Value per Lot (US$)',
                  'Difference against Reserve Price',
                  'Difference against Higher Bidder',
                ].includes(header)
                  ? 'right'
                  : 'left'
              }
              sx={
                header === 'Bid Value per Carat(US$)'
                  ? { minWidth: 120 }
                  : header === 'Bid Value per Lot (US$)'
                    ? { minWidth: 120 }
                    : header === 'Difference against Reserve Price'
                      ? { minWidth: 160 }
                      : header === 'Difference against Higher Bidder'
                        ? { minWidth: 160 }
                        : header === 'Cancel Winning Bid?'
                          ? { minWidth: 110 }
                          : undefined
              }
            >
              {header}
            </StyledTableCell>
          ))}
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading.isProgress || loading.isLoading ? (
          <LoadingTableRow colSpan={8} />
        ) : Array.isArray(data) && data.flat().some((item) => isBidsData(item)) ? (
          data.map((dataGroup: GetCancelBiddingData, outerIndex: number) => {
            if (Array.isArray(dataGroup)) {
              return dataGroup.map((item: BidsData | LotsData, innerIndex: number) => {
                if (isBidsData(item)) {
                  let bidDifference = '-';
                  if (innerIndex > 0) {
                    const previousItem = dataGroup[innerIndex - 1];
                    if (isBidsData(previousItem)) {
                      const previousBidValue = previousItem.lot_value || 0;
                      const currentBidValue = item.lot_value || 0;
                      bidDifference = (previousBidValue - currentBidValue).toFixed(2);
                    }
                  }
                  const buttonLabel = item?.FinalLotStatus === 'Withdrawn' ? 'Accepted' : 'Withdrawn';

                  return (
                    <StyledTableRow key={`${outerIndex}-${innerIndex}`}>
                      <StyledTableCell>{item?.ranks || '-'}</StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleProfileDetailsReadClick(item?.refBuyerID_EntityMas)}
                        sx={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: '#1976d2',
                        }}
                      >
                        {item?.co_name || '-'}
                      </StyledTableCell>
                      <StyledTableCell align="right">{formatNumber(item?.bid_value) || '-'}</StyledTableCell>
                      <StyledTableCell align="right">{formatNumber(item?.lot_value) || '-'}</StyledTableCell>
                      <StyledTableCell align="right">
                        {item?.diff !== undefined && item?.diff !== null && !isNaN(item.diff)
                          ? `${item.diff >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(item.diff)}%`
                          : '-'}
                      </StyledTableCell>
                      <StyledTableCell align="right">{innerIndex > 0 ? formatNumber(bidDifference) : '-'}</StyledTableCell>
                      <StyledTableCell>
                        {innerIndex === 1 && item?.FinalLotStatus !== 'Withdrawn' && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Repeat />}
                            sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
                            onClick={() => {
                              const [firstItem] = dataGroup;
                              if (isBidsData(firstItem)) {
                                handleReallocateBid(
                                  firstItem?.refEvtId_AuTenEvent,
                                  firstItem?.refSeqNo_EventStock,
                                  firstItem?.bid_value,
                                  firstItem?.refBuyerID_EntityMas
                                );
                              }
                            }}
                          >
                            Reallocate Lot
                          </Button>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {innerIndex === 0 && (
                          <Button
                            variant="contained"
                            type="submit"
                            size="small"
                            sx={{ whiteSpace: 'nowrap', height: 'fit-content' }}
                            onClick={() => handleWithdrawBid(buttonLabel, item?.refSeqNo_EventStock)}
                            startIcon={
                              item?.FinalLotStatus === 'Withdrawn' ? (
                                <TickSquare />
                              ) : (
                                <Box
                                  component="img"
                                  src="/assets/icons/withdrawal.png"
                                  width={18}
                                  height={18}
                                  sx={{
                                    filter: 'brightness(0) invert(1)',
                                  }}
                                />
                              )
                            }
                          >
                            {item?.FinalLotStatus === 'Withdrawn' ? 'Accept Bid' : 'Withdrawn'}
                          </Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                }
                return null;
              });
            }
            return null;
          })
        ) : (
          <StyledTableRow>
            <StyledTableCell colSpan={8} align="center">
              No data found
            </StyledTableCell>
          </StyledTableRow>
        )}
      </TableBody>
    </Table>
  </TenderHistoryTableContainer>
);

export default CancelBiddingBidTable;
