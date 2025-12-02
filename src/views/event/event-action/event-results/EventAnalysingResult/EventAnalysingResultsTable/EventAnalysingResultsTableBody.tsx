'use client';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Checkbox from '@mui/material/Checkbox';
import { FolderOpen, TickSquare } from 'iconsax-react';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { EventResultsTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellClick, renderTableCellLink } from 'utils/renderTableCell';
import { GetBidDetailsForWinnerData, UpdateBidConsiderParams, UpdateReOpenParams } from 'services/event/event-action/event-results/type';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { DIALOG_TITLES } from 'constants/dialogTitles';
import { formatNumber, formatPercentageWithSign } from 'utils/formatPercentage';
import { getDescComparator, stableSort } from 'utils/react-table';

const EventAnalysingResultsTableBody = ({
  data,
  loading,
  onSelectData,
  isSelected,
  handleClick,
  eventId,
  fetchBidDetails,
  handleProfileDetailsReadClick,
  buttonState,
  setButtonState,
  eventCategoryID,
  order,
  orderBy,
}: EventResultsTableBodyProps<GetBidDetailsForWinnerData>) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [currentRow, setCurrentRow] = useState<GetBidDetailsForWinnerData | null>(null);

  const handleOpenDialog = (row: GetBidDetailsForWinnerData, actionType: keyof typeof DIALOG_TITLES) => {
    setCurrentRow(row);
    setDialogTitle(DIALOG_TITLES[actionType]);
    setIsConfirmDialogOpen(true);
  };

  const handleDialogClose = useCallback(
    async (confirmed: boolean) => {
      setIsConfirmDialogOpen(false);
      if (!confirmed || !currentRow) return;

      const { cts, Win_Rate, rate, SeqNo } = currentRow;
      const action = dialogTitle.includes('accept') ? 'accept' : dialogTitle.includes('refuse') ? 'refuse' : 'reopen';

      try {
        if (action === 'accept' || action === 'refuse') {
          const finalStatus = action === 'accept' ? 'Accepted' : 'Withdrawn';
          const params: UpdateBidConsiderParams = { seqNo: SeqNo, eventId, finalStatus };
          await EventResultsServices.bidConsiderEvent(params);
          onSelectData({ cts, Win_Rate, rate }, action);
          setButtonState((prev) => ({ ...prev, [SeqNo]: action === 'accept' ? 'AcceptedReopen' : 'WithdrawReopen' }));
        } else if (action === 'reopen') {
          const params: UpdateReOpenParams = { seqNo: SeqNo, eventId };
          await EventResultsServices.reOpenEvent(params);
          const currentState = buttonState[SeqNo];
          const newAction = currentState === 'AcceptedReopen' ? 'AcceptedReopen' : 'WithdrawReopen';
          onSelectData({ cts, Win_Rate, rate }, newAction);
          setButtonState((prev) => ({ ...prev, [SeqNo]: 'YesNo' }));
        }
        fetchBidDetails();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in handleDialogClose:', error);
        toast.error('Something went wrong! Please try again.');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRow, dialogTitle, eventId, fetchBidDetails, onSelectData]
  );

  const renderRow = (row: GetBidDetailsForWinnerData, index: number) => {
    const state =
      buttonState[row?.SeqNo] ||
      (row?.FinalLotStatus === 'Accepted' ? 'AcceptedReopen' : row?.FinalLotStatus === 'Withdrawn' ? 'WithdrawReopen' : 'YesNo');

    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.SeqNo);

    return (
      <TableRow hover role="checkbox" aria-checked={isItemSelected} selected={isItemSelected} tabIndex={-1} key={index}>
        <TableCell padding="checkbox">
          <Checkbox checked={isItemSelected} onClick={() => handleClick(row.SeqNo ?? '')} inputProps={{ 'aria-labelledby': labelId }} />
        </TableCell>
        {renderTableCellLink({
          content: row?.stockNo,
          redirectUrl: `/events/event-outcomes/analysing-outcome/lot-overview/${eventId}?seqNo=${row.SeqNo}&eventCategoryID=${eventCategoryID}`,
        })}
        {eventCategoryID === 1 && renderTableCell({ content: row?.SalesType })}
        {eventCategoryID === 2 && renderTableCell({ content: row?.Shape })}
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
        {eventCategoryID === 2 && renderTableCell({ content: row?.Clarity })}
        {renderTableCell({ content: row?.pcs, align: 'right' })}
        {renderTableCell({ content: formatNumber(row?.cts), align: 'right' })}
        {renderTableCell({ content: formatNumber(row?.rate), align: 'right' })}
        {renderTableCell({ content: row?.noOfBids, align: 'right' })}
        <TableCell align="left">
          {row?.Win_Rate === null ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button size="small">Unsold</Button>
            </Box>
          ) : (
            <>
              {state === 'YesNo' && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button size="small" variant="contained" onClick={() => handleOpenDialog(row, 'accept')} startIcon={<TickSquare />}>
                    Accept
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleOpenDialog(row, 'refuse')}>
                    <Box
                      component="img"
                      src="/assets/icons/withdrawal.png"
                      width={16}
                      height={16}
                      sx={{
                        color: '#3c64d0 !important',
                        mr: 1,
                      }}
                    />
                    Withdraw
                  </Button>
                </Box>
              )}
              {state === 'AcceptedReopen' && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button size="small" variant="contained" startIcon={<TickSquare />}>
                    Accepted
                  </Button>
                  <Button size="small" variant="outlined" onClick={() => handleOpenDialog(row, 'reopen')} startIcon={<FolderOpen />}>
                    Reopen
                  </Button>
                </Box>
              )}
              {state === 'WithdrawReopen' && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button size="small" variant="contained" onClick={() => handleOpenDialog(row, 'reopen')} startIcon={<FolderOpen />}>
                    Reopen
                  </Button>
                  <Button size="small" variant="outlined">
                    <Box
                      component="img"
                      src="/assets/icons/withdrawal.png"
                      width={16}
                      height={16}
                      sx={{
                        color: '#3c64d0 !important',
                        mr: 1,
                      }}
                    />
                    Withdraw
                  </Button>
                </Box>
              )}
            </>
          )}
        </TableCell>
        {row?.co_name
          ? renderTableCellClick({ content: row?.co_name, onClick: () => handleProfileDetailsReadClick(row?.refBuyerID_EntityMas) })
          : renderTableCell({ content: '-' })}
        {renderTableCell({ content: formatNumber(row?.bid_value), align: 'right' })}
        {renderTableCell({
          content: formatPercentageWithSign(row?.variance),
          align: 'right',
          sx: { color: row?.variance >= 0 ? '#9BBB59' : 'red' },
        })}
        {renderTableCell({
          content: formatNumber(row?.Win_Rate),
          align: 'right',
        })}
        {eventCategoryID === 1 && renderTableCell({ content: row?.SellerName })}
        {eventCategoryID === 1 && renderTableCell({ content: row?.MineID })}
      </TableRow>
    );
  };

  return (
    <>
      <TableBody>
        {loading.isProgress || loading.isLoading ? (
          <LoadingTableRow colSpan={15} />
        ) : data?.length > 0 ? (
          stableSort(data, getDescComparator(order, orderBy)).map((row, index) => (row ? renderRow(row, index) : null))
        ) : (
          <NoDataTableRow colSpan={15} padding />
        )}
      </TableBody>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        title={dialogTitle}
        onConfirm={() => handleDialogClose(true)}
        onCancel={() => handleDialogClose(false)}
      />
    </>
  );
};

export default EventAnalysingResultsTableBody;
