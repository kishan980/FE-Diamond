'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import TablePagination from '@mui/material/TablePagination';
import { Eye, EyeSlash } from 'iconsax-react';
import LegalDocumentTableBody from '../LegalDocumentTable/LegalDocumentTableBody';
import LegalDocumentTableHeader from '../LegalDocumentTable/LegalDocumentTableHeader';
import { InputWithHelperAction } from '../CommonAccount.styled';
import { RoughBidderStatusConatinerPoint } from './RoughBidder.styled';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import countries from 'data/countries';
import FormInput from 'components/UIComponent/FormInput';
import CountrySelect from 'components/UIComponent/CountrySelect';
import CountryCodeSelect from 'components/UIComponent/CountryCodeSelect';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import RefreshIconButton from 'components/UIComponent/IconButtons/RefreshButton';
import UIRadioButtonsGroup from 'components/UIComponent/RadioButtonGroup';
import UpsertTitleContainer from 'components/UIComponent/UpsertTitleContainer';
import { roughBidderSchema } from 'validations/validationSchemas';
import { UpsertSellingGridLeftCountryCode } from 'views/parameter/SellingCompany/SellingCompany.styled';
import { ViewMainContainer, EventMainConatiner } from 'views/event/Event.styled';
import { useTableControls } from 'utils/useTableControls';
import { handleGeneratePassword } from 'utils/passwordUtils';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { checkUsernameAvailability } from 'utils/checkUsernameAvailability';
import { BIDDER_STATUS_OPTIONS } from 'constants/polishedBidder.constants';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { CountryType } from 'types/country';
import { LoadingState } from 'types/table';
import { SellingByIdData } from 'services/parameter/sellingCompany/type';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';
import {
  UploadedFile,
  RoughBiddersDocumentList,
  AddRoughbiddersParams,
  RoughbiddersUploadImagesParams,
  RoughbiddersUploadPayload,
} from 'services/account/roughBidders/type';
import CircularLoader from 'components/CircularLoader';
import PrintLogo from 'components/logo/PrintLogo';
import { checkPasswordProtection } from 'utils/userAccessUtils';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';

