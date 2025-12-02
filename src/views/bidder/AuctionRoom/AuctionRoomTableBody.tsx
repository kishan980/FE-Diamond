'use client';
import TableBody from '@mui/material/TableBody';
import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import { toast } from 'react-toastify';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { AuctionRoomBiderTableBodyProps } from 'types/table';
import { getDescComparator, stableSort } from 'utils/react-table';
import { AuctionRoomData, UpdateAuctionBidParams } from 'services/bidder/auction-room/type';
import { StyledRightAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { AuctionRoomServices } from 'services/bidder/auction-room/auctionRoom.services';
import ErrorMessageDialog from 'components/UIComponent/Dialogs/ErrorMessageDialog/ErrorMessageDialog';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';
import { formatNumber } from 'utils/formatPercentage';

const AuctionRoomBidderTableBody = ({
  data,
  page,
  order,
  orderBy,
  rowsPerPage,
  loading,
  entityID,
  eventCategory,
  remainingTime,
  eventId,
  auctionDurations,
  onUpdateRow,
}: AuctionRoomBiderTableBodyProps<AuctionRoomData>) => {
  const [editingSeqNo, setEditingSeqNo] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<number, Partial<AuctionRoomData>>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [bidValue, setBidValue] = useState<number | null>(null);

  const isEditing = (seqNo: number) => editingSeqNo === seqNo;

  const handleEdit = (row: AuctionRoomData) => {
    setEditingSeqNo(row.SeqNo);
    setFormValues((prev) => ({
      ...prev,
      [row.SeqNo]: {
        bid_value: row.bid_value,
        lot_value: Number((row.bid_value * row.cts).toFixed(2)),
      },
    }));
  };

  const handleCancelEdit = () => {
    setEditingSeqNo(null);
  };

  const handleInputChange = useCallback(
    (seqNo: number, field: 'bid_value' | 'lot_value', value: string) => {
      const cts = data.find((d) => d.SeqNo === seqNo)?.cts || 1;

      if (value === '') {
        setFormValues((prev) => ({
          ...prev,
          [seqNo]: {
            ...prev[seqNo],
            [field]: undefined,
            ...(field === 'bid_value' ? { lot_value: undefined } : { bid_value: undefined }),
          },
        }));
        return;
      }

      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return;

      setFormValues((prev) => ({
        ...prev,
        [seqNo]: {
          ...prev[seqNo],
          [field]: numericValue,
          ...(field === 'bid_value'
            ? { lot_value: Number((numericValue * cts).toFixed(2)) }
            : { bid_value: Number((numericValue / cts).toFixed(2)) }),
        },
      }));
    },
    [data]
  );

  const handleSave = async (seqNo: number) => {
    const updatedRow = formValues[seqNo];
    const originalRow = data.find((r) => r.SeqNo === seqNo);
    if (!updatedRow || !originalRow) return;

    const { bid_value, lot_value } = updatedRow;

    if (bid_value === undefined || lot_value === undefined) {
      toast.error('Max Bid Value or Lot Value is missing.');
      return;
    }

    if (bid_value < originalRow.SuggesetedMinBid) {
      setBidValue(originalRow.SuggesetedMinBid);
      setIsOpen(true);
      return;
    }
    const params: UpdateAuctionBidParams = {
      seqNo,
      bidValue: bid_value,
      lotValue: lot_value,
      eventId,
      minimumNewBid: originalRow.SuggesetedMinBid,
      entityID,
    };

    try {
      const res = await AuctionRoomServices.auctionUpdateBid(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Bid updated successfully');
        onUpdateRow?.(seqNo, {
          bid_value,
          lot_value,
        });
        setEditingSeqNo(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error submitting:', error);
      toast.error('Error submitting.');
    }
    setEditingSeqNo(null);
  };

  const renderEditableCell = (seqNo: number, field: keyof Pick<AuctionRoomData, 'bid_value' | 'lot_value'>) => (
    <TextField
      type="number"
      size="small"
      value={formValues[seqNo]?.[field] ?? ''}
      onChange={(e) => handleInputChange(seqNo, field, e.target.value)}
      inputProps={{
        min: 0,
        style: { textAlign: 'right' },
      }}
      fullWidth
    />
  );

  if (loading.isLoading || loading.isProgress) {
    return (
      <TableBody>
        <LoadingTableRow colSpan={10} />
      </TableBody>
    );
  }

  if (!data || data.length === 0) {
    return (
      <TableBody>
        <NoDataTableRow colSpan={10} padding />
      </TableBody>
    );
  }

  const sortedData = stableSort(data, getDescComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableBody>
        {sortedData.map((row, index) => {
          const isRowEditing = isEditing(row.SeqNo);

          return (
            <TableRow hover key={row?.SeqNo}>
              {renderTableCell({ content: index + 1 })}
              {renderTableCellEllipsis({ content: row?.stockNo })}
              {eventCategory === 1 && renderTableCell({ content: row?.Size })}
              {eventCategory === 2 && renderTableCell({ content: row?.Shape })}
              {eventCategory === 1 && (
                <TableCell>
                  {row?.stockDesc?.length > 20 ? (
                    <Tooltip title={row.stockDesc}>
                      <span>{row.stockDesc.substring(0, 20)}...</span>
                    </Tooltip>
                  ) : (
                    row?.stockDesc || '-'
                  )}
                </TableCell>
              )}
              {renderTableCell({ content: Number(row?.cts).toFixed(2), align: 'right' })}
              {renderTableCell({ content: row?.Max_bid_value.toFixed(2), align: 'right' })}
              {renderTableCell({
                content: formatNumber(row?.Max_lot_value),
                align: 'right',
              })}
              {renderTableCell({ content: row?.SuggesetedMinBid.toFixed(2), align: 'right' })}

              <TableCell align="right">{isRowEditing ? renderEditableCell(row.SeqNo, 'bid_value') : row.bid_value.toFixed(2)}</TableCell>
              {isRowEditing ? (
                <TableCell align="right">{renderEditableCell(row.SeqNo, 'lot_value')}</TableCell>
              ) : (
                renderTableCell({
                  content: formatNumber(row?.lot_value),
                  align: 'right',
                })
              )}
              <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
                <StyledRightAlignedIconGroup sx={{ justifyContent: 'center' }}>
                  {isRowEditing ? (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        disabled={Boolean(remainingTime)}
                        onClick={() => handleSave(row.SeqNo)}
                      >
                        Submit
                      </Button>
                      <Button variant="outlined" size="small" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : row?.BidStatus === 'Winning' ? (
                    <Button variant="outlined" size="small" color="success">
                      Winning
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      color={row?.BidStatus === 'Draw' ? 'warning' : 'primary'}
                      disabled={Boolean(remainingTime) || row?.BidStatus === 'Winning'}
                      onClick={() => handleEdit(row)}
                    >
                      {row?.BidStatus === 'Draw' ? 'Draw' : 'Edit Bid'}
                    </Button>
                  )}
                </StyledRightAlignedIconGroup>
              </StickyColCell>

              {auctionDurations[row.SeqNo] && renderTableCellEllipsis({ content: auctionDurations[row.SeqNo] || '' })}
            </TableRow>
          );
        })}
      </TableBody>
      <ErrorMessageDialog open={isOpen} handleClose={() => setIsOpen(false)} bidValue={bidValue} />
    </>
  );
};

export default AuctionRoomBidderTableBody;
