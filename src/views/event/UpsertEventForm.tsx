'use client';
import parseISO from 'date-fns/parseISO';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import EventActionButton from './EventActionButton';
import UpsertEventTitle from './UpsertEventTitle';
import { ViewMainContainer, EventMainConatiner, EventConatinerPoint, EventDatePicker, UpsertEventRevisedContainer } from './Event.styled';
import RevisedTermsAndConditionModel from './RevisedTermsAndConditionModel';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import { StyledSelect } from 'components/UIComponent/ThemeCSS/StyleSelect';
import UIRadioButtonsGroup from 'components/UIComponent/RadioButtonGroup';
import { MultipleOptions } from 'components/UIComponent/type';
import { eventValidationSchema } from 'validations/validationSchemas';
import { EventServices } from 'services/event/event.services';
import { handleFetchData } from 'utils/apiHelpers';
import { formatDateAndTime, formatDurationFromMs } from 'utils/format-date';
import { AUCTION_INCREMENT_OPTIONS, MODULE_TYPE_BOOLEAN_OPTIONS, MODULE_TYPE_OPTIONS, YES_NO_OPTIONS } from 'constants/event.constants';
import { LoadingState } from 'types/table';
import {
  AddEventParams,
  EventByIdData,
  EventOrganizedForData,
  EventTypeData,
  PlatformDisplayData,
  ProductTypeData,
  TermsConditionsData,
} from 'services/event/types';
import CircularLoader from 'components/CircularLoader';
import SettingIconButton from 'components/UIComponent/IconButtons/SettingButton';
import { extractFirstItemValue } from 'utils/extractFirstItemValue';
import AlertDeletetPopup from 'components/UIComponent/AlertDeletetPopup';

