'use client';
import { memo, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import TableCell from '@mui/material/TableCell';
import InputAdornment from '@mui/material/InputAdornment';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { renderTableCell } from 'utils/renderTableCell';
import { getComparator, stableSort } from 'utils/react-table';
import { AllLotsTableBodyProps } from 'types/table';
import { ChatRoomAllBiddersOrLotsData, LostAllBiddersAndLots } from 'services/event/event-action/auction-room/type';
import { StyledLeftAlignedIconGroup, StickyColCell, UserStatusIndicator } from 'views/common.styled';
import { AuctionRoomServices } from 'services/bidder/auction-room/auctionRoom.services';
import { UpdateAuctionBidParams } from 'services/bidder/auction-room/type';
import { formatNumber } from 'utils/formatPercentage';

const AllLotsBidderTableBody = memo(
  ({
    data,
    page,
    order,
    orderBy,
    rowsPerPage,
    loading,
    onDeleteClick,
    eventId,
    seqNo,
    onlineUserIds,
  }: AllLotsTableBodyProps<ChatRoomAllBiddersOrLotsData>) => {
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<{ [key: number]: number | '' }>({});
    const [isButtonLoading, SetIsButtonLoading] = useState(false);

    const handleEditClick = async (row: LostAllBiddersAndLots) => {
      const rowId = row.refBuyerID_EntityMas;

      if (editRowId === rowId) {
        const pricePerCts = Number(editValues[rowId]);
        const cts = data[0]?.selectAllBiddersAndLots[0].Carat;
        SetIsButtonLoading(true);
        const params: UpdateAuctionBidParams = {
          seqNo,
          lotValue: pricePerCts * cts,
          bidValue: pricePerCts,
          eventId,
          minimumNewBid: data[0]?.selectAllBiddersAndLots[0].SuggesetedMinBidPerCt,
          entityID: rowId,
        };

        try {
          const res = await AuctionRoomServices.auctionUpdateBid(params);
          if (typeof res !== 'string' && res.success) {
            toast.success('Bid updated successfully');
            setEditRowId(null);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          toast.error('Error updating bid');
        } finally {
          SetIsButtonLoading(false);
        }
      } else {
        setEditRowId(rowId);
        setEditValues((prev) => ({
          ...prev,
          [rowId]: Number(row?.Max_bid_value) || '',
        }));
      }
    };

    const handleInputChange = (rowId: number, value: string) => {
      const parsed = value === '' ? '' : Number(value);
      if (parsed === '' || !isNaN(parsed)) {
        setEditValues((prev) => ({
          ...prev,
          [rowId]: parsed,
        }));
      }
    };

    const renderRow = (row: LostAllBiddersAndLots, index: number) => {
      const rowId = row.refBuyerID_EntityMas;
      const isEditing = rowId === editRowId;
      const isOnline = onlineUserIds.includes(row?.refBuyerID_EntityMas);
      return (
        <TableRow hover tabIndex={-1} key={index} className="hover-row">
          {renderTableCell({ content: row?.bidderName, width: '100px' })}
          {renderTableCell({
            content: <UserStatusIndicator active={isOnline} />,
            width: '100px',
          })}
          {renderTableCell({
            content: formatNumber(row?.Max_lot_value),
            width: '100px',
            align: 'right',
          })}
          <TableCell align="right" width="100px">
            {isEditing ? (
              <TextField
                type="text"
                size="small"
                value={editValues[rowId] ?? ''}
                onChange={(e) => handleInputChange(rowId, e.target.value)}
                InputProps={{
                  endAdornment:
                    editValues[rowId] !== '' && !isNaN(editValues[rowId]) ? (
                      <InputAdornment position="end">
                        ₹{formatNumber((Number(editValues[rowId]) || 0) * (data[0]?.selectAllBiddersAndLots[0]?.Carat ?? 0))}
                      </InputAdornment>
                    ) : null,
                }}
                fullWidth
              />
            ) : (
              row?.Max_bid_value.toFixed(2)
            )}
          </TableCell>
          <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
            <StyledLeftAlignedIconGroup sx={{ justifyContent: 'center' }}>
              {isEditing ? (
                <>
                  <LoadingButton
                    variant="contained"
                    size="small"
                    color="success"
                    loading={isButtonLoading}
                    onClick={() => handleEditClick(row)}
                    disabled={row?.ranks === 1}
                  >
                    Save
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={() => {
                      setEditRowId(null);
                      setEditValues((prev) => {
                        const newValues = { ...prev };
                        delete newValues[rowId];
                        return newValues;
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => handleEditClick(row)}
                  disabled={row?.ranks === 1 || data[0]?.selectAllBiddersAndLots[0]?.TimeLeft === 'Closed'}
                >
                  Edit
                </Button>
              )}

              {row?.ranks === 1 && (
                <LoadingButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => onDeleteClick(row?.refSeqNo_EventStock, row?.refBuyerID_EntityMas)}
                  disabled={data[0]?.selectAllBiddersAndLots[0]?.TimeLeft === 'Closed'}
                >
                  Withdraw
                </LoadingButton>
              )}
            </StyledLeftAlignedIconGroup>
          </StickyColCell>
        </TableRow>
      );
    };

    return (
      <TableBody>
        {loading.isProgress || loading.isLoading ? (
          <LoadingTableRow colSpan={5} />
        ) : data[0]?.lostAllBiddersAndLots?.length > 0 ? (
          stableSort(data[0]?.lostAllBiddersAndLots, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (row ? renderRow(row, index) : null))
        ) : (
          <NoDataTableRow colSpan={5} padding />
        )}
      </TableBody>
    );
  }
);

export default AllLotsBidderTableBody;
