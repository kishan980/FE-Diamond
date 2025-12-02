'use client';
import React, { memo, useCallback } from 'react';
import { TableRow, TableCell, Checkbox, Tooltip, IconButton, InputAdornment } from '@mui/material';
import { Add, Minus } from 'iconsax-react';
import InputText from 'components/UIComponent/InputText';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import CameraIconButton from 'components/UIComponent/IconButtons/CameraButton';
import CameraSlashIconButton from 'components/UIComponent/IconButtons/CameraSlashButton';
import { calculatePrice, calculateTotal } from 'utils/bidUtils';
import { handleInputNavigation } from 'utils/keyboardNavigation';
import { updatePriceAndTotal, updateTotalAndPrice } from 'utils/bidInputUtils';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';
import { formatNumber } from 'utils/formatPercentage';

interface Props {
  row: GetAllLotsData;
  values: Record<number, { price: string; total: string }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  isItemSelected: boolean;
  handleClick: (id: number) => void;
  eventCategoryId: number;
}

const BidTableRow: React.FC<Props> = memo(({ row, values, setFieldValue, isItemSelected, handleClick, eventCategoryId }) => {
  const { SeqNo, cts } = row;
  const price = values[SeqNo]?.price || '';
  const total = price === '' || price === undefined || price === null ? '' : values[SeqNo]?.total || '';

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPrice = e.target.value;
      setFieldValue(`${SeqNo}.price`, newPrice);
      if (newPrice === '' || isNaN(Number(newPrice))) {
        setFieldValue(`${SeqNo}.total`, '');
      } else {
        setFieldValue(`${SeqNo}.total`, calculateTotal(cts, newPrice));
      }
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
      <TableCell padding="checkbox" className="print-hidden-column">
        <Checkbox checked={isItemSelected} onClick={() => handleClick(SeqNo)} />
      </TableCell>

      {renderTableCellEllipsis({ content: row?.stockNo })}
      {eventCategoryId === 1 && renderTableCellEllipsis({ content: row?.Size })}
      {eventCategoryId === 2 && renderTableCellEllipsis({ content: row?.Shape })}
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
      {renderTableCell({ content: row?.pcs, align: 'right' })}
      {renderTableCell({ content: formatNumber(row?.cts), align: 'right' })}
      <TableCell align="left">
        <InputText
          size="small"
          fullWidth
          type="number"
          value={price}
          onChange={handlePriceChange}
          onKeyDown={handleKeyDown}
          inputProps={{
            min: 0,
            step: 0.001,
            style: {
              textAlign: 'right',
            },
          }}
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
          value={total}
          onChange={handleTotalChange}
          onKeyDown={handleKeyDown}
          inputProps={{
            min: 0,
            step: 0.001,
            style: {
              textAlign: 'right',
            },
          }}
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
      <TableCell align="center" className="print-hidden-column">
        <IconButton>
          {row.isImageExist ? <CameraIconButton title="Image/Video" /> : <CameraSlashIconButton title="Image/Video" />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default BidTableRow;
