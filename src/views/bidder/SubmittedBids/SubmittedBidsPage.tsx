'use client';
import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { SelectChangeEvent } from '@mui/material/Select';
import OverallPurchaseLimitInfo from '../OverallPurchaseLimit/OverallPurchaseLimitInfo';
import SubmittedBidsTable from './SubmittedBidsTable';
import SubmittedBidsDetails from './SubmittedBidsDetails';
import SubmittedBidsSelectAndActions from './SubmittedBidsSelectAndActions';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';
import { CardHeaderIconContainer } from 'views/common.styled';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import { EventServices } from 'services/event/event.services';
import { AllLotsServices } from 'services/bidder/all-lots/allLots.services';
import { SubmittedBidsServices } from 'services/bidder/submitted-bids/submittedBids.services';
import { LotBidValues, LoadingState } from 'types/table';
import { GetSubmittedBidsData, GetSubmittedBidsParams } from 'services/bidder/submitted-bids/type';
import {
  AddBidderLotsParams,
  DeleteAllLotsParams,
  GetAllLotsData,
  GetAllLotsTotalLotsData,
  GetAllLotsTotalLotsParams,
  LotDetail,
} from 'services/bidder/all-lots/type';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { FetchLotsImage } from 'services/event/event-action/upload-lots/type';
import PrintLogo from 'components/logo/PrintLogo';
import { GetOverallPurchaseLimitData, GetOverallPurchaseLimitParams } from 'services/bidder/overall-purchase-limit/type';
import { OverallPurchaseLimitBidderServices } from 'services/bidder/overall-purchase-limit/overallPurchaseLimit.services';
import SmsIcon from 'components/UIComponent/IconButtons/SmsButton/SmsIcon';
import { handleExcelExport } from 'utils/exportUtils';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import ImageAndVideoModel from 'components/UIComponent/ImageAndVideoModel';
import { useRemainingTime } from 'hooks/useRemainingTime';
import { useMinesData } from 'hooks/useMinesData';
import CircularLoader from 'components/UIComponent/CircularLoader';

