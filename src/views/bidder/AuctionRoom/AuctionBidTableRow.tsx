'use client';
import React, { memo, useCallback } from 'react';
import { TableRow, TableCell, Tooltip, IconButton, InputAdornment, Button } from '@mui/material';
import { Add, Minus } from 'iconsax-react';
import InputText from 'components/UIComponent/InputText';
import { calculatePrice, calculateTotal } from 'utils/bidUtils';
import { handleInputNavigation } from 'utils/keyboardNavigation';
import { updatePriceAndTotal, updateTotalAndPrice } from 'utils/bidInputUtils';
import { AuctionRoomData } from 'services/bidder/auction-room/type';
import { AuctionRoomBidTableRowProps } from 'types/bidder';

const AuctionRoomBidTableRow: React.FC<AuctionRoomBidTableRowProps<AuctionRoomData>> = memo(
  ({ row, values, setFieldValue, isItemSelected, eventCategoryId, index }) => {
    const { SeqNo, cts } = row;
    const price = values[SeqNo]?.price || '';
    const total = values[SeqNo]?.total || '';

    const handlePriceChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = e.target.value;
        setFieldValue(`${SeqNo}.price`, newPrice);
        setFieldValue(`${SeqNo}.total`, calculateTotal(cts, newPrice));
      },
      [SeqNo, cts, setFieldValue]
    );

    const handleTotalChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTotal = e.target.value;
        setFieldValue(`${SeqNo}.total`, newTotal);
        setFieldValue(`${SeqNo}.price`, calculatePrice(cts, newTotal));
      },
      [SeqNo, cts, setFieldValue]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      handleInputNavigation(e);
    };

    return (
      <TableRow hover key={SeqNo} selected={isItemSelected}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{row?.stockNo}</TableCell>
        {eventCategoryId === 1 && <TableCell>{row?.Size}</TableCell>}
        {eventCategoryId === 2 && <TableCell>{row?.Shape}</TableCell>}
        {eventCategoryId === 1 ? (
          <TableCell>
            {row?.stockDesc?.length > 20 ? (
              <Tooltip title={row.stockDesc}>
                <span>{row.stockDesc.substring(0, 20)}...</span>
              </Tooltip>
            ) : (
              row?.stockDesc || '-'
            )}
          </TableCell>
        ) : (
          <TableCell>{row?.Colour}</TableCell>
        )}
        {eventCategoryId === 2 && <TableCell>{row?.Clarity}</TableCell>}
        <TableCell align="right">{Number(row?.cts).toFixed(2)}</TableCell>

        {eventCategoryId === 1 && <TableCell align="right">{row?.Max_bid_value}</TableCell>}
        {eventCategoryId === 1 && <TableCell align="right">{row?.Max_lot_value}</TableCell>}

        {eventCategoryId === 1 && <TableCell align="right">{row?.SuggesetedMinBid}</TableCell>}

        <TableCell align="left">
          <InputText
            size="small"
            fullWidth
            type="number"
            value={row?.Max_bid_value}
            onChange={handlePriceChange}
            onKeyDown={handleKeyDown}
            inputProps={{ min: 0, step: 0.001 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={() => {
                      updatePriceAndTotal(cts, price, setFieldValue, SeqNo, 1);
                    }}
                  >
                    <Add fontSize="small" color="#041d91" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      updatePriceAndTotal(cts, price, setFieldValue, SeqNo, -1);
                    }}
                  >
                    <Minus fontSize="small" color="#041d91" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                px: 0,
                width: '170px',
              },
            }}
          />
        </TableCell>
        <TableCell align="left">
          <InputText
            size="small"
            fullWidth
            type="number"
            value={row?.lot_value}
            onChange={handleTotalChange}
            onKeyDown={handleKeyDown}
            inputProps={{ min: 0, step: 0.001 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={() => {
                      updateTotalAndPrice(cts, total, setFieldValue, SeqNo, 1);
                    }}
                  >
                    <Add fontSize="small" color="#041d91" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      updateTotalAndPrice(cts, total, setFieldValue, SeqNo, -1);
                    }}
                  >
                    <Minus fontSize="small" color="#041d91" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                px: 0,
                width: '170px',
              },
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Button variant="outlined" size="small" color="primary">
            Edit Bid
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

export default AuctionRoomBidTableRow;
