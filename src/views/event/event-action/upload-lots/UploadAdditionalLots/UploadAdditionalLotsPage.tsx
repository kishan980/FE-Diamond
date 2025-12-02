'use client';
import { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import parseISO from 'date-fns/parseISO';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import UploadInstructions from '../UploadInstructions';
import { UploadLotsSecondaryContainer, UploadLotsStackContainerButton } from '../UploadLots.styled';
import UploadAdditionalLotsXlxsFile from '../UploadXLSFile/UploadAdditionalLotsXlxsFile';
import UploadLotsCountDownTimer from '../UploadLotsCountDownTimer';
import UploadAdditionalActions from './UploadAdditionalActions';
import UploadAdditionalLotsTableHeader from './UploadAdditionalLotsTableHeader';
import UploadAdditionalLotsStackSelectContainer from './UploadAdditionalLotsStackSelectContainer';
import UploadAdditionalLotsRowComp from './UploadAdditionalLotsRowComp';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import UploadDeleteButton from 'components/UIComponent/IconButtons/UploadDeleteButton';
import { EventServices } from 'services/event/event.services';
import { useTableControls } from 'utils/useTableControls';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { LoadingState } from 'types/table';
import { polishedUploadLotSchema, roughUploadLotSchema } from 'validations/validationSchemas';
import { EventByIdData } from 'services/event/types';
import {
  AddSaveAdditionalLotsParams,
  DeleteLotsParams,
  UploadAdditionalLotsByIdData,
  UploadAdditionalLotsData,
} from 'services/event/event-action/upload-lots/type';
import { checkDownloadAccess } from 'utils/userAccessUtils';
import { handleExcelExport } from 'utils/exportUtils';
import CircularLoader from 'components/CircularLoader';
import { formatDurationFromMs } from 'utils/format-date';
import { useSellerData } from 'hooks/useSellerData';
import { useMinesData } from 'hooks/useMinesData';

const UploadAdditionalLotsPage = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const router = useRouter();
  const { order, orderBy, handleRequestSort } = useTableControls('stockNo');
  const inputRefs = useRef<Array<[HTMLInputElement | null, HTMLInputElement | null]>>([]);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  const [isUploadLotsCSVDialogOpen, setIsUploadLotsCSVDialogOpen] = useState(false);
  const [eventData, setEventData] = useState<EventByIdData>();
  const [remainingTime, setRemainingTime] = useState('');
  const [eventCategoryID, setEventCategoryID] = useState<number>(0);
  const [selectedSellerID, setSelectedSellerID] = useState<string>('');
  const [selectedMineID, setSelectedMineID] = useState<string>('');
  const [selected, setSelected] = useState<number[]>([]);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isTimerLoading: false,
    isDeleteLoading: false,
    isConfirmLoading: false,
    isExcelButtonLoading: false,
  });
  const { sellerData, isSellerLoading, fetchSellerData } = useSellerData();
  const { mineData, isMineLoading, fetchMineData } = useMinesData();

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const initialValuesData = {
    Master: [
      {
        stockNo: '',
        cts: 0,
        rate: 0,
        pcs: 0,
        stockDesc: '',
        Size: '',
        Cut: '',
        Shape: '',
        Colour: '',
        Clarity: '',
        Comment: '',
        refEventTypeID_EventTypeMas: 1,
        SellerID: sellerData.length > 0 ? sellerData[0].sellerId : 0,
        MineID: mineData.length > 0 ? mineData[0].id : 0,
        TransferFlag: '',
      },
    ],
  };

  const { values, errors, touched, handleSubmit, setValues, setSubmitting, isSubmitting, handleChange, handleBlur, setFieldValue } =
    useFormik({
      initialValues: initialValuesData,
      validationSchema: yup.object().shape({
        Master: yup.array().of(
          yup.lazy(() => {
            if (eventCategoryID === 1) return roughUploadLotSchema;
            if (eventCategoryID === 2) return polishedUploadLotSchema;
            return yup.object();
          })
        ),
      }),
      onSubmit: (values) => {
        // eslint-disable-next-line no-use-before-define
        return handleSubmitForm(values.Master);
      },
    });

  const handleRateBlurDecimal = (index: number, name: string) => {
    const numericValue = String(values.Master[index].rate).replace(/^0+/, '');
    const formattedValue = numericValue === '' ? '' : parseFloat(numericValue).toFixed(2);
    setFieldValue(`Master[${index}].${name}`, formattedValue);
  };

  const handleCtsBlurDecimal = (index: number, name: string) => {
    const numericValue = String(values.Master[index].cts).replace(/^0+/, '');
    const formattedValue = numericValue === '' ? '' : parseFloat(numericValue).toFixed(2);
    setFieldValue(`Master[${index}].${name}`, formattedValue);
  };

  const handleSubmitForm = async (values: UploadAdditionalLotsData[]) => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      setSubmitting(false);
      return;
    }

    const updatedValues = values.map((lot) => ({ ...lot, TransferFlag: 'N' }));

    try {
      const params: AddSaveAdditionalLotsParams = {
        eventId,
        lotsData: JSON.stringify({ Master: updatedValues }),
        type: eventCategoryID === 1 ? 'Rough' : 'Polished',
      };
      const res = await UploadLotsServices.addSaveAdditionalLots(params);
      if (typeof res !== 'string' && res.success) {
        toast.success(res?.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the form UploadAdditionalLotsPage', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.checked ? values.Master.map((item, index) => index) : []);

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

    setSelected(newSelected);
  };

  const handleAddRow = () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        lastRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }, 0);

    setFieldValue('Master', [
      ...values.Master,
      {
        stockNo: '',
        cts: 0,
        rate: 0,
        pcs: 0,
        stockDesc: '',
        Size: '',
        Cut: '',
        Shape: '',
        Colour: '',
        Clarity: '',
        Comment: '',
        SellerID: sellerData.length > 0 ? sellerData[0].sellerId : 0,
        MineID: mineData.length > 0 ? mineData[0].id : 0,
        refEventTypeID_EventTypeMas: 1,
      },
    ]);
  };

  const handleGetEventById = useCallback(async (id: number, isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: true }));
      const res = await EventServices.getEventById(id);
      if (typeof res !== 'string' && res.success) {
        setEventCategoryID(res.data.refEventCategoryID_EventCategoryMas);
        setEventData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching event details:', error);
      toast.error('Failed to retrieve event details. Please try again.');
    } finally {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isTimerLoading: false }));
    }
  }, []);

  const handleGetUploadLotsById = useCallback(
    async (id: number, isInitialLoad = false) => {
      if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: true }));
      try {
        const res = await UploadLotsServices.uploadAdditionalLotsById(id);
        if (res && typeof res !== 'string' && res.success) {
          const data = res.data as unknown as UploadAdditionalLotsByIdData[];
          const formattedData = data.map((row) => ({
            stockNo: row.stockNo ?? '',
            cts: row.cts ?? 0,
            rate: row.rate ?? 0,
            pcs: row.pcs ?? 0,
            stockDesc: row.stockDesc ?? '',
            Size: row.Size ?? '',
            Cut: row.Cut ?? '',
            Shape: row.Shape ?? '',
            Colour: row.Colour ?? '',
            Clarity: row.Clarity ?? '',
            Comment: row.Comment ?? '',
            refEventTypeID_EventTypeMas: row.refEventTypeID_EventTypeMas ?? 1,
            SellerID: row.SellerID ?? (sellerData.length > 0 ? sellerData[0].sellerId : 0),
            MineID: row.MineID ?? (mineData.length > 0 ? mineData[0].id : 0),
          })) as UploadAdditionalLotsData[];

          setValues({ Master: formattedData });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching lots data', error);
        toast.error('Error fetching lots data');
      } finally {
        if (isInitialLoad) setLoading((prev) => ({ ...prev, isProgress: false }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventId]
  );

  const handleClickTransferButton = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleDownloadDemoLotsFileClick = () => {
    const eventCategory = eventCategoryID === 1 ? 'Rough' : 'Polished';
    handleExcelExport(() => UploadLotsServices.getDownloadDemoLotsFile(eventCategory), setLoading, 'isExcelButtonLoading');
  };

  const handleTransferClick = async () => {
    setLoading((prev) => ({ ...prev, isConfirmLoading: true }));
    const selectedLotNumbers = values.Master.filter((_, index) => selected.includes(index)).map((lot) => lot.stockNo);

    const validSelectedLotNumbers = selectedLotNumbers.filter((stockNo) => stockNo.trim() !== '');

    const updatedValues = values.Master.map((lot: any) => {
      if (validSelectedLotNumbers.includes(lot.stockNo)) {
        return { ...lot, TransferFlag: 'Y' };
      } else {
        return { ...lot, TransferFlag: 'N' };
      }
    });

    try {
      const params: AddSaveAdditionalLotsParams = {
        eventId,
        lotsData: JSON.stringify({ Master: updatedValues }),
        type: eventCategoryID === 1 ? 'Rough' : 'Polished',
      };
      const res = await UploadLotsServices.addSaveAdditionalLots(params);
      if (typeof res !== 'string' && res.success) {
        const transferRes = await UploadLotsServices.transfterToOngoingEvent(eventId);
        if (typeof transferRes !== 'string' && transferRes.success) {
          toast.success('Upload Additional transfer successfully');
          router.push(`/events/upload-lots/${eventId}`);
          setIsConfirmDialogOpen(false);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the form UploadAdditionalLotsPage', error);
      toast.error('Error during transfer process');
    } finally {
      setLoading((prev) => ({ ...prev, isConfirmLoading: false }));
      setSelected([]);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    setValues((prevValues) => {
      const filteredMaster = prevValues.Master.filter((row, index) => !selected.includes(index));

      return { Master: filteredMaster };
    });

    const selectedLotNumbers = values.Master.filter((id, index) => selected.includes(index)).map((id) => id.stockNo);
    const validSelectedLotNumbers = selectedLotNumbers.filter((stockNo) => stockNo.trim() !== '');

    if (validSelectedLotNumbers.length === 0) {
      setSelected([]);
      setIsDeleteDialogOpen(false);
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
      return;
    }

    const params: DeleteLotsParams = { eventId, lotNumbers: validSelectedLotNumbers };

    try {
      const res = await UploadLotsServices.deleteUploadAdditionalLots(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Upload Additional deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelected([]);
        setValues((prevValues) => ({
          Master: prevValues.Master.filter((lot) => !validSelectedLotNumbers.includes(lot.stockNo)),
        }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the form UploadAdditionalLotsPage', error);
      toast.error('Error during delete process');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const handleDeleteClick = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one lot');
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    checkDownloadAccess(setIsDownloadAccess);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading((prev) => ({ ...prev, isProgress: true }));

      try {
        await Promise.all([
          fetchSellerData('Selected'),
          fetchMineData(),
          eventId ? handleGetUploadLotsById(eventId, false) : Promise.resolve(),
        ]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching all necessary data:', error);
        toast.error('Failed to load all necessary data.');
      } finally {
        setLoading((prev) => ({ ...prev, isProgress: false }));
      }
    };

    fetchAllData();
  }, [eventId, fetchMineData, fetchSellerData, handleGetUploadLotsById]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const startTime = eventData?.startDate ? parseISO(eventData.startDate).getTime() : null;
      const TenderEndDate = eventData?.TenderEndDate ? parseISO(eventData.TenderEndDate).getTime() : null;
      const auctionEndTime = eventData?.AuctionEndDate ? parseISO(eventData.AuctionEndDate).getTime() : null;

      if (!startTime || !TenderEndDate) {
        setRemainingTime('');
        return;
      }

      const currentTime = new Date().getTime();
      const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

      let newRemainingTime = '';
      if (adjustedCurrentTime < startTime) {
        newRemainingTime = 'Not Open Yet';
      } else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < TenderEndDate) {
        newRemainingTime = formatDurationFromMs(TenderEndDate - adjustedCurrentTime);
      } else if (auctionEndTime !== null && adjustedCurrentTime >= TenderEndDate && adjustedCurrentTime < auctionEndTime) {
        newRemainingTime = 'Bid submission period is ongoing';
      } else {
        newRemainingTime = 'Closed';
      }
      setRemainingTime(newRemainingTime);
    };
    calculateRemainingTime();

    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [eventData]);

  useEffect(() => {
    if (!eventId) return;
    handleGetEventById(eventId, true);
    const intervalTime = parseInt(((Number(process.env.NEXT_PUBLIC_UPLOAD_LOTS_FETCH_INTERVAL) || 5) * 1000).toString(), 10);
    const intervalId = setInterval(() => {
      handleGetEventById(eventId, false);
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [eventId, handleGetEventById]);

  if ((loading.isLoading && !loading.isProgress) || !eventCategoryID || !eventData) {
    return <CircularLoader isProgress />;
  }

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      <form onSubmit={handleSubmit}>
        <MainCard
          content={false}
          title={`Upload Additional ${eventCategoryID === 1 ? 'Rough' : 'Polished'} Lots`}
          secondary={
            <UploadLotsSecondaryContainer>
              {isDownloadAccess && values.Master.length > 0 && (
                <DownloadCSVButton
                  title={`Download ${eventCategoryID === 1 ? 'Rough' : 'Polished'} Lots File`}
                  onClick={handleDownloadDemoLotsFileClick}
                  isLoading={loading?.isExcelButtonLoading}
                />
              )}
              <UploadDeleteButton title="Delete" onClick={handleDeleteClick} />
            </UploadLotsSecondaryContainer>
          }
        >
          <UploadLotsStackContainerButton direction="row" spacing={2}>
            <UploadLotsCountDownTimer {...{ eventId, remainingTime, loading }} />
            <UploadAdditionalLotsStackSelectContainer
              isSellerLoading={isSellerLoading}
              isMineLoading={isMineLoading}
              sellerData={sellerData}
              mineData={mineData}
              setUploadLotsCSVOpen={setIsUploadLotsCSVDialogOpen}
              setIsInstructionDialogOpen={setIsInstructionDialogOpen}
              eventCategoryID={eventCategoryID}
              selectedSellerID={selectedSellerID}
              selectedMineID={selectedMineID}
              setSelectedSellerID={setSelectedSellerID}
              setSelectedMineID={setSelectedMineID}
            />
          </UploadLotsStackContainerButton>

          <TableContainer sx={{ maxHeight: 430 }}>
            <Table aria-label="sticky table" size="small" stickyHeader>
              <UploadAdditionalLotsTableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={values.Master.length}
                eventCategoryID={eventCategoryID}
              />
              <TableBody>
                {loading.isProgress || loading.isLoading ? (
                  <LoadingTableRow colSpan={11} />
                ) : values.Master.length > 0 ? (
                  values.Master.map((row, index) => (
                    <UploadAdditionalLotsRowComp
                      key={index}
                      eventCategoryID={eventCategoryID}
                      values={row}
                      errors={errors}
                      touched={touched}
                      labelId={`enhanced-table-checkbox-${index}`}
                      isItemSelected={isSelected(index)}
                      index={index}
                      handleClick={handleClick}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      sellerData={sellerData}
                      mineData={mineData}
                      inputRefs={inputRefs}
                      rowRef={index === values.Master.length - 1 ? lastRowRef : undefined}
                      handleCtsBlurDecimal={handleCtsBlurDecimal}
                      handleRateBlurDecimal={handleRateBlurDecimal}
                      setFieldValue={setFieldValue}
                    />
                  ))
                ) : (
                  <NoDataTableRow colSpan={11} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <UploadAdditionalActions {...{ loading, isSubmitting, handleAddRow, handleClickTransferButton }} />
          <Divider />
        </MainCard>
      </form>

      {/* Dialogs */}
      <UploadInstructions
        open={isInstructionDialogOpen}
        handleClose={() => setIsInstructionDialogOpen(false)}
        eventCategoryID={eventCategoryID}
      />
      <UploadAdditionalLotsXlxsFile
        open={isUploadLotsCSVDialogOpen}
        handleClose={() => setIsUploadLotsCSVDialogOpen(false)}
        eventCatagoryId={eventCategoryID}
        selectedSellerID={selectedSellerID}
        selectedMineID={selectedMineID}
        setLoading={setLoading}
        isLoading={loading.isProgress}
        handleGetUploadLotsById={handleGetUploadLotsById}
      />
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        loading={loading}
        onConfirm={handleTransferClick}
        title="Are you sure you want to transfer the selected lot(s) to the ongoing event?"
      />
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        loading={loading}
        onConfirm={handleDeleteConfirm}
        title="Are you sure want to delete this lot?"
      />
    </>
  );
};

export default UploadAdditionalLotsPage;
