'use client';
import { KeyboardEvent, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Add, Minus } from 'iconsax-react';
import InputText from 'components/UIComponent/InputText';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import CameraIconButton from 'components/UIComponent/IconButtons/CameraButton';
import CameraSlashIconButton from 'components/UIComponent/IconButtons/CameraSlashButton';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import { CommonLotsTableBodyProps } from 'types/table';
import { handleKeyNavigation, setInputRef } from 'utils/inputNavigation';
import { renderStringOrHtmlCell, renderTableCell, renderTableCellEllipsis, renderTableCellFixed } from 'utils/renderTableCell';
import { getDescComparator, stableSort } from 'utils/react-table';
import { formatNumber } from 'utils/formatPercentage';

const CommonBiddersTableBody = ({
  eventTenderData,
  data,
  values,
  loading,
  isSelected,
  handleClick,
  handleInputChange,
  handleManualPriceChange,
  handleBlur,
  remainingTime,
  eventCategory,
  onSubmitForm,
  onMediaMenuClick,
  order,
  orderBy,
}: CommonLotsTableBodyProps<GetAllLotsData>) => {
  const inputRefs = useRef<Array<[HTMLInputElement | null, HTMLInputElement | null]>>([]);
  const isRemainingTimeOpen =
    remainingTime !== 'Not Open Yet' &&
    remainingTime !== 'Tender & pre-auction submission period is closed.' &&
    remainingTime !== 'Auction is ongoing' &&
    remainingTime !== 'Closed' &&
    Boolean(remainingTime);

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={10} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy)).map((row, index) => {
          if (!row) return null;
          const labelId = `enhanced-table-checkbox-${index}`;
          const isItemSelected = isSelected(row?.SeqNo);

          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              selected={isItemSelected}
              tabIndex={-1}
              key={row?.SeqNo}
              sx={{
                backgroundColor: row?.LotStatus === 'Won' ? '#9BBB59' : 'inherit',
                '&.MuiTableRow-hover:hover': { backgroundColor: row?.LotStatus === 'Won' ? '#87A648' : 'secondary.200' },
              }}
            >
              <TableCell padding="checkbox" className="print-hidden-column">
                <Checkbox
                  checked={isItemSelected}
                  onClick={() => handleClick(row?.SeqNo ?? '')}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </TableCell>
              {renderTableCell({ content: row?.stockNo })}
              {eventTenderData[0]?.EventType === 'Mixed' && renderTableCell({ content: row?.SalesType })}
              {eventCategory === 1 && renderTableCell({ content: row?.Size })}
              {eventCategory === 1
                ? renderTableCellEllipsis({
                    content:
                      row?.stockDesc?.length > 20 ? (
                        <Tooltip title={row.stockDesc} arrow>
                          <span>{row.stockDesc.substring(0, 20)}...</span>
                        </Tooltip>
                      ) : (
                        row?.stockDesc || '-'
                      ),
                  })
                : renderTableCell({
                    content:
                      row?.Shape?.length > 20 ? (
                        <Tooltip title={row?.Shape} arrow>
                          <span>{row?.Shape.substring(0, 20)}...</span>
                        </Tooltip>
                      ) : (
                        row?.Shape || '-'
                      ),
                  })}
              {renderTableCell({ content: row?.pcs, align: 'right' })}
              {renderTableCellFixed({
                content: row?.cts,
                format: (value) => Number(value).toFixed(2),
                align: 'right',
              })}
              {eventTenderData[0]?.ShowReservePrice && renderTableCellFixed({ content: formatNumber(row?.rate), align: 'right' })}
              {renderTableCellEllipsis({ content: row?.MinesName })}
              <TableCell align="left">
                <InputText
                  size="small"
                  fullWidth
                  id="price"
                  type="number"
                  name={`price-${row?.SeqNo}`}
                  value={values[row?.SeqNo]?.price || ''}
                  inputProps={{
                    style: {
                      textAlign: 'right',
                    },
                    readOnly: !remainingTime,
                    inputMode: 'decimal',
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      px: 0,
                      width: '170px',
                    },
                  }}
                  inputRef={(el) => setInputRef(inputRefs.current, index, 0, el)}
                  onKeyDown={(e) =>
                    handleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 0, onSubmitForm, values)
                  }
                  onChange={(e) => handleInputChange(e, row?.SeqNo, 'price')}
                  onBlur={handleBlur}
                  disabled={!isRemainingTimeOpen}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton disabled={!isRemainingTimeOpen} size="small" onClick={() => handleManualPriceChange?.(row?.SeqNo, -1)}>
                          <Minus fontSize="small" color="#041d91" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={!isRemainingTimeOpen} size="small" onClick={() => handleManualPriceChange?.(row?.SeqNo, 1)}>
                          <Add fontSize="small" color="#041d91" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              <TableCell align="left">
                <InputText
                  size="small"
                  fullWidth
                  id="total"
                  type="number"
                  name={`total-${row?.SeqNo}`}
                  value={values[row.SeqNo]?.total || ''}
                  sx={{
                    '& .MuiInputBase-root': {
                      px: 0,
                      width: '170px',
                    },
                  }}
                  inputRef={(el) => setInputRef(inputRefs.current, index, 1, el)}
                  onKeyDown={(e) =>
                    handleKeyNavigation(e as KeyboardEvent<HTMLInputElement>, inputRefs.current, index, 1, onSubmitForm, values)
                  }
                  onChange={(e) => handleInputChange(e, row?.SeqNo, 'total')}
                  onBlur={handleBlur}
                  inputProps={{
                    style: {
                      textAlign: 'right',
                    },
                    readOnly: !remainingTime,
                  }}
                  disabled={!isRemainingTimeOpen}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton disabled={!isRemainingTimeOpen} size="small" onClick={() => handleManualPriceChange?.(row?.SeqNo, -1)}>
                          <Minus fontSize="small" color="#041d91" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={!isRemainingTimeOpen} size="small" onClick={() => handleManualPriceChange?.(row?.SeqNo, 1)}>
                          <Add fontSize="small" color="#041d91" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              {(eventTenderData[0]?.EventType === 'Auction' || eventTenderData[0]?.EventType === 'Mixed') &&
                (!remainingTime ||
                  remainingTime === 'Tender & pre-auction submission period is closed.' ||
                  remainingTime === 'Auction is ongoing' ||
                  remainingTime === 'Closed') &&
                renderStringOrHtmlCell({ content: row?.LotStatus })}
              <TableCell align="center" width="1%" className="print-hidden-column">
                <IconButton onClick={() => onMediaMenuClick(row?.stockNo)}>
                  {row.isImageExist ? (
                    <CameraIconButton title="Upload Lot Image/Video" />
                  ) : (
                    <CameraSlashIconButton title="Upload Lot Image/Video" />
                  )}
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <NoDataTableRow colSpan={10} />
      )}
    </TableBody>
  );
};

export default CommonBiddersTableBody;
