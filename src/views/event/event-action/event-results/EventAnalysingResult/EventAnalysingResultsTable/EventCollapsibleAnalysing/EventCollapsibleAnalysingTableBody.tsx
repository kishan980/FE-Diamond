'use client';
import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { alpha, useTheme } from '@mui/material/styles';
import { ArrowDown2, ArrowUp2, Repeat, TickSquare } from 'iconsax-react';
import EventBidLotsTableHeader from './EventBidLotsTableHeader';
import MainCard from 'components/MainCard';
import InputText from 'components/UIComponent/InputText';
import IconButton from 'components/@extended/IconButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { StyledEllipsisText, StyledLeftAlignedIconGroup } from 'views/common.styled';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { calculatePrice, calculateTotal } from 'utils/bidUtils';
import { handleKeyNavigation, setInputRef } from 'utils/inputNavigation';
import { renderTableCell, renderTableCellClick, renderTableCellEllipsis } from 'utils/renderTableCell';
import { EventCollapsibleAnalysingTableBodyProps, EventCollapsibleAnalysingTableBodyRowProps, LotBidValues } from 'types/table';
import {
  GetBiddingLotsData,
  GetSameBidEventData,
  UpdateBidConsiderParams,
  UpdateReviseParams,
} from 'services/event/event-action/event-results/type';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { getDescComparator, stableSort } from 'utils/react-table';
import { formatNumber } from 'utils/formatPercentage';

