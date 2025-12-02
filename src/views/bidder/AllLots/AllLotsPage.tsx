'use client';
import { useState, ChangeEvent, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { signOut, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import OverallPurchaseLimitInfo from '../OverallPurchaseLimit/OverallPurchaseLimitInfo';
import AllLotsTable from './AllLotsTable';
import AllLotsBidderDetails from './AllLotsBidderDetails';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { EventServices } from 'services/event/event.services';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { LotBidValues, LoadingState } from 'types/table';
import {
  AddBidderLotsParams,
  DeleteAllLotsParams,
  GetAllLotsData,
  GetAllLotsParams,
  GetAllLotsTotalLotsData,
  GetAllLotsTotalLotsParams,
  GetExcelExportParams,
  LotDetail,
} from 'services/bidder/all-lots/type';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { FetchLotsImage } from 'services/event/event-action/upload-lots/type';
import CircularLoader from 'components/UIComponent/CircularLoader';
import PrintLogo from 'components/logo/PrintLogo';
import { GetOverallPurchaseLimitData, GetOverallPurchaseLimitParams } from 'services/bidder/overall-purchase-limit/type';
import { OverallPurchaseLimitBidderServices } from 'services/bidder/overall-purchase-limit/overallPurchaseLimit.services';
import SmsIcon from 'components/UIComponent/IconButtons/SmsButton/SmsIcon';
import { handleExcelExport } from 'utils/exportUtils';
import BidSubmissionSuccessDialog from 'components/UIComponent/Dialogs/BidSubmissionSuccessDialog';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';
import ImageAndVideoModel from 'components/UIComponent/ImageAndVideoModel';
import { useRemainingTime } from 'hooks/useRemainingTime';
import { useMinesData } from 'hooks/useMinesData';

const AllLotsPage = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const { data: session } = useSession();
  const router = useRouter();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');

  const { eventCategory, entityID, companyID, pageSize, isDownloadAccess } = imageDetails?.currentUserDetails ?? {};

  const [data, setData] = useState<GetAllLotsData[]>([]);
  const [basicDetailsLots, setBasicDetailsLots] = useState<GetAllLotsTotalLotsData[]>([]);
  const [selectedMineID, setSelectedMineID] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [submittedRows, setSubmittedRows] = useState<Set<number>>(new Set());
  const [editedRows, setEditedRows] = useState<Set<number>>(new Set());
  const [imageAndVideoDialog, setImageAndVideoDialog] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<FetchLotsImage[]>([]);
  const [selectedLot, setSelectedLot] = useState<GetAllLotsData | null>(null);
  const [overallPurchaseData, setOverallPurchaseData] = useState<GetOverallPurchaseLimitData>();
  const [showOverAllPurchaseLimit, setShowOverAllPurchaseLimit] = useState<string>('');
  const [withdrawBidLoading, setWithdrawBidLoading] = useState<boolean>(false);
  const [totalCommitment, setTotalCommitment] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isBasicDetailsLoaded, setIsBasicDetailsLoaded] = useState(false);
  const [totalNumberOfBids, setTotalNumberOfBids] = useState(0);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [eventTenderData, setEventTenderData] = useState<GetViewParticipateData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isTimerLoading: false,
    isCircularLoading: false,
    isSendMailLoading: false,
    isExcelButtonLoading: false,
    isAuctionButtonLoading: false,
  });
  const selectedMineIDRef = useRef<number | null>(selectedMineID);
  const remainingTime = useRemainingTime(eventTenderData);
  const { mineData, isMineLoading, fetchMineData } = useMinesData();

  const initialValues: LotBidValues = {};

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const { values, setValues, handleBlur, isSubmitting, handleSubmit, setSubmitting } = useFormik({
    initialValues,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? data.map((item) => item.SeqNo) : []);

  const handleClick = (val?: number | string) => {
    if (!val) return;
    const id = Number(val);

    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  const handleBidderSelection = (event: SelectChangeEvent<number | string | boolean>) => setSelectedMineID(event.target.value as number);

  const fetchPurchaseLimit = useCallback(async () => {
    try {
      const params: GetOverallPurchaseLimitParams = {
        eventId,
        bidderId: entityID,
      };
      const res = await OverallPurchaseLimitBidderServices.getOverAllPuchaseLimit(params);
      const fetchEventDetails = await EventServices.getEventById(eventId);

      if (typeof res !== 'string' && res.success) setOverallPurchaseData(res.data);
      if (typeof fetchEventDetails !== 'string' && fetchEventDetails.success) {
        setShowOverAllPurchaseLimit(fetchEventDetails.data.showOverAllPurchaseLimit);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching overall purchase limit data:', error);
      toast.error('Failed to fetch overall purchase limit data');
    }
  }, [entityID, eventId]);

  const fetchData = useCallback(
    async (showLoader = false, forceMineId?: number) => {
      try {
        if (showLoader) setLoading((prev) => ({ ...prev, isProgress: true }));
        const params: GetAllLotsParams = { eventId, entityId: entityID as string, mineId: forceMineId ?? selectedMineIDRef.current ?? 0 };
        const getBidderLotsData = await AllLotsServices.getLots(params);

        if (typeof getBidderLotsData !== 'string' && getBidderLotsData.success) {
          const fetchedData = getBidderLotsData.data;
          setData(fetchedData);
          setIsDataLoaded(true);

          setValues((prevValues) => {
            const updated: LotBidValues = { ...prevValues };

            fetchedData.forEach((item) => {
              const seqNo = item.SeqNo;

              const existing = prevValues[seqNo] || { price: '', total: '' };

              updated[seqNo] = {
                // preserve user input if already typed, else take API value
                price: existing.price !== '' ? existing.price : String(item.bid_value?.toFixed(3) || ''),
                total: existing.total !== '' ? existing.total : String(item.lot_value?.toFixed(3) || ''),
              };
            });

            return updated;
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('An error occurred while fetching bidder lots data:', error);
        toast.error('An error occurred while fetching bidder lots data');
      } finally {
        if (showLoader) setLoading((prev) => ({ ...prev, isProgress: false }));
      }
      // eslint-disable-next-line prettier/prettier
    },
    [entityID, eventId, setValues]
  );

  const fetchParticipateData = useCallback(async () => {
    try {
      const params = { entityId: Number(entityID), companyId: companyID, eventId };
      const res = await MyProfileServices.getOngoingTenders(params);
      if (typeof res !== 'string' && res.success) {
        setEventTenderData(res.data);

        const currentTender = res.data.find((t) => t.EventID === eventId);
        if (currentTender?.isLocked) {
          toast.error('Your access to this event is locked. Logging out...');
          await signOut({ redirect: false });
          router.push('/');
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching basic details:', error);
      toast.error('Failed to fetch basic details');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyID, entityID, eventId]);

  const fetchBasicDetailsData = useCallback(
    async (selectedEventID: number) => {
      try {
        const params: GetAllLotsTotalLotsParams = {
          eventId: selectedEventID,
          entityId: entityID as string,
          eventCategory,
        };

        const basicDetailsData = await AllLotsServices.getBasicDetails(params);
        if (typeof basicDetailsData !== 'string' && basicDetailsData.success) {
          setBasicDetailsLots(basicDetailsData.data);
          if (!isBasicDetailsLoaded) setIsBasicDetailsLoaded(true);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching basic details:', error);
        toast.error('Failed to fetch basic details');
      }
    },
    [entityID, eventCategory, isBasicDetailsLoaded]
  );

  const handleWithdraw = async () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      setSubmitting(false);
      return;
    }

    setWithdrawBidLoading(true);

    const params: DeleteAllLotsParams = {
      eventId,
      entityId: entityID as number,
      stockNos: selected,
    };

    try {
      const res = await AllLotsServices.delete(params);
      if (typeof res !== 'string' && res.success) {
        const updatedValues = { ...values };
        selected.forEach((seqNo) => {
          if (updatedValues[seqNo]) {
            updatedValues[seqNo] = { ...updatedValues[seqNo], price: '', total: '' };
          }
        });
        setValues(updatedValues);

        const updatedData = data.map((item) => (selected.includes(item.SeqNo) ? { ...item, bid_value: 0, lot_value: 0 } : item));
        setData(updatedData);

        setSelected([]);
        fetchBasicDetailsData(eventId);
        toast.success('Selected lots deleted successfully');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while deleting the selected lots', error);
      toast.error('An error occurred while deleting the selected lots');
    } finally {
      setWithdrawBidLoading(false);
    }
  };

  const handleSubmitForm = async (values: LotBidValues) => {
    try {
      const bidDetails: LotDetail[] = Object.entries(values)
        // eslint-disable-next-line no-unused-vars
        .filter(([seqNo, val]) => val?.price !== undefined && val?.price !== null && val?.price !== '')
        .map(([seqNo, val]) => ({
          seqNoEventStock: Number(seqNo),
          bidValue: parseFloat(Number(val.price).toFixed(3)),
          lotValue: parseFloat(Number(val.total).toFixed(3)),
        }));

      const params: AddBidderLotsParams = {
        eventId,
        entityId: entityID as number,
        bidDetails,
      };

      const res = await AllLotsServices.add(params);
      if (typeof res !== 'string' && res.success) {
        const updatedData = data.map((item) => {
          const matchingBid = bidDetails.find((bid) => bid.seqNoEventStock === item.SeqNo);
          return matchingBid ? { ...item, bid_value: matchingBid.bidValue, lot_value: matchingBid.lotValue } : item;
        });
        setData(updatedData);

        const newSubmittedRows = new Set(submittedRows);
        bidDetails.forEach((bid) => newSubmittedRows.add(bid.seqNoEventStock));
        setSubmittedRows(newSubmittedRows);

        const updatedValues = { ...values };

        setValues(updatedValues);
        const totalLotValue = bidDetails.reduce((sum, bid) => sum + bid.lotValue, 0);

        const updatedBasicDetails = basicDetailsLots.map((item) => ({
          ...item,
          Tender_Suubmitted_Bids: item.Tender_Suubmitted_Bids + totalLotValue,
        }));
        setBasicDetailsLots(updatedBasicDetails);

        fetchBasicDetailsData(eventId);
        toast.success('Data submitted successfully');
        if (basicDetailsLots[0]?.EventType === 'Auction') setIsSuccessDialogOpen(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the data', e);
      toast.error('An error occurred while submitting the data');
    } finally {
      setSubmitting(false);
    }
  };

  const recalculateCommitment = useCallback(() => {
    if (!isDataLoaded || !isBasicDetailsLoaded) return;

    const totalLotValue = data.reduce((acc, item) => acc + Number(item.lot_value || 0), 0);
    const totalReserveValueCount = basicDetailsLots.reduce(
      (acc, item) => acc + (item.Tender_Suubmitted_Bids + item.Auction_Winning_BIds || 0),
      0
    );

    let newCommitment = totalLotValue;
    if (eventTenderData[0]?.EventRound == 'Auction')
      newCommitment = eventTenderData[0]?.EventType === 'Mixed' ? totalReserveValueCount : totalLotValue;
    setTotalCommitment(newCommitment || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicDetailsLots, isBasicDetailsLoaded, isDataLoaded]);

  const handleExportExcelClick = async () => {
    const params: GetExcelExportParams = {
      eventId,
      entityId: entityID as number,
      eventCategory: eventCategory === 1 ? 'Rough' : 'Polished',
    };
    handleExcelExport(() => AllLotsServices.exportExcel(params), setLoading, 'isExcelButtonLoading');
  };

  const handleMediaMenuClick = async (lotNo: string) => {
    setImageAndVideoDialog(true);
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));

    const lot = data.find((item) => item.stockNo === lotNo);
    if (lot) setSelectedLot(lot);

    try {
      const res = await UploadLotsServices.fetchImages(eventId, lotNo);

      if (typeof res !== 'string' && res.success && Array.isArray(res.data)) {
        const images = res.data.map((image) => ({
          fileId: image.fileId,
          url: image.url,
          fileType: image.fileType,
          thumbnail: image.thumbnail || image.url,
        }));

        setUploadedImages(images);
      } else setUploadedImages([]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error fetching images.', e);
      toast.error('Error fetching images.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    }
  };

  const handleSendMailClick = async () => {
    setLoading((prev) => ({ ...prev, isSendMailLoading: true }));

    try {
      const res = await AllLotsServices.sendEmail(eventId);
      if (typeof res !== 'string' && res.success) toast.success(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in send mail.', error);
      toast.error('Error in send mail.');
    } finally {
      setLoading((prev) => ({ ...prev, isSendMailLoading: false }));
    }
  };

  useEffect(() => {
    if (isDataLoaded && isBasicDetailsLoaded) {
      const Bcount = basicDetailsLots.find((d) => d.Bcount)?.Bcount || 0;
      setTotalNumberOfBids(data.length - Bcount);
    }
  }, [isDataLoaded, isBasicDetailsLoaded, data, basicDetailsLots]);

  useEffect(() => {
    if (isDataLoaded && isBasicDetailsLoaded) {
      recalculateCommitment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded, data, basicDetailsLots, isBasicDetailsLoaded]);

  useEffect(() => {
    if (!eventId) return;
    fetchMineData();
  }, [eventId, fetchMineData]);

  useEffect(() => {
    selectedMineIDRef.current = selectedMineID;
  }, [selectedMineID]);

  useEffect(() => {
    if (!eventId) return;

    const runFetch = async () => {
      setLoading((prev) => ({ ...prev, isProgress: true }));
      await Promise.all([fetchParticipateData(), fetchData(false, 0)]);
      setLoading((prev) => ({ ...prev, isProgress: false }));

      const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_GET_ONGOING_TENDER_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
      const intervalId = setInterval(async () => {
        await Promise.all([fetchParticipateData(), fetchData(false)]);
      }, intervalTime);

      return () => clearInterval(intervalId);
    };

    runFetch();
  }, [eventId, fetchParticipateData, fetchData]);

  useEffect(() => {
    if (selectedMineID !== null && selectedMineID !== undefined && eventId) {
      fetchData(true);
    }
  }, [eventId, fetchData, selectedMineID]);

  useEffect(() => {
    const runFetch = async () => {
      if (!eventId) return;
      setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      await Promise.all([fetchPurchaseLimit(), fetchBasicDetailsData(eventId)]);
      setLoading((prev) => ({ ...prev, isTimerLoading: false }));
    };

    runFetch();
  }, [eventId, fetchBasicDetailsData, fetchPurchaseLimit]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}
      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <MainCard
          content={false}
          title="All Lots"
          secondary={
            <CardHeaderIconContainer>
              {data.length > 0 && !loading?.isProgress && (
                <>
                  <SmsIcon title="Send Mail" onClick={handleSendMailClick} isLoading={loading?.isSendMailLoading} />
                  {isDownloadAccess && (
                    <DownloadCSVButton
                      title="Export All Lots List Excel"
                      onClick={handleExportExcelClick}
                      isLoading={loading.isExcelButtonLoading}
                    />
                  )}
                </>
              )}
              <PrintIconButton title="Print" onClick={() => window.print()} />
            </CardHeaderIconContainer>
          }
          headerClassName="print-card-hidden-title"
        >
          <AllLotsBidderDetails
            {...{
              data,
              eventTenderData,
              eventId,
              remainingTime,
              totalCommitment,
              totalNumberOfBids,
              showOverAllPurchaseLimit,
              maximumPurchaseLimit: overallPurchaseData?.maximumPurchaseLimit,
              basicDetailsLots,
              loading,
            }}
          />
          <AllLotsTable
            {...{
              isMineLoading,
              eventTenderData,
              data,
              values,
              loading,
              selected,
              mineData,
              pageSize,
              selectedMineID,
              isSubmitting,
              setValues,
              handleBlur,
              editedRows,
              isSelected,
              remainingTime,
              submittedRows,
              setEditedRows,
              eventCategory,
              handleClick,
              handleWithdraw,
              handleSubmitForm,
              handleSelectAllClick,
              handleMediaMenuClick,
              withdrawBidLoading,
              handleSelect: handleBidderSelection,
            }}
          />
        </MainCard>
        <OverallPurchaseLimitInfo
          show={showOverAllPurchaseLimit === 'Yes'}
          loading={loading}
          maximumPurchaseLimit={overallPurchaseData?.maximumPurchaseLimit}
          eventId={eventId}
        />
      </form>
      <ImageAndVideoModel
        open={imageAndVideoDialog}
        handleClose={() => setImageAndVideoDialog(false)}
        uploadedImages={uploadedImages}
        selectedLot={selectedLot}
      />

      <BidSubmissionSuccessDialog
        open={isSuccessDialogOpen}
        handleClose={() => setIsSuccessDialogOpen(false)}
        auctionStartDate={eventTenderData[0]?.Auctionstartdate}
      />
    </>
  );
};

export default AllLotsPage;