const UpsertEventForm = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const eventId = Number(id);

  const [platformDisplayData, setPlatformDisplayData] = useState<PlatformDisplayData[]>([]);
  const [eventTypeData, setEventTypeData] = useState<EventTypeData[]>([]);
  const [productTypeData, setProductTypeData] = useState<ProductTypeData[]>([]);
  const [eventOrganizedForData, setEventOrganizedForData] = useState<EventOrganizedForData[]>([]);
  const [termsConditionsData, setTermsConditionsData] = useState<TermsConditionsData[]>([]);
  const [eventTypeOptions, setEventTypeOptions] = useState<MultipleOptions[]>([]);
  const [productTypeOptions, setProductTypeOptions] = useState<MultipleOptions[]>([]);
  const [isPubliciseDisabled, setIsPubliciseDisabled] = useState(false);
  const [eventData, setEventData] = useState<EventByIdData>();
  const [isStartEventDisabled, setIsStartEventDisabled] = useState(false);
  const [isAuctionDisabled, setIsAuctionDisabled] = useState(false);
  const [isEndEventDisabled, setIsEndEventDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [isRevisedTermsModalOpen, setIsRevisedTermsModalOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    isProgress: false,
    isDeleteLoading: false,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const initialValues: AddEventParams = {
    refcomapnyIdComapanyInfo: 0,
    eventType: 0,
    refEventCategoryIdEventCategoryMas: 0,
    refSellerIdEntityMas: 0,
    refTermsConditionsMstSeqNo: 0,
    isTermsncondition: true,
    startDateTime: new Date().toISOString(),
    endDateTime: null,
    pageSize: 100,
    showSellerLogos: 'No',
    showPurchaseLimit: 'No',
    maxPurchaseLimit: '',
    isPubliciseResultsToBidders: true,
    showReservePrice: false,
    auctionStartDate: null,
    auctionDuration: '15',
    auctionIncrease: 0.5,
    timeEstimation: 3,
    eventDescription: '',
    eventLocation: 'Antwerp',
    helpDeskNumber: '',
    insTerminal: window.location.origin,
    tcTitle: '',
    helpDeskLocation: '',
  };

  const {
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
    handleReset,
    setValues,
    handleSubmit,
    setFieldValue,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: eventValidationSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleChangeEventType = (value: string) => {
    setFieldValue('eventType', Number(value));
  };

  const handleChangeProductType = (value: string) => {
    setFieldValue('refEventCategoryIdEventCategoryMas', value);
    const isPolished = value === '2';
    setIsPubliciseDisabled(isPolished);
    if (isPolished) setFieldValue('isPubliciseResultsToBidders', false);
  };

  const handleChangeTermsconditions = (value: string) => setFieldValue('isTermsncondition', value);

  const handleDisplaySellerLogoChange = (value: string) => setFieldValue('showSellerLogos', value);

  const handlePurchaseLimitChange = (value: string) => setFieldValue('showPurchaseLimit', value);

  const handleChangePublicise = (value: string) => setFieldValue('isPubliciseResultsToBidders', value);

  const handleChangeShowreverse = (value: string) => setFieldValue('showReservePrice', value);

  const handleGetEventById = async (id: number) =>
    await handleFetchData<EventByIdData | undefined>(() => EventServices.getEventById(id), setEventData, setLoading);

  const handleSubmitForm = async (values: AddEventParams) => {
    try {
      const res = eventId
        ? await EventServices.updateEvent({ ...values, maxPurchaseLimit: Number(values.maxPurchaseLimit) || 0, auTen_EvtId: eventId })
        : await EventServices.addEvent({ ...values, maxPurchaseLimit: Number(values.maxPurchaseLimit) || 0 });

      if (typeof res !== 'string' && res.success) {
        push('/events');
        toast.success('Event ' + (eventId ? 'updated' : 'added') + ' successfully');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while saving the Event:', error);
      toast.error('Failed to ' + (eventId ? 'update' : 'add') + ' event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading((prev) => ({ ...prev, isDeleteLoading: true }));
    try {
      const res = await EventServices.eventListDelete(eventId);
      if (typeof res !== 'string' && res.success) {
        toast.success('Event deleted successfully');
        setIsDeleteDialogOpen(false);
        push('/events');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in handleDeleteConfirm:', error);
      toast.error('Failed to delete event');
    } finally {
      setLoading((prev) => ({ ...prev, isDeleteLoading: false }));
    }
  };

  const handleDateChange = (newValue: unknown, fieldName: 'startDateTime' | 'endDateTime') => {
    if (newValue instanceof Date && !isNaN(newValue.getTime())) {
      const updatedValue = new Date(newValue);
      updatedValue.setSeconds(0);
      updatedValue.setMilliseconds(0);
      setFieldValue(fieldName, updatedValue);
    }
  };

  const handleReviseTermsAndCondition = () => setIsRevisedTermsModalOpen(true);

  const initializeEventFormData = async () => {
    try {
      setLoading((prev) => ({ ...prev, isProgress: true }));
      const [platformDisplay, eventType, productType, eventOrganizedFor, termsConditions] = await Promise.all([
        EventServices.getPlatformDisplay(),
        EventServices.getEventType(),
        EventServices.getProductType(),
        EventServices.getEventSellerType('All'),
        EventServices.getTermsConditions(),
      ]);

      if (typeof platformDisplay !== 'string' && platformDisplay.success) setPlatformDisplayData(platformDisplay.data);
      if (typeof eventType !== 'string' && eventType.success) setEventTypeData(eventType.data);
      if (typeof productType !== 'string' && productType.success) setProductTypeData(productType.data);
      if (typeof eventOrganizedFor !== 'string' && eventOrganizedFor.success) setEventOrganizedForData(eventOrganizedFor.data);
      if (typeof termsConditions !== 'string' && termsConditions.success) setTermsConditionsData(termsConditions.data);

      setValues({
        ...values,
        refcomapnyIdComapanyInfo: extractFirstItemValue(platformDisplay, 'CompanyID', 0),
        eventType: extractFirstItemValue(eventType, 'EventTypeID', 0),
        refEventCategoryIdEventCategoryMas: extractFirstItemValue(productType, 'eventcategoryID', 0),
        refSellerIdEntityMas: extractFirstItemValue(eventOrganizedFor, 'sellerId', 0),
        refTermsConditionsMstSeqNo: extractFirstItemValue(termsConditions, 'SeqNo', 0),
        tcTitle: extractFirstItemValue(termsConditions, 'Title', ''),
      });
      setLoading((prev) => ({ ...prev, isProgress: false }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in initializeEventFormData', error);
      setLoading((prev) => ({ ...prev, isProgress: false }));
      toast.error('Failed to fetch event data');
    }
  };

  useEffect(() => {
    initializeEventFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (eventId) handleGetEventById(eventId);
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      setValues({
        ...values,
        refcomapnyIdComapanyInfo:
          eventData?.refcomapnyid_comapanyinfo ?? (platformDisplayData.length > 0 ? platformDisplayData[0].CompanyID : 0),
        eventType: eventData?.refEventTypeID_EventTypeMas ?? (eventTypeData.length > 0 ? eventTypeData[0].EventTypeID : 0),
        refEventCategoryIdEventCategoryMas:
          eventData?.refEventCategoryID_EventCategoryMas ?? (productTypeData.length > 0 ? productTypeData[0].eventcategoryID : 0),
        refSellerIdEntityMas:
          eventData?.refSellerId_EntityMas ?? (eventOrganizedForData.length > 0 ? eventOrganizedForData[0].sellerId : 0),
        refTermsConditionsMstSeqNo:
          eventData?.refTermsConditionsMst_SeqNo ?? (termsConditionsData.length > 0 ? termsConditionsData[0].SeqNo : 0),
        isTermsncondition: eventData?.IsTermsncondition || true,
        startDateTime: eventData?.startDate ? formatDateAndTime(eventData?.startDate) : null,
        endDateTime: eventData?.TenderEndDate ? formatDateAndTime(eventData?.TenderEndDate) : null,
        pageSize: eventData?.PageSize || 100,
        showSellerLogos: eventData?.ShowSellerLogo || 'No',
        showPurchaseLimit: eventData?.showOverAllPurchaseLimit || 'No',
        maxPurchaseLimit: eventData?.MaximumPurchaseLimit || 0,
        isPubliciseResultsToBidders: eventData?.ISPubliciseResultsToBidders || false,
        showReservePrice: eventData?.ShowReservePrice || false,
        auctionStartDate: eventData?.AuctionStartDate ? formatDateAndTime(eventData?.AuctionStartDate) : null,
        auctionDuration: eventData?.AuctionDuration.toString() || '15',
        auctionIncrease: eventData?.AuctionIncrease || 0.5,
        timeEstimation: eventData?.TimeEstimation || 3,
        eventDescription: eventData?.EventDescription || '',
        eventLocation: eventData?.EventLocation || 'Antwerp',
        helpDeskNumber: eventData?.HelpDeskNumber || '',
        tcTitle: eventData?.TCtitle ?? (termsConditionsData.length > 0 ? termsConditionsData[0].Title : ''),
        helpDeskLocation: eventData?.HelpDeskLocation || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  useEffect(() => {
    const eventType = [...eventTypeOptions];
    if (typeof eventTypeData !== 'string' && eventTypeData.length)
      eventTypeData?.map((item) => eventType.push({ id: item.EventTypeID, name: item.EventType }));

    setEventTypeOptions(eventType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTypeData]);

  useEffect(() => {
    const productType = [...productTypeOptions];
    if (typeof productTypeData !== 'string' && productTypeData.length)
      productTypeData?.map((item) => productType.push({ id: item.eventcategoryID, name: item.eventcategory }));

    setProductTypeOptions(productType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeData]);

  useEffect(() => {
    if (!eventId || !values.startDateTime) return;

    const now = new Date();
    const start = new Date(values.startDateTime);

    if (now <= start) setIsStartEventDisabled(false);
    else setIsStartEventDisabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.startDateTime]);

  useEffect(() => {
    if (!eventId || !values.endDateTime) return;

    const now = new Date();
    const start = new Date(values.endDateTime);

    if (now <= start) setIsEndEventDisabled(false);
    else setIsEndEventDisabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.endDateTime]);

  useEffect(() => {
    if (!eventId || !values.auctionStartDate) return;

    const now = new Date();
    const start = new Date(values.auctionStartDate);

    if (now <= start) setIsAuctionDisabled(false);
    else setIsAuctionDisabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.auctionStartDate]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const startTime = eventData?.startDate ? parseISO(eventData.startDate).getTime() : null;
      const endTime = eventData?.TenderEndDate ? parseISO(eventData.TenderEndDate).getTime() : null;
      const auctionStartTime = eventData?.AuctionStartDate ? parseISO(eventData.AuctionStartDate).getTime() : null;
      const auctionEndTime = eventData?.AuctionTimerEndDate ? parseISO(eventData?.AuctionTimerEndDate).getTime() : null;

      if (!startTime || !endTime || !auctionEndTime) {
        setRemainingTime('');
        return;
      }

      const currentTime = new Date().getTime();
      const adjustedCurrentTime = currentTime + 5.5 * 60 * 60 * 1000;

      let newRemainingTime = '';

      if (adjustedCurrentTime < startTime) newRemainingTime = 'Not Open Yet';
      else if (adjustedCurrentTime >= startTime && adjustedCurrentTime < endTime)
        newRemainingTime = formatDurationFromMs(endTime - adjustedCurrentTime);
      else if (auctionStartTime !== null && adjustedCurrentTime >= endTime && adjustedCurrentTime < auctionStartTime) {
        newRemainingTime = formatDurationFromMs(auctionStartTime - adjustedCurrentTime);
      } else if (auctionStartTime !== null && adjustedCurrentTime >= auctionStartTime && adjustedCurrentTime < auctionEndTime) {
        newRemainingTime = formatDurationFromMs(auctionEndTime - adjustedCurrentTime);
      } else {
        newRemainingTime = 'Closed';
      }

      setRemainingTime(newRemainingTime);
    };
    calculateRemainingTime();

    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(intervalId);
  }, [eventData]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {loading.isProgress && <CircularLoader isProgress={loading.isProgress} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <UpsertEventTitle eventId={eventId} remainingTime={remainingTime} loading={loading} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MainCard title="Define Event" content={false}>
                <CardContent>
                  <EventMainConatiner width="100%">
                    <FormControl size="small">
                      <InputLabel>
                        Platform display <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <StyledSelect
                        size="small"
                        id="refcomapnyIdComapanyInfo"
                        name="refcomapnyIdComapanyInfo"
                        value={values.refcomapnyIdComapanyInfo}
                        onChange={handleChange}
                        error={Boolean(errors.refcomapnyIdComapanyInfo) && touched.refcomapnyIdComapanyInfo}
                        disabled={isStartEventDisabled}
                      >
                        {platformDisplayData.map((data, index) => (
                          <MenuItem key={index} value={data.CompanyID}>
                            {data.domainname}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                      {errors.refcomapnyIdComapanyInfo && touched.refcomapnyIdComapanyInfo && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.refcomapnyIdComapanyInfo}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <EventConatinerPoint>
                      <InputLabel>
                        Event type <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <UIRadioButtonsGroup
                        options={eventTypeOptions}
                        defaultValue={values.eventType}
                        onChange={handleChangeEventType}
                        disabled={false}
                      />
                      {errors.eventType && touched.eventType && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.eventType}
                        </FormHelperText>
                      )}
                    </EventConatinerPoint>
                    <EventConatinerPoint>
                      <InputLabel>
                        Product type <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <UIRadioButtonsGroup
                        options={productTypeOptions}
                        defaultValue={values.refEventCategoryIdEventCategoryMas}
                        onChange={handleChangeProductType}
                        disabled={Boolean(eventId) && values.refEventCategoryIdEventCategoryMas === 1}
                      />
                      {errors.refEventCategoryIdEventCategoryMas && touched.refEventCategoryIdEventCategoryMas && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.refEventCategoryIdEventCategoryMas}
                        </FormHelperText>
                      )}
                    </EventConatinerPoint>
                    <FormControl size="small">
                      <InputLabel>
                        Event organised for <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <StyledSelect
                        id="refSellerIdEntityMas"
                        name="refSellerIdEntityMas"
                        value={values.refSellerIdEntityMas}
                        onChange={handleChange}
                        error={touched.refSellerIdEntityMas && Boolean(errors.refSellerIdEntityMas)}
                        disabled={isStartEventDisabled}
                      >
                        <MenuItem value={0}>
                          <em>Select event organised for</em>
                        </MenuItem>
                        {eventOrganizedForData.map((data, index) => (
                          <MenuItem key={index} value={data.sellerId}>
                            {data.sellerName}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                      {errors.refSellerIdEntityMas && touched.refSellerIdEntityMas && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.refSellerIdEntityMas}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <UpsertEventRevisedContainer>
                      <FormControl size="small" sx={{ width: '100%' }}>
                        <InputLabel>
                          Select terms & conditions <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <StyledSelect
                          id="refTermsConditionsMstSeqNo"
                          name="refTermsConditionsMstSeqNo"
                          value={values.refTermsConditionsMstSeqNo}
                          onChange={handleChange}
                          error={touched.refTermsConditionsMstSeqNo && Boolean(errors.refTermsConditionsMstSeqNo)}
                          disabled={isStartEventDisabled}
                        >
                          <MenuItem value={0} onClick={() => setFieldValue('tcTitle', '')}>
                            <em>Select terms & conditions</em>
                          </MenuItem>
                          {termsConditionsData.map((data, index) => (
                            <MenuItem key={index} value={data.SeqNo} onClick={() => setFieldValue('tcTitle', data.Title)}>
                              {data.Title}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                        {errors.refTermsConditionsMstSeqNo && touched.refTermsConditionsMstSeqNo && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.refTermsConditionsMstSeqNo}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <SettingIconButton title="Revise Terms & Conditions" onClick={() => handleReviseTermsAndCondition()} />
                    </UpsertEventRevisedContainer>
                    <EventConatinerPoint>
                      <InputLabel>
                        Show terms & conditions to bidders <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <UIRadioButtonsGroup
                        options={MODULE_TYPE_BOOLEAN_OPTIONS}
                        defaultValue={values.isTermsncondition}
                        onChange={handleChangeTermsconditions}
                        disabled={isStartEventDisabled}
                      />
                      {errors.isTermsncondition && touched.isTermsncondition && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.isTermsncondition}
                        </FormHelperText>
                      )}
                    </EventConatinerPoint>
                    <EventDatePicker>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          label={
                            <Box>
                              Event start date & time <span style={{ color: 'red' }}>*</span>
                            </Box>
                          }
                          value={values.startDateTime ? new Date(values.startDateTime) : new Date()}
                          onChange={(newValue) => handleDateChange(newValue, 'startDateTime')}
                          minDateTime={!isStartEventDisabled ? new Date() : undefined}
                          disablePast
                          readOnly={isStartEventDisabled}
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                              error: Boolean(errors.startDateTime) && touched.startDateTime,
                            },
                          }}
                          sx={{
                            '& .MuiInputLabel-sizeSmall': {
                              lineHeight: '1.4em !important',
                            },
                          }}
                        />
                      </LocalizationProvider>
                      {errors.startDateTime && touched.startDateTime && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.startDateTime}
                        </FormHelperText>
                      )}
                    </EventDatePicker>
                    <EventDatePicker>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          label={
                            <Box>
                              Tender end date & time <span style={{ color: 'red' }}>*</span>
                            </Box>
                          }
                          value={values.endDateTime ? new Date(values.endDateTime) : null}
                          onChange={(newValue) => handleDateChange(newValue, 'endDateTime')}
                          minDateTime={values.startDateTime ? new Date(values.startDateTime) : null}
                          readOnly={isEndEventDisabled}
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                          sx={{
                            '& .MuiInputLabel-sizeSmall': {
                              lineHeight: '1.4em !important',
                            },
                          }}
                        />
                      </LocalizationProvider>
                      {errors.endDateTime && touched.endDateTime && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.endDateTime}
                        </FormHelperText>
                      )}
                    </EventDatePicker>
                    <FormInput
                      id="pageSize"
                      name="pageSize"
                      label="Display limit per page"
                      type="number"
                      value={values.pageSize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isStartEventDisabled}
                      error={touched.pageSize && Boolean(errors.pageSize)}
                      helperText={touched.pageSize ? errors.pageSize : undefined}
                    />
                    <EventConatinerPoint>
                      <InputLabel>Displayed selling company logo</InputLabel>
                      <UIRadioButtonsGroup
                        options={MODULE_TYPE_OPTIONS}
                        defaultValue={values.showSellerLogos}
                        onChange={handleDisplaySellerLogoChange}
                        disabled={false}
                      />
                    </EventConatinerPoint>
                    <EventConatinerPoint>
                      <InputLabel>Purchase limit module</InputLabel>
                      <UIRadioButtonsGroup
                        options={MODULE_TYPE_OPTIONS}
                        defaultValue={values.showPurchaseLimit}
                        onChange={handlePurchaseLimitChange}
                        disabled={isStartEventDisabled}
                      />
                    </EventConatinerPoint>
                    <FormInput
                      id="maxPurchaseLimit"
                      name="maxPurchaseLimit"
                      label="Maximum purchase limit (US$)"
                      type="number"
                      value={values.maxPurchaseLimit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(?=\d)/, '');
                        setFieldValue('maxPurchaseLimit', val);
                      }}
                      onBlur={handleBlur}
                      disabled={values.showPurchaseLimit === 'No' || isStartEventDisabled}
                    />
                    <EventConatinerPoint>
                      <InputLabel>Publish Outcomes to bidders?</InputLabel>
                      <UIRadioButtonsGroup
                        options={YES_NO_OPTIONS}
                        defaultValue={values.isPubliciseResultsToBidders}
                        onChange={handleChangePublicise}
                        disabled={isPubliciseDisabled || isStartEventDisabled}
                      />
                    </EventConatinerPoint>
                    <EventConatinerPoint>
                      <InputLabel>Show reserve price</InputLabel>
                      <UIRadioButtonsGroup
                        options={YES_NO_OPTIONS}
                        defaultValue={values.showReservePrice}
                        onChange={handleChangeShowreverse}
                        disabled={false}
                      />
                    </EventConatinerPoint>
                  </EventMainConatiner>
                </CardContent>
              </MainCard>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <EventMainConatiner>
                <MainCard title="Auction Specific" content={false}>
                  <CardContent>
                    <EventMainConatiner width="100%">
                      <EventDatePicker>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label="Auction start date & time"
                            value={values.auctionStartDate ? new Date(values.auctionStartDate) : null}
                            onChange={(newValue) => setFieldValue('auctionStartDate', newValue)}
                            minDateTime={values.endDateTime ? new Date(values.endDateTime) : null}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            readOnly={isAuctionDisabled}
                            sx={{
                              '& .MuiInputLabel-sizeSmall': {
                                lineHeight: '1.4em !important',
                              },
                            }}
                          />
                        </LocalizationProvider>
                        {errors.auctionStartDate && touched.auctionStartDate && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.auctionStartDate}
                          </FormHelperText>
                        )}
                      </EventDatePicker>
                      <FormInput
                        id="auctionDuration"
                        name="auctionDuration"
                        label="Auction duration (min.)"
                        type="number"
                        value={values.auctionDuration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isAuctionDisabled}
                      />
                      <FormControl size="small">
                        <InputLabel>Incremental auction increase (%)</InputLabel>
                        <StyledSelect id="auctionIncrease" name="auctionIncrease" value={values.auctionIncrease} onChange={handleChange}>
                          {AUCTION_INCREMENT_OPTIONS.map((type, index: number) => (
                            <MenuItem key={index} value={type.id as number}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                      <FormInput
                        id="timeEstimation"
                        name="timeEstimation"
                        label="Last three minutes bidding time extension (min.)"
                        type="number"
                        value={values.timeEstimation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </EventMainConatiner>
                  </CardContent>
                </MainCard>
                <MainCard title="Simultaneous events specific" content={false}>
                  <CardContent>
                    <EventMainConatiner width="100%">
                      <FormInput
                        multiline
                        rows={4}
                        id="eventDescription"
                        name="eventDescription"
                        label="Brief event description"
                        required
                        value={values.eventDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.eventDescription && Boolean(errors.eventDescription)}
                        helperText={touched.eventDescription ? errors.eventDescription : undefined}
                      />
                      <FormInput
                        id="eventLocation"
                        name="eventLocation"
                        label="Event location"
                        value={values.eventLocation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormInput
                        id="helpDeskNumber"
                        name="helpDeskNumber"
                        label="Additional helpdesk number"
                        type="number"
                        value={values.helpDeskNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </EventMainConatiner>
                  </CardContent>
                </MainCard>
              </EventMainConatiner>
            </Grid>
          </Grid>
          <EventActionButton
            isSubmitting={isSubmitting}
            id={eventId}
            handleReset={handleReset}
            remainingTime={remainingTime}
            handleDeleteClick={() => setIsDeleteDialogOpen(true)}
          />
        </ViewMainContainer>
      </form>
      <RevisedTermsAndConditionModel
        open={isRevisedTermsModalOpen}
        handleClose={() => setIsRevisedTermsModalOpen(false)}
        eventId={eventId}
      />
      <AlertDeletetPopup
        open={isDeleteDialogOpen}
        handleClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure want to delete this event?"
        loading={loading}
      />
    </>
  );
};

export default UpsertEventForm;