const Row: FC<EventCollapsibleAnalysingTableBodyRowProps<GetSameBidEventData>> = ({
  row,
  eventId,
  eventCategoryID,
  fetchGetBidEventData,
  fetchBidDetails,
  loading,
  setLoading,
  handleProfileDetailsReadClick,
}) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const username = session?.user?.image ? JSON.parse(session.user.image).currentUserDetails?.username : '';

  const inputRefs = useRef<Array<[HTMLInputElement | null, HTMLInputElement | null]>>([]);

  const [open, setOpen] = useState(false);
  const [biddingData, setBiddingData] = useState<GetBiddingLotsData[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedSeqNo, setSelectedSeqNo] = useState(0);
  const [selectedEntityId, setSelectedEntityId] = useState(0);
  const [selectedBidValue, setSelectedBidValue] = useState(0);

  const backColor = alpha(theme.palette.primary.lighter, 0.1);

  const initialValues: LotBidValues = {};

  const { values, setValues, handleBlur, handleSubmit } = useFormik({
    initialValues,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const fetchBiddingData = async () => {
    try {
      const res = await EventResultsServices.getBiddingLotsData(eventId, row.SeqNo);
      if (typeof res !== 'string' && res.success) {
        setBiddingData(res.data);
        const formValues: LotBidValues = {};

        res.data.forEach((item) => {
          formValues[item.bseqno] = {
            price: String(item.bid_value?.toFixed(3) || ''),
            total: String(item.Win_Rate?.toFixed(3) || ''),
            AdminComment: item.AdminComment || '',
          };
        });
        setValues(formValues);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in fetchBiddingData', e);
      toast.error('Error fetching data.');
    }
  };

  const handleArrowClick = async () => {
    if (!open) await fetchBiddingData();
    setOpen(!open);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number,
    field: 'price' | 'total' | 'AdminComment'
  ) => {
    const { value } = e.target;
    const cts = row?.cts ?? 0;
    const currentValues = values[id] || { price: '', total: '', AdminComment: '' };

    let updatedPrice = currentValues.price;
    let updatedTotal = currentValues.total;
    let updatedComment = currentValues.AdminComment;

    if (field === 'price') {
      updatedPrice = value;
      updatedTotal = calculateTotal(cts, value);
    } else if (field === 'total') {
      updatedTotal = value;
      updatedPrice = calculatePrice(cts, value);
    } else if (field === 'AdminComment') {
      updatedComment = value;
    }

    const updatedValues = {
      ...values,
      [id]: {
        ...currentValues,
        price: updatedPrice,
        total: updatedTotal,
        AdminComment: updatedComment,
      },
    };

    setValues(updatedValues);
  };

  const handleSubmitForm = async (values: LotBidValues) => {
    setLoading((prev) => ({ ...prev, isButtonLoading: true }));
    if (!selectedRowId) return;
    try {
      const selectedRowData = values[selectedRowId];
      const historyRow = biddingData.find((item) => item.bseqno === selectedRowId);

      const params: UpdateReviseParams = {
        eventId,
        entityId: Number(historyRow?.refBuyerID_EntityMas),
        stockSeqNo: Number(historyRow?.SeqNo),
        seqNo: Number(historyRow?.bseqno),
        bidValue: Number(selectedRowData.price),
        userId: username,
        adminComment: selectedRowData.AdminComment,
      };

      const res = await EventResultsServices.reviseEvent(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Revised bid successfully updated');
        setValues({
          ...values,
          [selectedRowId]: {
            ...selectedRowData,
          },
        });
        setOpen(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleSubmitForm', error);
      toast.error('An error occurred while accepting the lot');
    } finally {
      setLoading((prev) => ({ ...prev, isButtonLoading: false }));
    }
  };

  const handleConsiderBidClick = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));
    const bidConsiderParams: UpdateBidConsiderParams = {
      seqNo: selectedSeqNo,
      eventId,
      entityId: selectedEntityId,
      bidValue: selectedBidValue,
      finalStatus: 'Consider',
    };
    try {
      await EventResultsServices.bidConsiderEvent(bidConsiderParams);
      setIsConfirmDialogOpen(false);
      fetchGetBidEventData();
      fetchBidDetails();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleConsiderBidClick', error);
      toast.error('An error occurred while accepting the lot');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
    }
  };

  const handleCompanyNameClick = (SeqNo: number) => {
    const url = `/events/event-outcomes/analysing-outcome/lot-overview/${eventId}?seqNo=${SeqNo}&eventCategoryID=${eventCategoryID}`;
    window.open(url, '_blank');
  };

  const handleConfirmModalForConsiderBid = (SeqNo: number, entityId: number, bidValue: number) => {
    setSelectedSeqNo(SeqNo);
    setSelectedEntityId(entityId);
    setSelectedBidValue(bidValue);
    setIsConfirmDialogOpen(true);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={handleArrowClick}>
            {open ? <ArrowUp2 /> : <ArrowDown2 />}
          </IconButton>
        </TableCell>
        {renderTableCellClick({ content: row?.stockNo, onClick: () => handleCompanyNameClick(row.SeqNo ?? '') })}
        {eventCategoryID === 1 && renderTableCell({ content: row?.Size })}
        {eventCategoryID === 1 && renderTableCell({ content: row?.stockDesc })}
        {eventCategoryID === 2 && renderTableCell({ content: row?.Shape })}
        {eventCategoryID === 2 && renderTableCell({ content: row?.colour })}
        {eventCategoryID === 2 && renderTableCell({ content: row?.Clarity })}
        {renderTableCell({ content: row?.pcs, align: 'right' })}
        {renderTableCell({ content: row?.cts.toFixed(2), align: 'right' })}
        {renderTableCell({ content: formatNumber(row?.rate), align: 'right' })}
      </TableRow>

      <TableRow sx={{ bgcolor: backColor }}>
        <TableCell colSpan={8} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {open && (
              <Box sx={{ py: 3, pl: { xs: 3, sm: 5, md: 6, lg: 10, xl: 12 } }}>
                <TableContainer>
                  <MainCard content={false}>
                    <form onSubmit={handleSubmit}>
                      <Table size="small">
                        <EventBidLotsTableHeader />
                        <TableBody>
                          {biddingData.length > 0 ? (
                            biddingData.map((historyRow, index) => (
                              <TableRow hover key={historyRow.bseqno}>
                                {historyRow.co_name
                                  ? renderTableCellClick({
                                      content: historyRow.co_name,
                                      onClick: () => handleProfileDetailsReadClick(historyRow?.refBuyerID_EntityMas),
                                    })
                                  : renderTableCell({ content: '-' })}
                                {renderTableCellEllipsis({ content: historyRow.contactPerson })}
                                {renderTableCellEllipsis({ content: historyRow?.mobileno })}
                                <TableCell align="left">
                                  <InputText
                                    size="small"
                                    fullWidth
                                    id="price"
                                    type="number"
                                    name={`price-${historyRow?.bseqno}`}
                                    value={values[historyRow.bseqno]?.price || ''}
                                    inputRef={(el) => setInputRef(inputRefs.current, index, 0, el)}
                                    inputProps={{ style: { textAlign: 'right' } }}
                                    onKeyDown={(e) =>
                                      handleKeyNavigation(
                                        e as KeyboardEvent<HTMLInputElement>,
                                        inputRefs.current,
                                        index,
                                        0,
                                        handleSubmitForm,
                                        values
                                      )
                                    }
                                    onChange={(e) => handleInputChange(e, historyRow.bseqno, 'price')}
                                    onBlur={handleBlur}
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <InputText
                                    size="small"
                                    fullWidth
                                    id="total"
                                    type="number"
                                    name={`total-${historyRow?.bseqno}`}
                                    value={values[historyRow.bseqno]?.total || ''}
                                    inputRef={(el) => setInputRef(inputRefs.current, index, 1, el)}
                                    inputProps={{ style: { textAlign: 'right' } }}
                                    onKeyDown={(e) =>
                                      handleKeyNavigation(
                                        e as KeyboardEvent<HTMLInputElement>,
                                        inputRefs.current,
                                        index,
                                        1,
                                        handleSubmitForm,
                                        values
                                      )
                                    }
                                    onChange={(e) => handleInputChange(e, historyRow.bseqno, 'total')}
                                    onBlur={handleBlur}
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <InputText
                                    size="small"
                                    fullWidth
                                    id="adminComment"
                                    type="text"
                                    name={`adminComment-${historyRow?.bseqno}`}
                                    value={values[historyRow.bseqno]?.AdminComment || ''}
                                    onChange={(e) => handleInputChange(e, historyRow.bseqno, 'AdminComment')}
                                    onBlur={handleBlur}
                                  />
                                </TableCell>
                                <TableCell align="left">{historyRow.ReviseStatus}</TableCell>
                                <TableCell align="left">
                                  <StyledLeftAlignedIconGroup>
                                    <Button
                                      variant="contained"
                                      type="button"
                                      onClick={() => {
                                        setSelectedRowId(historyRow.bseqno);
                                        handleSubmit();
                                      }}
                                      startIcon={<Repeat color="#d9e3f0" />}
                                    >
                                      Revise
                                    </Button>
                                    {historyRow.ReviseStatus === 'Revised' && (
                                      <Button
                                        variant="outlined"
                                        onClick={() =>
                                          handleConfirmModalForConsiderBid(
                                            historyRow?.SeqNo,
                                            historyRow?.refBuyerID_EntityMas,
                                            historyRow?.bid_value
                                          )
                                        }
                                        startIcon={<TickSquare />}
                                      >
                                        <StyledEllipsisText>Consider Bid</StyledEllipsisText>
                                      </Button>
                                    )}
                                  </StyledLeftAlignedIconGroup>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
                                No Bidding Data Found!
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </form>
                  </MainCard>
                </TableContainer>
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConsiderBidClick}
        loading={loading}
        title={'Are you sure that you want to take this bid into consideration?'}
      />
    </>
  );
};

const EventCollapsibleAnalysingTableBody: FC<EventCollapsibleAnalysingTableBodyProps<GetSameBidEventData>> = ({
  data,
  loading,
  setLoading,
  eventId,
  eventCategoryID,
  fetchGetBidEventData,
  fetchBidDetails,
  handleProfileDetailsReadClick,
  order,
  orderBy,
}) => (
  <TableBody>
    {loading.isButtonLoading || loading.isLoading ? (
      <LoadingTableRow colSpan={10} />
    ) : data?.length > 0 ? (
      stableSort(data, getDescComparator(order, orderBy)).map((row) => (
        <Row
          key={row.SeqNo}
          row={row}
          eventId={eventId}
          fetchGetBidEventData={fetchGetBidEventData}
          fetchBidDetails={fetchBidDetails}
          loading={loading}
          eventCategoryID={eventCategoryID}
          setLoading={setLoading}
          handleProfileDetailsReadClick={handleProfileDetailsReadClick}
        />
      ))
    ) : (
      <NoDataTableRow colSpan={10} padding />
    )}
  </TableBody>
);

export default EventCollapsibleAnalysingTableBody;