const SubmittedBidsPage = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const eventId = Number(id);
  const router = useRouter();

  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID, eventCategory, companyID, validForAuction, eventRound, eventType, isDownloadAccess } =
    imageDetails?.currentUserDetails ?? {};

  const [withdrawBidLoading, setWithdrawBidLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedMineID, setSelectedMineID] = useState(0);
  const [basicDetailsLots, setBasicDetailsLots] = useState<GetAllLotsTotalLotsData[]>([]);
  const [data, setData] = useState<GetSubmittedBidsData[]>([]);
  const [totalCommitment, setTotalCommitment] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isBasicDetailsLoaded, setIsBasicDetailsLoaded] = useState(false);
  const [isEventTenderDetailsLoaded, setIsEventTenderDetailsLoaded] = useState(false);
  const [totalNumberOfBids, setTotalNumberOfBids] = useState(0);
  const [imageAndVideoDialog, setImageAndVideoDialog] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<FetchLotsImage[]>([]);
  const [selectedLot, setSelectedLot] = useState<GetAllLotsData | null>(null);
  const [overallPurchaseData, setOverallPurchaseData] = useState<GetOverallPurchaseLimitData>();
  const [showOverAllPurchaseLimit, setShowOverAllPurchaseLimit] = useState<string>('');
  const [eventTenderData, setEventTenderData] = useState<GetViewParticipateData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isTimerLoading: false,
    isCircularLoading: false,
    isSendMailLoading: false,
    isExcelButtonLoading: false,
  });
  const remainingTime = useRemainingTime(eventTenderData);
  const { mineData, isMineLoading, fetchMineData } = useMinesData();

  const TotalLotValue = data.reduce((acc, item) => acc + Number(item.lot_value), 0);
  const totalReserveValueCount = basicDetailsLots.reduce((acc, item) => acc + (item.Tender_Suubmitted_Bids + item.Auction_Winning_BIds), 0);

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const initialValues: LotBidValues = {};

  const { values, setValues, handleBlur, isSubmitting, handleSubmit, setSubmitting } = useFormik({
    initialValues,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? data.map((item) => item?.SeqNo) : []);

  const handleClick = (val?: string | number) => {
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

  const fetchParticipateData = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      const params = { entityId: Number(entityID), companyId: companyID, eventId };
      const res = await MyProfileServices.getOngoingTenders(params);
      if (typeof res !== 'string' && res.success) {
        setEventTenderData(res.data);
        if (isInitialLoad && !isEventTenderDetailsLoaded) setIsEventTenderDetailsLoaded(true);

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
    } finally {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: false }));
    }
  };

  const fetchData = useCallback(
    async (selectedEventID: number) => {
      try {
        const params: GetSubmittedBidsParams = { eventId: selectedEventID, entityId: entityID as string, mineId: selectedMineID };
        const getBidderLotsData = await SubmittedBidsServices.getSubmittedBids(params);

        if (typeof getBidderLotsData !== 'string' && getBidderLotsData.success) {
          const fetchedData = getBidderLotsData.data;
          setData(fetchedData);
          setIsDataLoaded(true);

          const initialFormValues: LotBidValues = {};

          fetchedData.forEach((item) => {
            initialFormValues[item?.SeqNo] = {
              price: String(item.bid_value?.toFixed(3) || ''),
              total: String(item.lot_value?.toFixed(3) || ''),
            };
          });
          setValues(initialFormValues);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in fetching bidder lots data.', error);
        toast.error('An error occurred while fetching bidder lots data');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMineID]
  );

  const handleBidderSelection = (event: SelectChangeEvent<number | string | boolean>) => setSelectedMineID(event.target.value as number);

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

    const params: DeleteAllLotsParams = { eventId, entityId: entityID as number, stockNos: selected };

    try {
      const res = await AllLotsServices.delete(params);
      if (typeof res !== 'string' && res.success) {
        setData((prevData) => prevData.filter((item) => !selected.includes(item?.refSeqNo_EventStock)));
        const updatedValues = { ...values };
        selected.forEach((seqNo) => {
          if (updatedValues[seqNo]) {
            updatedValues[seqNo] = { ...updatedValues[seqNo], price: '', total: '' };
          }
        });

        setValues(updatedValues);
        toast.success('Selected lots deleted successfully');
        setSelected([]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while deleting the selected lots', error);
      toast.error('An error occurred while deleting the selected lots');
    } finally {
      setWithdrawBidLoading(false);
    }
  };

  const recalculateCommitment = (updatedData: GetSubmittedBidsData[], updatedBasicDetails: GetAllLotsTotalLotsData[]) => {
    const totalLotValue = updatedData.reduce((acc, item) => acc + Number(item.lot_value || 0), 0);
    const totalReserveValueCount = updatedBasicDetails.reduce(
      (acc, item) => acc + (item.Tender_Suubmitted_Bids + item.Auction_Winning_BIds || 0),
      0
    );

    let newCommitment = totalLotValue;
    if (validForAuction && eventRound === 'Auction')
      newCommitment = eventTenderData[0]?.EventType === 'Mixed' ? totalReserveValueCount : totalLotValue;
    setTotalCommitment(newCommitment || 0);
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

      const params: AddBidderLotsParams = { eventId, entityId: entityID as number, bidDetails };

      const res = await AllLotsServices.add(params);

      if (typeof res !== 'string' && res.success) {
        const updatedData = data.map((item) => {
          const matchingBid = bidDetails.find((bid) => bid.seqNoEventStock === item?.SeqNo);
          return matchingBid ? { ...item, bid_value: matchingBid.bidValue, lot_value: matchingBid.lotValue } : item;
        });
        setData(updatedData);
        const updatedBasicDetails = basicDetailsLots.map((item) => ({
          ...item,
          Tender_Suubmitted_Bids: item.Tender_Suubmitted_Bids + bidDetails.length,
        }));
        setBasicDetailsLots(updatedBasicDetails);
        recalculateCommitment(updatedData, updatedBasicDetails);
        toast.success('Data submitted successfully');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the data', e);
      toast.error('An error occurred while submitting the data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcelClick = () => {
    const eventCategoryType = eventCategory === 1 ? 'Rough' : 'Polished';
    handleExcelExport(() => SubmittedBidsServices.exportExcel(eventId, entityID, eventCategoryType, 0), setLoading, 'isExcelButtonLoading');
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
      } else {
        setUploadedImages([]);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in handleMediaMenuClick.', e);
      toast.error('Error fetching images.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    }
  };

  const handleSendMailClick = async () => {
    setLoading((prev) => ({ ...prev, isSendMailLoading: true }));

    try {
      const res = await SubmittedBidsServices.sendEmail(eventId);
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
    if (isDataLoaded && isBasicDetailsLoaded) setTotalNumberOfBids(data.length);
  }, [isDataLoaded, isBasicDetailsLoaded, data, basicDetailsLots]);

  useEffect(() => {
    if (isDataLoaded && isBasicDetailsLoaded) {
      let newCommitment = TotalLotValue;
      if (validForAuction && eventRound === 'Auction') newCommitment = eventType === 'Mixed' ? totalReserveValueCount : TotalLotValue;
      setTotalCommitment(newCommitment || 0);
    }
  }, [TotalLotValue, eventRound, eventType, isBasicDetailsLoaded, isDataLoaded, totalReserveValueCount, validForAuction]);

  useEffect(() => {
    fetchMineData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const runFetch = async () => {
      if (!eventId) return;
      setLoading((prev) => ({ ...prev, isProgress: true }));
      await Promise.all([fetchData(eventId), fetchPurchaseLimit(), fetchBasicDetailsData(eventId)]);
      setLoading((prev) => ({ ...prev, isProgress: false }));
    };

    runFetch();
  }, [eventId, fetchBasicDetailsData, fetchData, fetchPurchaseLimit]);

  useEffect(() => {
    if (!eventId) return;
    fetchParticipateData(true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_GET_ONGOING_TENDER_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      fetchParticipateData(false);
    }, intervalTime);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}

      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <MainCard
          content={false}
          title="Submitted Bids"
          secondary={
            <CardHeaderIconContainer>
              {data.length > 0 && !loading?.isProgress && (
                <>
                  <SmsIcon title="Send Mail" onClick={handleSendMailClick} isLoading={loading?.isSendMailLoading} />
                  {isDownloadAccess && (
                    <DownloadCSVButton title="Export Excel" onClick={handleExportExcelClick} isLoading={loading.isExcelButtonLoading} />
                  )}
                </>
              )}
              <PrintIconButton title="Print" onClick={() => window.print()} />
            </CardHeaderIconContainer>
          }
          headerClassName="print-card-hidden-title"
        >
          <SubmittedBidsDetails
            {...{
              eventId,
              data,
              remainingTime,
              totalCommitment,
              totalNumberOfBids,
              loading,
              showOverAllPurchaseLimit,
              maximumPurchaseLimit: overallPurchaseData?.maximumPurchaseLimit,
              basicDetailsLots,
              eventTenderData,
            }}
          />
          <SubmittedBidsSelectAndActions
            {...{
              id: 'mine-select',
              mineData,
              selectedMineID,
              isMineLoading,
              handleSelect: handleBidderSelection,
              isSubmitting,
              handleWithdraw,
              data,
              remainingTime,
              withdrawBidLoading,
              loading,
            }}
          />
          <SubmittedBidsTable
            {...{
              eventTenderData,
              data,
              values,
              loading,
              selected,
              setValues,
              handleBlur,
              isSelected,
              handleClick,
              eventCategory,
              handleSelectAllClick,
              remainingTime,
              handleSubmitForm,
              handleMediaMenuClick,
            }}
          />
        </MainCard>
        <OverallPurchaseLimitInfo
          {...{
            show: showOverAllPurchaseLimit === 'Yes',
            loading,
            maximumPurchaseLimit: overallPurchaseData?.maximumPurchaseLimit,
            eventId,
          }}
        />
      </form>
      <ImageAndVideoModel
        open={imageAndVideoDialog}
        handleClose={() => setImageAndVideoDialog(false)}
        uploadedImages={uploadedImages}
        selectedLot={selectedLot}
      />
    </>
  );
};

export default SubmittedBidsPage;
