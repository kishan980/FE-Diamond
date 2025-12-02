'use client';
import { useState, useEffect, useCallback, ChangeEvent, useRef, MouseEvent, useMemo } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import { useFormik } from 'formik';
import parseISO from 'date-fns/parseISO';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import UploadLotsActions from './UploadLotsActions';
import UploadInstructions from './UploadInstructions';
import UploadLotsTableHeader from './UploadLotsTableHeader';
import UploadStockDetailModel from './UploadStockDetailModel/UploadStockDetailModel';
import UploadImageAndVideoDialog from './UploadImageAndVideoDialog';
import UploadLotStackSelectContainer from './UploadLotStackSelectContainer';
import { UploadLotsSecondaryContainer, UploadLotsStackContainerButton } from './UploadLots.styled';
import AddLotRowComp from './AddLotRowComp';
import UploadLotsXlxsFile from './UploadXLSFile/UploadLotsXlxsFile';
import UploadLotsCountDownTimer from './UploadLotsCountDownTimer';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import LoginDialog from 'components/UIComponent/Dialogs/LoginDialog/LoginDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DownloadCSVButton from 'components/UIComponent/IconButtons/DownloadCSVButton';
import UploadDeleteButton from 'components/UIComponent/IconButtons/UploadDeleteButton';
import { AuthServices } from 'services/authuser/authuser.services';
import { EventServices } from 'services/event/event.services';
import { useTableControls } from 'utils/useTableControls';
import { UploadLotsServices } from 'services/event/event-action/upload-lots/uploadLots.services';
import { polishedUploadLotSchema, roughUploadLotSchema } from 'validations/validationSchemas';
import { LoadingState } from 'types/table';
import { EventByIdData } from 'services/event/types';
import {
  AddSaveLotsParams,
  DeleteUploadLotsParams,
  FetchLotsImage,
  UpdateGetStockDetailsForExportParams,
  UploadLotsByIdData,
  UploadLotsData,
} from 'services/event/event-action/upload-lots/type';
import { ReCaptchaService } from 'services/reCaptcha/reCaptcha.services';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';
import MoreIcon from 'components/@extended/MoreIcon';
import DocumentActionMenu from 'views/event/DocumentActionMenu';
import { MenuDetails } from 'types/events';
import { EVENT_MENU_ITEMS } from 'constants/event.constants';
import { handleExcelExport } from 'utils/exportUtils';
import { formatDurationFromMs } from 'utils/format-date';
import { useSellerData } from 'hooks/useSellerData';
import { useMinesData } from 'hooks/useMinesData';

