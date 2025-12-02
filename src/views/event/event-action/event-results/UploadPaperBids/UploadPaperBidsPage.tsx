'use client';
import { useState, ChangeEvent, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import { ArrowLeft2 } from 'iconsax-react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TablePagination from '@mui/material/TablePagination';
import Skeleton from '@mui/lab/Skeleton';
import Box from '@mui/material/Box';
import SelectAndActionBids from './SelectAndActionBids';
import { TitleMainBoxContainer } from './UploadPaperBids.styled';
import UploadPaperBidsTableHeader from './UploadPaperBidsTableHeader';
import UploadPaperBidsTableBody from './UploadPaperBidsTableBody';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { LotBidValues, LoadingState } from 'types/table';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { EventResultsServices } from 'services/event/event-action/event-results/eventResults.services';
import { GetAllLotsData, GetAllLotsParams } from 'services/bidder/all-lots/type';
import {
  AddBidderListParams,
  BidderListDetail,
  DeleteBidderListParams,
  GetBidderListData,
} from 'services/event/event-action/event-results/type';
import PrintLogo from 'components/logo/PrintLogo';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { useTableControls } from 'utils/useTableControls';
import { StyledEllipsisText, StyledTotalValueContent, StyledTotalValueRow, StyledTotalValueWrapper } from 'views/common.styled';
import { formatNumber } from 'utils/formatPercentage';
import { StyledAuctionDetailsWrapper } from 'views/bidder/CommonBidder.styled';

export const getFilledValues = (values: Record<number, { price: string; total: string }>) =>
  Object.fromEntries(Object.entries(values).filter(([, val]) => val?.price?.trim() || val?.total?.trim()));

const UploadPaperBidsPage = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const searchParams = useSearchParams();
  const eventCategoryId = Number(searchParams.get('eventCategory'));

  const router = useRouter();
  const handleBack = () => router.back();

  const [data, setData] = useState<GetAllLotsData[]>([]);
  const [bidderData, setBidderData] = useState<GetBidderListData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [selectedBidderID, setSelectedBidderID] = useState<string>('');
  const [withdrawBidLoading, setWithdrawBidLoading] = useState<boolean>(false);
  const [previousTotals, setPreviousTotals] = useState<Record<number, number>>({});
  const [committedTotal, setCommittedTotal] = useState<number>(0);

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('SeqNo');

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const formattedNumber = (num?: number | null) =>
    `US$ ${formatNumber(num ?? 0, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;

  const initialValues: LotBidValues = {};

  const { values, setValues, setFieldValue, isSubmitting, handleSubmit, setSubmitting } = useFormik({
    initialValues,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => setSelected(event.target.checked ? data.map((n) => n.SeqNo) : []);

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  const fetchBidderData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const entityType = eventCategoryId === 1 ? 'Rough' : 'Polished';
      const res = await EventResultsServices.getBidderListData(eventId, entityType);
      if (typeof res !== 'string' && res.success) setBidderData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bidder list:', error);
      toast.error('Failed to fetch bidder data');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, [eventId, eventCategoryId]);

  const handleBidderSelection = (event: SelectChangeEvent<number | string | boolean>) => setSelectedBidderID(event.target.value as string);

  const fetchLotsData = useCallback(async () => {
    if (!selectedBidderID) return;
    setLoading((prev) => ({ ...prev, isProgress: true }));

    try {
      const params: GetAllLotsParams = { eventId, entityId: selectedBidderID, mineId: 0 };
      const res = await AllLotsServices.getLots(params);
      if (typeof res !== 'string' && res.success) {
        const fetchedData = res.data.filter((item) => item.SalesType === 'Tender');
        setData(fetchedData);

        const initialFormValues: LotBidValues = {};
        const initialTotalMap: Record<number, number> = {};

        fetchedData.forEach((item) => {
          const total = item.lot_value || 0;
          initialFormValues[item.SeqNo] = {
            price: String(item.bid_value?.toFixed(3) || ''),
            total: String(total.toFixed(3) || ''),
          };
          initialTotalMap[item.SeqNo] = total;
        });

        setPreviousTotals(initialTotalMap);
        setValues(initialFormValues);

        const totalFromServer = Object.values(initialTotalMap).reduce((sum, v) => sum + v, 0);
        setCommittedTotal(totalFromServer);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching lots data:', error);
      toast.error('Failed to fetch lots data');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, [eventId, selectedBidderID, setValues]);

  const handleWithdraw = async () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      setSubmitting(false);
      return;
    }

    setWithdrawBidLoading(true);
    const params: DeleteBidderListParams = { eventId, entityId: Number(selectedBidderID), stockNos: selected };

    try {
      const res = await EventResultsServices.deleteBidderList(params);
      if (typeof res !== 'string' && res.success) {
        const updatedValues = { ...values };
        selected.forEach((seqNo) => {
          if (updatedValues[seqNo]) updatedValues[seqNo] = { ...updatedValues[seqNo], price: '', total: '' };
        });

        setValues(updatedValues);
        toast.success('Selected lots deleted successfully');
        let delta = 0;
        const updatedPreviousTotals = { ...previousTotals };

        selected.forEach((seqNo) => {
          const prevTotal = previousTotals[seqNo] || 0;
          delta += prevTotal;
          delete updatedPreviousTotals[seqNo];
        });

        setCommittedTotal((prev) => prev - delta);
        setPreviousTotals(updatedPreviousTotals);

        setSelected([]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while deleting the selected lots', error);
      toast.error('Failed to delete selected lots');
    } finally {
      setWithdrawBidLoading(false);
    }
  };

  const handleSubmitForm = async (values: LotBidValues) => {
    const filtered = getFilledValues(values);

    const bidDetails: BidderListDetail[] = Object.entries(filtered).map(([seqNo, val]) => ({
      seqNoEventStock: Number(seqNo),
      bidValue: parseFloat(Number(val.price).toFixed(3)),
      lotValue: parseFloat(Number(val.total).toFixed(3)),
      maxPurchaseLimit: null,
    }));

    if (bidDetails.length === 0) {
      setSubmitting(false);
      return;
    }

    const params: AddBidderListParams = { eventId, entityId: Number(selectedBidderID), bidDetails };

    try {
      const res = await EventResultsServices.addBiddersList(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Data submitted successfully');

        let delta = 0;
        const updatedPreviousTotals = { ...previousTotals };

        for (const [seqNoStr, val] of Object.entries(filtered)) {
          const seqNo = Number(seqNoStr);
          const newTotal = parseFloat(val.total);
          const oldTotal = previousTotals[seqNo] ?? 0;

          const diff = isNaN(newTotal) ? 0 : newTotal - oldTotal;

          if (!isNaN(diff)) {
            delta += diff;
            updatedPreviousTotals[seqNo] = newTotal;
          }
        }

        setCommittedTotal((prev) => prev + delta);
        setPreviousTotals(updatedPreviousTotals);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting data of UploadPaperBidsPage:', error);
      toast.error('Failed to submit data');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBidderData();
  }, [fetchBidderData]);

  useEffect(() => {
    fetchLotsData();
  }, [fetchLotsData]);

  const totalNumberOfBids = useMemo(() => {
    return Object.values(previousTotals).filter((val) => val > 0).length;
  }, [previousTotals]);

  const renderValueRow = (label: string, value: ReactNode) => (
    <StyledTotalValueRow>
      <StyledEllipsisText variant="h6" color="text.primary">
        {label}
      </StyledEllipsisText>
      <StyledEllipsisText variant="h5" color="primary">
        {value}
      </StyledEllipsisText>
    </StyledTotalValueRow>
  );

  const renderSkeletonRow = () => (
    <StyledTotalValueRow>
      <Skeleton variant="text" width={140} height={24} />
      <Skeleton variant="text" width={60} height={24} />
    </StyledTotalValueRow>
  );

  const renderValues = () => {
    if (loading.isProgress) {
      return (
        <>
          {renderSkeletonRow()}
          <Divider />
          {renderSkeletonRow()}
        </>
      );
    }
    return (
      <>
        {renderValueRow('Total Commitment:', formattedNumber(committedTotal))}

        <Divider />

        {renderValueRow('Total Number of Bids:', totalNumberOfBids)}
      </>
    );
  };
  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <MainCard
          content={false}
          title={
            <TitleMainBoxContainer onClick={handleBack}>
              <ArrowLeft2 size={16} color="#000" />
              <span className="text-black">Manual Bids</span>
            </TitleMainBoxContainer>
          }
          headerClassName="print-card-hidden-title"
          secondary={<PrintIconButton title="Print" onClick={() => window.print()} />}
        >
          <StyledAuctionDetailsWrapper>
            {eventId && (
              <Box className="print-total-value-container">
                <StyledTotalValueWrapper>
                  <StyledTotalValueContent>{renderValues()}</StyledTotalValueContent>
                </StyledTotalValueWrapper>
              </Box>
            )}
          </StyledAuctionDetailsWrapper>

          <SelectAndActionBids
            {...{
              id: 'bidder-select',
              selectedID: selectedBidderID,
              data: bidderData,
              handleSelect: handleBidderSelection,
              selected,
              isSubmitting,
              handleWithdraw,
              withdrawBidLoading,
            }}
          />
          <TableContainer className="print-table-container">
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
              <UploadPaperBidsTableHeader
                {...{
                  order,
                  orderBy,
                  rowCount: data.length,
                  numSelected: selected.length,
                  onRequestSort: handleRequestSort,
                  onSelectAllClick: handleSelectAllClick,
                  eventCategoryId,
                }}
              />
              <UploadPaperBidsTableBody
                {...{ data, page, order, orderBy, rowsPerPage, loading, isSelected, values, setFieldValue, eventCategoryId, handleClick }}
              />
            </Table>
          </TableContainer>
          <Divider />
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ '& p': { m: 0 } }}
          />
        </MainCard>
      </form>
    </>
  );
};

export default UploadPaperBidsPage;