const UpsertRoughBiddersForm = () => {
  const { push } = useRouter();
  const { id: roughBiddersId } = useParams();
  const roughBiddersNumberId = Number(roughBiddersId);

  const [roughBiddersData, setRoughBiddersData] = useState<SellingByIdData>();
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentData, setDocumentData] = useState<RoughBiddersDocumentList[]>([]);
  const [generatePassword, setGeneratePassword] = useState('');
  const [selectMobileCountry1, setSelectMobileCountry1] = useState<CountryType | null>(null);
  const [selectMobileCountry2, setSelectMobileCountry2] = useState<CountryType | null>(null);
  const [selectCountry, setSelectCountry] = useState<CountryType | null>(null);
  const [selectCountryTel, setSelectCountryTel] = useState<CountryType | null>(null);
  const [selectCountryFax, setSelectCountryFax] = useState<CountryType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmModelTitle, setConfirmModelTitle] = useState('');

  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('seqno');

  const initialValues = {
    companyName: '',
    address: '',
    address1: '',
    city: '',
    country: '',
    postCode: '',
    website: '',
    contactPerson: '',
    contactPerson1: '',
    username: '',
    email: '',
    email1: '',
    telCountry: '',
    telephoneNumber: '',
    countryCode: '',
    mobileNumber: '',
    countryCode1: '',
    mobileNumber1: '',
    faxCountry1: '',
    faxNo: '',
    isActive: 1,
    terminal: '',
    password: generatePassword || '',
    confirmpassword: generatePassword || '',
    notes: '',
    accountCode: '',
    docDetails: '',
  };

  const isImageUploadPayload = (response: string | RoughbiddersUploadPayload): response is RoughbiddersUploadPayload => {
    return (response as RoughbiddersUploadPayload).url !== undefined;
  };

  const handleSubmitForm = async (values: AddRoughbiddersParams) => {
    try {
      const uploadPromises = uploadedFiles.map((file) => {
        const params: RoughbiddersUploadImagesParams = { file: file.file, oldFile: null, docId: file.id };

        return RoughBiddersServices.uploadImage(params).then((response) => {
          if (isImageUploadPayload(response)) return { id: file.id, val: response.url, title: file.title };
          else throw new Error('Invalid upload response');
        });
      });

      const uploadedResults = await Promise.all(uploadPromises);

      const unuploadedFiles = documentData
        .filter((row) => !uploadedFiles.find((file) => file.id === row.seqno))
        .map((row) => ({ id: row.seqno, val: null, title: row.doctitle }));

      const allFiles = [...uploadedResults, ...unuploadedFiles];

      values.docDetails = JSON.stringify(allFiles);

      const res = roughBiddersNumberId
        ? await RoughBiddersServices.update({ ...values, id: roughBiddersNumberId })
        : await RoughBiddersServices.add(values);

      if (typeof res !== 'string' && res.success) {
        toast.success('Rough Bidder ' + (roughBiddersId ? 'updated' : 'added') + ' successfully');
        push('/account/rough-bidders');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting:', error);
      toast.error('Error submitting.');
    } finally {
      // eslint-disable-next-line no-use-before-define
      setSubmitting(false);
    }
  };

  const getStatusConfirmMessage = (currentStatus: number, newStatus: number): string | null => {
    return currentStatus === -1 && newStatus === 0
      ? 'Are you sure you want to inactivate this blacklisted bidder?'
      : currentStatus === -1 && newStatus === 1
        ? 'Are you sure you want to reactivate this blacklisted bidder?'
        : currentStatus === 0 && newStatus === -1
          ? 'Are you sure you want to blacklist this bidder?'
          : null;
  };

  const handleOpenConfirmModel = (values: AddRoughbiddersParams) => {
    const currentStatus = Number(roughBiddersData?.isActive);
    const newStatus = Number(values.isActive);
    const message = getStatusConfirmMessage(currentStatus, newStatus);

    if (roughBiddersNumberId && values.password !== roughBiddersData?.Password) {
      setIsConfirmDialogOpen(true);
      setConfirmModelTitle('Are you sure you want to change password?');
    } else if (roughBiddersNumberId && message) {
      setIsConfirmDialogOpen(true);
      setConfirmModelTitle(message);
    } else {
      handleSubmitForm(values);
    }
  };

  const {
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
    handleReset,
    handleSubmit,
    setValues,
    setFieldValue,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: roughBidderSchema(roughBiddersNumberId, isPassword),
    onSubmit: (values) => {
      if (roughBiddersNumberId) {
        handleOpenConfirmModel(values);
      } else {
        handleSubmitForm(values);
      }
    },
  });

  const handleCheckAvailability = async () =>
    await checkUsernameAvailability(values.username, RoughBiddersServices.checkUsername, setLoading);

  const handleChangeMobileCountry1 = (value: CountryType | null) => {
    setSelectMobileCountry1(value);
    setFieldValue('countryCode', value?.phone || '');
  };

  const handleChangeMobileCountry2 = (value: CountryType | null) => {
    setSelectMobileCountry2(value);
    setFieldValue('countryCode1', value?.phone || '');
  };

  const handleChangeCountry = (value: CountryType | null) => {
    setSelectCountry(value);
    setFieldValue('country', value?.label || '');
  };

  const handleChangeCountryTel = (value: CountryType | null) => {
    setSelectCountryTel(value);
    setFieldValue('telCountry', value?.phone || '');
  };

  const handleChangeCountryFax = (value: CountryType | null) => {
    setSelectCountryFax(value);
    setFieldValue('faxCountry1', value?.phone || '');
  };

  const handleChangeStatus = (value: string) => setFieldValue('isActive', value);

  const handlePasswordGeneration = () => handleGeneratePassword(setGeneratePassword, setValues);

  const handleFileChange = (row: number | RoughBiddersDocumentList, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files?.length > 0 && typeof row !== 'number') {
        const [file] = files;
        const updatedFile: UploadedFile = { id: row.seqno, title: row.doctitle, file: file };

        setUploadedFiles((prev) => {
          const existingIndex = prev.findIndex((f) => f.id === row.seqno);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = updatedFile;
            return updated;
          }
          return [...prev, updatedFile];
        });
      }
    }
  };

  const handleGetRoughbiddersById = async (id: number) => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));
    try {
      const res = await SellingCompanyServices.getById(id);
      if (typeof res !== 'string' && res.success) setRoughBiddersData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      toast.error('Error fetching data.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    }
  };

  const handleAutogenerateUsername = async () => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));

    try {
      const res = await RoughBiddersServices.autoGenerateUsername();
      if (typeof res !== 'string' && res.success) {
        setFieldValue('username', res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating username:', error);
      toast.error('Error generating username');
    }
    setLoading((prev) => ({ ...prev, isCircularLoading: false }));
  };

  const handelRoughBiddersDocumentList = async () => {
    try {
      const res = await RoughBiddersServices.roughBiddersDocumentList();
      if (typeof res !== 'string' && res.success) setDocumentData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching document data:', error);
      toast.error('Error fetching document data.');
    }
  };

  const handleDialogConfirm = () => {
    setIsConfirmDialogOpen(false);
    handleSubmitForm(values);
  };

  const handleCloseModel = () => {
    setSubmitting(false);
    setIsConfirmDialogOpen(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading((prev) => ({ ...prev, isProgress: true }));
      checkPasswordProtection(setIsPassword);
      if (!roughBiddersNumberId) handelRoughBiddersDocumentList();
      setLoading((prev) => ({ ...prev, isProgress: false }));
      handleAutogenerateUsername();
    };
    fetchInitialData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roughBiddersNumberId) handleGetRoughbiddersById(roughBiddersNumberId);
  }, [roughBiddersNumberId]);

  useEffect(() => {
    if (roughBiddersId) {
      setValues({
        ...values,
        companyName: roughBiddersData?.co_name || '',
        address: roughBiddersData?.co_add1 || '',
        address1: roughBiddersData?.co_add2 || '',
        city: roughBiddersData?.co_city || '',
        country: roughBiddersData?.co_country || '',
        postCode: roughBiddersData?.co_zip || '',
        website: roughBiddersData?.co_website || '',
        contactPerson: roughBiddersData?.contactPerson || '',
        contactPerson1: roughBiddersData?.contactPerson2 || '',
        username: roughBiddersData?.user_name || '',
        password: roughBiddersData?.Password || '',
        confirmpassword: roughBiddersData?.Password || '',
        email: roughBiddersData?.emailID1 || '',
        email1: roughBiddersData?.emailID2 || '',
        telCountry: roughBiddersData?.phoneCountry1 || '',
        telephoneNumber: roughBiddersData?.phoneno1 || '',
        countryCode: roughBiddersData?.mobileCountry1 || '',
        mobileNumber: roughBiddersData?.mobileno1 || '',
        countryCode1: roughBiddersData?.mobileCountry2 || '',
        mobileNumber1: roughBiddersData?.mobileno2 || '',
        faxCountry1: roughBiddersData?.faxCountry1 || '',
        faxNo: roughBiddersData?.faxno1 || '',
        isActive: Number(roughBiddersData?.isActive),
        notes: roughBiddersData?.notes || '',
        accountCode: roughBiddersData?.Accountcode || '',
      });
      setSelectMobileCountry1(countries.find((val) => val.phone === roughBiddersData?.mobileCountry1) || null);
      setSelectMobileCountry2(countries.find((val) => val.phone === roughBiddersData?.mobileCountry2) || null);
      setSelectCountryTel(countries.find((val) => val.phone === roughBiddersData?.phoneCountry1) || null);
      setSelectCountryFax(countries.find((val) => val.phone === roughBiddersData?.faxCountry1) || null);
      setSelectCountry(countries.find((val) => val.label === roughBiddersData?.co_country) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roughBiddersData]);
  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}
      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <UpsertTitleContainer id={roughBiddersNumberId} entityName="Rough Bidder Registration" />
          <Grid container spacing={3} className="print-form-container">
            <Grid item xs={12} md={6} lg={6}>
              <MainCard title="Rough Bidders Details" content={false}>
                <CardContent>
                  <EventMainConatiner width="100%">
                    <InputWithHelperAction>
                      <FormInput
                        id="username"
                        name="username"
                        label="Username"
                        required
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username ? errors.username : undefined}
                        disabled={Boolean(roughBiddersId)}
                        readOnly
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <RefreshIconButton title="Refresh" onClick={handleAutogenerateUsername} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {roughBiddersId ? null : (
                        <Typography sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={handleCheckAvailability}>
                          Check availability
                        </Typography>
                      )}
                    </InputWithHelperAction>
                    {(isPassword || (!isPassword && !roughBiddersId)) && (
                      <>
                        <InputWithHelperAction>
                          <FormInput
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            label="Password"
                            required
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password ? errors.password : undefined}
                            sx={{ flex: '1 1 auto' }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <Eye /> : <EyeSlash />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Typography sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={handlePasswordGeneration}>
                            Generate password
                          </Typography>
                        </InputWithHelperAction>
                        <FormInput
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmpassword"
                          name="confirmpassword"
                          label="Confirm password"
                          required
                          value={values.confirmpassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmpassword && Boolean(errors.confirmpassword)}
                          helperText={touched.confirmpassword ? errors.confirmpassword : undefined}
                          sx={{ flex: '1 1 auto' }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                  {showConfirmPassword ? <Eye /> : <EyeSlash />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </>
                    )}
                    <FormInput
                      id="contactPerson"
                      name="contactPerson"
                      label="Contact person 1"
                      required
                      value={values.contactPerson}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contactPerson && Boolean(errors.contactPerson)}
                      helperText={touched.contactPerson ? errors.contactPerson : undefined}
                    />
                    <FormInput
                      id="email"
                      name="email"
                      label="Email address 1"
                      required
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email ? errors.email : undefined}
                    />
                    <UpsertSellingGridLeftCountryCode>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>
                        Mobile (+country code) 1 <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <CountryCodeSelect
                            id="mobile-country-1"
                            values={selectMobileCountry1}
                            handleChange={handleChangeMobileCountry1}
                            error={touched.countryCode && Boolean(errors.countryCode)}
                          />
                        </Grid>
                        <Grid item xs={8} sm={10} md={9} lg={10}>
                          <FormInput
                            id="mobileNumber"
                            name="mobileNumber"
                            value={values.mobileNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                          />
                          {touched.countryCode && errors.countryCode && touched.mobileNumber && errors.mobileNumber ? (
                            <FormHelperText error id="combined-error">
                              Country code and mobile number are required
                            </FormHelperText>
                          ) : (
                            touched.mobileNumber &&
                            errors.mobileNumber && (
                              <FormHelperText error id="phone-number-error">
                                {errors.mobileNumber}
                              </FormHelperText>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </UpsertSellingGridLeftCountryCode>
                    <FormInput
                      id="contactPerson1"
                      name="contactPerson1"
                      label="Contact person 2"
                      value={values.contactPerson1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contactPerson1 && Boolean(errors.contactPerson1)}
                      helperText={touched.contactPerson1 ? errors.contactPerson1 : undefined}
                    />
                    <FormInput
                      id="email1"
                      name="email1"
                      type="email"
                      label="Email address 2"
                      value={values.email1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <UpsertSellingGridLeftCountryCode>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>Mobile (+country code) 2</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <CountryCodeSelect
                            id="mobile-country-2"
                            values={selectMobileCountry2}
                            handleChange={handleChangeMobileCountry2}
                          />
                        </Grid>
                        <Grid item xs={8} sm={10} md={9} lg={10}>
                          <FormInput
                            id="mobileNumber1"
                            name="mobileNumber1"
                            type="number"
                            value={values.mobileNumber1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>
                    </UpsertSellingGridLeftCountryCode>
                    <FormInput
                      id="accountCode"
                      name="accountCode"
                      label="Account code"
                      type="number"
                      value={values.accountCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={Boolean(roughBiddersId)}
                    />
                    {roughBiddersId && (
                      <RoughBidderStatusConatinerPoint>
                        <Typography>Bidder Status :</Typography>
                        <UIRadioButtonsGroup
                          options={BIDDER_STATUS_OPTIONS}
                          defaultValue={values.isActive}
                          onChange={handleChangeStatus}
                          disabled={false}
                        />
                        {errors.isActive && touched.isActive && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                            {errors.isActive}
                          </FormHelperText>
                        )}
                      </RoughBidderStatusConatinerPoint>
                    )}
                  </EventMainConatiner>
                </CardContent>
              </MainCard>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MainCard title="Company Details" content={false}>
                <CardContent>
                  <EventMainConatiner width="100%">
                    <FormInput
                      id="companyName"
                      name="companyName"
                      label="Company name"
                      required
                      value={values.companyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.companyName && Boolean(errors.companyName)}
                      helperText={touched.companyName ? errors.companyName : undefined}
                    />
                    <FormInput
                      id="address"
                      name="address"
                      label="Address (line 1)"
                      required
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address ? errors.address : undefined}
                    />
                    <FormInput
                      id="address1"
                      name="address1"
                      label="Address (line 2)"
                      value={values.address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormInput
                      id="postCode"
                      name="postCode"
                      label="Post code"
                      type="number"
                      value={values.postCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormInput
                      id="city"
                      name="city"
                      label="City"
                      required
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city ? errors.city : undefined}
                    />
                    <CountrySelect
                      values={selectCountry}
                      handleChange={handleChangeCountry}
                      title={
                        <Box>
                          Country <span style={{ color: 'red' }}>*</span>
                        </Box>
                      }
                    />
                    {touched.country && errors.country && (
                      <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ mt: '-13px' }}>
                        {errors.country}
                      </FormHelperText>
                    )}
                    <UpsertSellingGridLeftCountryCode>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>
                        Telephone (+country code) <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <CountryCodeSelect
                            id="telephone-country"
                            values={selectCountryTel}
                            handleChange={handleChangeCountryTel}
                            error={touched.telCountry && Boolean(errors.telCountry)}
                          />
                        </Grid>
                        <Grid item xs={8} sm={10} md={9} lg={10}>
                          <FormInput
                            id="telephoneNumber"
                            name="telephoneNumber"
                            value={values.telephoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.telephoneNumber && Boolean(errors.telephoneNumber)}
                          />
                          {touched.telCountry && errors.telCountry && touched.telephoneNumber && errors.telephoneNumber ? (
                            <FormHelperText error id="combined-error">
                              Country code and mobile number are required
                            </FormHelperText>
                          ) : (
                            touched.telephoneNumber &&
                            errors.telephoneNumber && (
                              <FormHelperText error id="phone-number-error">
                                {errors.telephoneNumber}
                              </FormHelperText>
                            )
                          )}
                        </Grid>
                      </Grid>
                    </UpsertSellingGridLeftCountryCode>
                    <UpsertSellingGridLeftCountryCode>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>Fax (+country code)</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <CountryCodeSelect id="fax-country" values={selectCountryFax} handleChange={handleChangeCountryFax} />
                        </Grid>
                        <Grid item xs={8} sm={10} md={9} lg={10}>
                          <FormInput
                            id="faxNo"
                            name="faxNo"
                            type="number"
                            value={values.faxNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>
                    </UpsertSellingGridLeftCountryCode>
                    <FormInput
                      id="website"
                      name="website"
                      label="Website"
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormInput
                      multiline
                      rows={4}
                      id="notes"
                      name="notes"
                      label="Notes"
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.notes && Boolean(errors.notes)}
                      helperText={touched.notes ? errors.notes : undefined}
                    />
                  </EventMainConatiner>
                </CardContent>
              </MainCard>
            </Grid>
            {!roughBiddersId && (
              <Grid item xs={12} md={12} lg={12}>
                <MainCard content={false} title="Legal documents to be submitted for bidder's registration">
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                      <LegalDocumentTableHeader
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={documentData?.length}
                      />
                      <LegalDocumentTableBody
                        data={documentData}
                        page={page}
                        order={order}
                        orderBy={orderBy}
                        loading={loading}
                        rowsPerPage={rowsPerPage}
                        handleFileChange={handleFileChange}
                      />
                    </Table>
                  </TableContainer>
                  <Divider />
                  <TablePagination
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    component="div"
                    count={documentData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ '& p': { m: 0 } }}
                  />
                </MainCard>
              </Grid>
            )}
          </Grid>
          <CardActionButtons {...{ isSubmitting, id: roughBiddersNumberId, handleReset }} />
        </ViewMainContainer>
      </form>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        title={confirmModelTitle}
        onConfirm={handleDialogConfirm}
        onCancel={handleCloseModel}
      />
    </>
  );
};

export default UpsertRoughBiddersForm;