const UploadLotsPage = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const pathname = usePathname();
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { username, isDownloadAccess } = imageDetails?.currentUserDetails ?? {};

  const inputRefs = useRef<Array<[HTMLInputElement | null, HTMLInputElement | null]>>([]);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);

  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<FetchLotsImage[]>([]);
  const [isSingleFileDialogOpen, setIsSingleFileDialogOpen] = useState(false);
  const [instructionDialogOpen, setInstructionDialogOpen] = useState(false);
  const [uploadLotsCSVDialogOpen, setUploadLotsCSVDialogOpen] = useState(false);
  const [isUploadImageAndVideoDialogOpen, setIsUploadImageAndVideoDialogOpen] = useState(false);
  // const [mineData, setMineData] = useState<MinesData[]>([]);
  const [eventData, setEventData] = useState<EventByIdData>();
  // const [sellerData, setSellerData] = useState<EventOrganizedForData[]>([]);
  const [moreMenuLotNo, setMoreMenuLotNo] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState('');
  const [eventCategoryID, setEventCategoryID] = useState<number>(0);
  const [selectedSellerID, setSelectedSellerID] = useState<string>('');
  const [selectedMineID, setSelectedMineID] = useState<string>('');
  const [selected, setSelected] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isCircularLoading: false,
    isTimerLoading: false,
    isButtonLoading: false,
    isDeleteLoading: false,
    isConfirmLoading: false,
    isExcelButtonLoading: false,
  });
  const { sellerData, isSellerLoading, fetchSellerData } = useSellerData();
  const { mineData, isMineLoading, fetchMineData } = useMinesData();

  const { order, orderBy, handleRequestSort } = useTableControls('stockNo');

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
        isImageExist: false,
        isLotExist: false,
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
            else if (eventCategoryID === 2) return polishedUploadLotSchema;

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
    setValues({
      Master: [
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
          isImageExist: false,
          isLotExist: false,
        },
      ],
    });
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
        const res = await UploadLotsServices.uploadLotsById(id);
        if (typeof res !== 'string' && res.success) {
          const data = res.data as unknown as UploadLotsByIdData[];
          const formattedData = data.map((row) => ({
            stockNo: row.stockNo ?? '',
            cts: row.cts ?? 0,
            rate: parseFloat(row.rate.toString()).toFixed(2) ?? 0,
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
            isImageExist: row.isImageExist ?? false,
            isLotExist: row.isLotExist ?? false,
          })) as unknown as UploadLotsData[];

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

  const handleClickMoreMenuItemButton = (
    event: MouseEvent<HTMLElement>,
    eventID: number,
    startDate: string,
    endDate: string,
    eventCategoryID: number,
    isAnalysis: boolean,
    TenderEndDate: string,
    AuctionEndDate: string,
    ISAuction: string
  ) => {
    setAnchorElMore(event.currentTarget);
    setMenuDetails({ EventID: eventID, startDate, endDate, eventCategoryID, isAnalysis, TenderEndDate, AuctionEndDate, ISAuction });
  };

  const handleCloseMoreMenu = () => {
    setAnchorElMore(null);
    setMenuDetails(null);
  };

  const filteredMenu = useMemo(() => EVENT_MENU_ITEMS.filter((item) => !pathname.includes(item.path)), [pathname]);

  const handleSubmitForm = async (values: UploadLotsData[]) => {
    if (values.length === 0) {
      toast.warning('No data to submit');
      setSubmitting(false);
      return;
    }

    try {
      const params: AddSaveLotsParams = {
        eventId,
        lotsData: JSON.stringify({ Master: values }),
        type: eventCategoryID === 1 ? 'Rough' : 'Polished',
      };
      const res = await UploadLotsServices.addUploadLots(params);
      if (typeof res !== 'string' && res.success) {
        toast.success(res.data);
        handleGetUploadLotsById(eventId, false);
        setSelected([]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the form UploadLotsPage', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClickMoreMenuButton = async (LotNo: string) => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));
    setMoreMenuLotNo(LotNo);
    setIsUploadImageAndVideoDialogOpen(true);

    try {
      const res = await UploadLotsServices.fetchImages(eventId, LotNo);

      if (typeof res !== 'string' && res.success && Array.isArray(res.data)) {
        const images = res.data.map((image) => ({
          fileId: image.fileId,
          url: image.url,
          fileType: image.fileType,
          thumbnail: image.thumbnail || image.url,
        }));

        setUploadedImages(images);
      } else setUploadedImages([]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching images handleClickMoreMenuButton.', error);
      toast.error('Error fetching images.');
    }
    setLoading((prev) => ({ ...prev, isCircularLoading: false }));
  };

  const handleDownloadDemoLotsFileClick = async () => {
    const eventCategory = eventCategoryID === 1 ? 'Rough' : 'Polished';
    handleExcelExport(() => UploadLotsServices.getDownloadDemoLotsFile(eventCategory), setLoading, 'isExcelButtonLoading');
  };

  const handleExportListOfLotsClick = async () => {
    const params: UpdateGetStockDetailsForExportParams = {
      eventId,
      eventCategory: eventCategoryID === 1 ? 'Rough' : 'Polished',
    };
    handleExcelExport(() => UploadLotsServices.getStockDetailsForExport(params), setLoading, 'isButtonLoading');
  };

  const handleSaveModificationClick = () => {
    const selectedValues = values.Master.filter((row, index) => selected.includes(index));
    if (selectedValues.length === 0) {
      toast.warning('No data selected for submission');
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleLoginModalCilck = async (password: string, setSubmitting: (isSubmitting: boolean) => void, onSuccess: () => void) => {
    try {
      const reCaptchaToken = await ReCaptchaService.generateToken();
      if (!reCaptchaToken) {
        toast.error('ReCaptcha token generation failed. Please try again.');
        setSubmitting(false);
        return;
      }

      const res = await AuthServices.loginUser({
        userName: username,
        password: password,
        token: reCaptchaToken,
      });

      if (typeof res !== 'string' && res.success) {
        const selectedValues = values.Master.filter((row, index) => selected.includes(index));
        await handleSubmitForm(selectedValues);
        onSuccess();
      } else toast.error('Invalid credentials. Please try again.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error logging in handleLoginModalCilck:', error);
      toast.error('An error occurred while logging in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClickSingleFileButton = (LotNo: string) => {
    setIsSingleFileDialogOpen(true);
    setMoreMenuLotNo(LotNo);
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

    const params: DeleteUploadLotsParams = { eventId, stockNo: validSelectedLotNumbers };

    try {
      const res = await UploadLotsServices.deleteUploadLots(params);
      if (typeof res !== 'string' && res.success) {
        toast.success('Selected lots deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelected([]);
        setValues((prevValues) => ({
          Master: prevValues.Master.filter((lot) => !validSelectedLotNumbers.includes(lot.stockNo)),
        }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while submitting the form UploadLotsPage', error);
      toast.error('Error during delete process');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const handleDialogConfirm = () => {
    setIsConfirmDialogOpen(false);
    setIsLoginDialogOpen(true);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading((prev) => ({ ...prev, isProgress: true, isTimerLoading: true }));

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
        setLoading((prev) => ({ ...prev, isProgress: false, isTimerLoading: false }));
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
      if (adjustedCurrentTime < startTime) newRemainingTime = 'Not Open Yet';
      else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < TenderEndDate)
        newRemainingTime = formatDurationFromMs(TenderEndDate - adjustedCurrentTime);
      else if (auctionEndTime !== null && adjustedCurrentTime >= TenderEndDate && adjustedCurrentTime < auctionEndTime) {
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

  if ((loading.isLoading && !loading.isProgress) || !eventData || eventCategoryID === undefined) {
    return <CircularLoader isProgress />;
  }

  return loading.isLoading && !loading.isProgress ? (
    <Loader />
  ) : (
    <>
      {loading.isCircularLoading && <CircularLoader isProgress={loading.isCircularLoading} />}
      <form onSubmit={handleSubmit}>
        <MainCard
          content={false}
          title={`Upload ${eventCategoryID === 1 ? 'Rough' : 'Polished'} Lots`}
          secondary={
            <UploadLotsSecondaryContainer>
              {remainingTime === 'Not Open Yet' && isDownloadAccess && values.Master.length > 0 && (
                <DownloadCSVButton
                  title={`Download ${eventCategoryID === 1 ? 'Rough' : 'Polished'} Lots File`}
                  onClick={handleDownloadDemoLotsFileClick}
                  isLoading={loading.isExcelButtonLoading}
                />
              )}
              {remainingTime === 'Not Open Yet' && (
                <UploadDeleteButton
                  title="Delete Lots"
                  onClick={() => (selected.length > 0 ? setIsDeleteDialogOpen(true) : toast.warning('Please select at least one lot'))}
                />
              )}
              {!loading?.isProgress && (
                <IconButton
                  edge="end"
                  aria-label="comments"
                  color="secondary"
                  onClick={(e) =>
                    handleClickMoreMenuItemButton(
                      e,
                      eventData?.auTen_EvtId || 0,
                      eventData?.startDate || '',
                      eventData?.EndDate || '',
                      eventData?.refEventCategoryID_EventCategoryMas || 0,
                      eventData?.IsAnalysing || false,
                      eventData?.TenderEndDate || '',
                      eventData?.AuctionEndDate || '',
                      eventData?.ISAuction || ''
                    )
                  }
                >
                  <MoreIcon />
                </IconButton>
              )}
            </UploadLotsSecondaryContainer>
          }
        >
          <UploadLotsStackContainerButton gap={1}>
            <UploadLotsCountDownTimer {...{ eventId, remainingTime, loading }} />
            <UploadLotStackSelectContainer
              isSellerLoading={isSellerLoading}
              isMineLoading={isMineLoading}
              eventId={eventId}
              remainingTime={remainingTime}
              eventCategoryID={eventCategoryID}
              sellerData={sellerData}
              mineData={mineData}
              setIsInstructionDialogOpen={setInstructionDialogOpen}
              setUploadLotsCSVOpen={setUploadLotsCSVDialogOpen}
              handleExportListOfLotsClick={handleExportListOfLotsClick}
              handleSaveModificationClick={handleSaveModificationClick}
              selectedSellerID={selectedSellerID}
              selectedMineID={selectedMineID}
              setSelectedSellerID={setSelectedSellerID}
              setSelectedMineID={setSelectedMineID}
              isLoading={loading}
            />
          </UploadLotsStackContainerButton>

          <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 430 }}>
            <Table aria-label="sticky table" size="small" stickyHeader>
              <UploadLotsTableHeader
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
                  <LoadingTableRow colSpan={12} />
                ) : values.Master.length > 0 ? (
                  values.Master.map((row, index) => (
                    <AddLotRowComp
                      rowRef={index === values.Master.length - 1 ? lastRowRef : undefined}
                      key={index}
                      dataIndex={index}
                      labelId={`enhanced-table-checkbox-${index}`}
                      isItemSelected={isSelected(index)}
                      inputRefs={inputRefs}
                      eventCategoryID={eventCategoryID}
                      values={row}
                      handleClick={handleClick}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      handleClickSingleFileButton={handleClickSingleFileButton}
                      handleRateBlurDecimal={handleRateBlurDecimal}
                      handleCtsBlurDecimal={handleCtsBlurDecimal}
                      handleClickMoreMenuButton={handleClickMoreMenuButton}
                      sellerData={sellerData}
                      mineData={mineData}
                      setFieldValue={setFieldValue}
                    />
                  ))
                ) : (
                  <NoDataTableRow colSpan={12} padding />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <UploadLotsActions isSubmitting={isSubmitting} handleAddRow={handleAddRow} eventId={eventId} remainingTime={remainingTime} />
          <Divider />
        </MainCard>
      </form>
      <UploadStockDetailModel
        open={isSingleFileDialogOpen}
        handleClose={() => setIsSingleFileDialogOpen(false)}
        moreMenuLotNo={moreMenuLotNo}
        setLoading={setLoading}
        loading={loading}
      />
      <UploadInstructions
        open={instructionDialogOpen}
        handleClose={() => setInstructionDialogOpen(false)}
        eventCategoryID={eventCategoryID}
      />
      <UploadLotsXlxsFile
        open={uploadLotsCSVDialogOpen}
        handleClose={() => setUploadLotsCSVDialogOpen(false)}
        eventCatagoryId={eventCategoryID}
        selectedSellerID={selectedSellerID}
        selectedMineID={selectedMineID}
        setLoading={setLoading}
        isLoading={loading.isProgress}
        handleGetUploadLotsById={handleGetUploadLotsById}
      />
      <UploadImageAndVideoDialog
        open={isUploadImageAndVideoDialogOpen}
        handleClose={() => setIsUploadImageAndVideoDialogOpen(false)}
        moreMenuLotNo={moreMenuLotNo}
        uploadedImages={uploadedImages}
        handleGetUploadLotsById={handleGetUploadLotsById}
      />
      <LoginDialog open={isLoginDialogOpen} handleClose={() => setIsLoginDialogOpen(false)} handleLoginModalCilck={handleLoginModalCilck} />
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDialogConfirm}
        title="Please note that the tender is ongoing. Are you sure that you want to modify these data?"
      />
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        title="Are you sure want to delete this lot?"
      />
      <DocumentActionMenu
        open={Boolean(anchorElMore)}
        anchorElMoreMenu={anchorElMore}
        moreMenuEventID={menuDetails?.EventID}
        moreMenuStartDate={menuDetails?.startDate}
        moreMenuEndDate={menuDetails?.endDate}
        eventCategories={menuDetails?.eventCategoryID}
        eventOutcomesUrl={menuDetails?.isAnalysis}
        handleCloseMoreMenuButton={handleCloseMoreMenu}
        detailPageMoreMenuItems={filteredMenu}
        moreMenuTenderEndDate={menuDetails?.TenderEndDate}
        moreMenuAuctionEndDate={menuDetails?.AuctionEndDate}
        moreMenuIsAuction={menuDetails?.ISAuction}
      />
    </>
  );
};

export default UploadLotsPage;
