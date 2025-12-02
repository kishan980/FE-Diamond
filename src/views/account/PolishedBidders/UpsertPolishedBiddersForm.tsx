'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { Eye, EyeSlash } from 'iconsax-react';
import { useParams, useRouter } from 'next/navigation';
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
import Box from '@mui/material/Box';
import LegalDocumentTableBody from '../LegalDocumentTable/LegalDocumentTableBody';
import LegalDocumentTableHeader from '../LegalDocumentTable/LegalDocumentTableHeader';
import { InputWithHelperAction } from '../CommonAccount.styled';
import { PolishedBidderStatusConatinerPoint } from './PolishedBidder.styled';
import {
  AddPolishedBiddersParams,
  PolishedBiddersDocumentList,
  PolishedBiddersUploadImagesParams,
  PolishedBiddersUploadPayload,
} from 'services/account/polishedBidders/type';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import CountrySelect from 'components/UIComponent/CountrySelect';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import CountryCodeSelect from 'components/UIComponent/CountryCodeSelect';
import UIRadioButtonsGroup from 'components/UIComponent/RadioButtonGroup';
import UpsertTitleContainer from 'components/UIComponent/UpsertTitleContainer';
import { polishedBidderSchema } from 'validations/validationSchemas';
import { UpsertSellingGridLeftCountryCode } from 'views/parameter/SellingCompany/SellingCompany.styled';
import { EventMainConatiner, ViewMainContainer } from 'views/event/Event.styled';
import { handleGeneratePassword } from 'utils/passwordUtils';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { checkUsernameAvailability } from 'utils/checkUsernameAvailability';
import { BIDDER_STATUS_OPTIONS } from 'constants/polishedBidder.constants';
import countries from 'data/countries';
import { CountryType } from 'types/country';
import { LoadingState } from 'types/table';
import { SellingByIdData } from 'services/parameter/sellingCompany/type';
import { PolishedBiddersServices } from 'services/account/polishedBidders/polishedBidders.services';
import { useTableControls } from 'utils/useTableControls';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';
import { UploadedFile } from 'services/account/roughBidders/type';
import CircularLoader from 'components/CircularLoader';
import PrintLogo from 'components/logo/PrintLogo';
import { checkPasswordProtection } from 'utils/userAccessUtils';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';

const UpserPolsihedBiddersForm = () => {
  const { push } = useRouter();
  const { id: polishedBiddersId } = useParams();
  const polishedBiddersNumberId = Number(polishedBiddersId);

  const [polishedBiddersData, setPolishedBiddersData] = useState<SellingByIdData>();
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isCircularLoading: false });
  const [documentData, setDocumentData] = useState<PolishedBiddersDocumentList[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generatePassword, setGeneratePassword] = useState('');
  const [selectCountry, setSelectCountry] = useState<CountryType | null>(null);
  const [selectCountryTel, setSelectCountryTel] = useState<CountryType | null>(null);
  const [selectCountryFax, setSelectCountryFax] = useState<CountryType | null>(null);
  const [selectCountryTel1, setSelectCountryTel1] = useState<CountryType | null>(null);
  const [selectCountryTel2, setSelectCountryTel2] = useState<CountryType | null>(null);
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
  };

  const isImageUploadPayload = (response: string | PolishedBiddersUploadPayload): response is PolishedBiddersUploadPayload => {
    return (response as PolishedBiddersUploadPayload).url !== undefined;
  };

  const handleSubmitForm = async (values: AddPolishedBiddersParams) => {
    try {
      const uploadPromises = uploadedFiles.map((file) => {
        const params: PolishedBiddersUploadImagesParams = { file: file.file, oldFile: null, docId: file.id };

        return PolishedBiddersServices.uploadImage(params).then((response) => {
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

      const res = polishedBiddersId
        ? await PolishedBiddersServices.update({ ...values, id: polishedBiddersNumberId })
        : await PolishedBiddersServices.add(values);

      if (typeof res !== 'string' && res.success) {
        toast.success('Polished Bidder ' + (polishedBiddersId ? 'updated' : 'added') + ' successfully');
        push('/account/polished-bidders');
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

  const handleOpenConfirmModel = (values: AddPolishedBiddersParams) => {
    const currentStatus = Number(polishedBiddersData?.isActive);
    const newStatus = Number(values.isActive);
    const message = getStatusConfirmMessage(currentStatus, newStatus);

    if (polishedBiddersId && values.password !== polishedBiddersData?.Password) {
      setIsConfirmDialogOpen(true);
      setConfirmModelTitle('Are you sure you want to change password?');
    } else if (polishedBiddersId && message) {
      setIsConfirmDialogOpen(true);
      setConfirmModelTitle(message);
    } else {
      handleSubmitForm(values);
    }
  };

  const {
    errors,
    values,
    setValues,
    touched,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: polishedBidderSchema(polishedBiddersNumberId, isPassword),
    onSubmit: (values) => {
      if (polishedBiddersNumberId) {
        handleOpenConfirmModel(values);
      } else {
        handleSubmitForm(values);
      }
    },
  });

  const handleCheckAvailability = async () =>
    await checkUsernameAvailability(values.username, PolishedBiddersServices.checkUsername, setLoading);

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

  const handleChangeCountryTel1 = (value: CountryType | null) => {
    setSelectCountryTel1(value);
    setFieldValue('countryCode', value?.phone || '');
  };

  const handleChangeCountryTel2 = (value: CountryType | null) => {
    setSelectCountryTel2(value);
    setFieldValue('countryCode1', value?.phone || '');
  };

  const handleChangeStatus = (value: string) => setFieldValue('isActive', value);

  const handlePasswordGeneration = () => handleGeneratePassword(setGeneratePassword, setValues);

  const handleFileChange = (row: number | PolishedBiddersDocumentList, event: ChangeEvent<HTMLInputElement>) => {
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

  const handleGetPolishedbiddersById = async (id: number) => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));
    try {
      const res = await SellingCompanyServices.getById(id);
      if (typeof res !== 'string' && res.success) setPolishedBiddersData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      toast.error('Error fetching data.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    }
  };

  const handelPolishedBiddersDocumentList = async () => {
    try {
      const res = await PolishedBiddersServices.polishedBiddersDocumentList();
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
      if (!polishedBiddersNumberId) handelPolishedBiddersDocumentList();
      setLoading((prev) => ({ ...prev, isProgress: false }));
    };
    fetchInitialData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (polishedBiddersNumberId) handleGetPolishedbiddersById(polishedBiddersNumberId);
  }, [polishedBiddersNumberId]);

  useEffect(() => {
    if (polishedBiddersNumberId) {
      setValues({
        ...values,
        companyName: polishedBiddersData?.co_name || '',
        address: polishedBiddersData?.co_add1 || '',
        address1: polishedBiddersData?.co_add2 || '',
        city: polishedBiddersData?.co_city || '',
        country: polishedBiddersData?.co_country || '',
        postCode: polishedBiddersData?.co_zip || '',
        website: polishedBiddersData?.co_website || '',
        contactPerson: polishedBiddersData?.contactPerson || '',
        contactPerson1: polishedBiddersData?.contactPerson2 || '',
        username: polishedBiddersData?.user_name || '',
        password: polishedBiddersData?.Password || '',
        confirmpassword: polishedBiddersData?.Password || '',
        email: polishedBiddersData?.emailID1 || '',
        email1: polishedBiddersData?.emailID2 || '',
        telCountry: polishedBiddersData?.phoneCountry1 || '',
        telephoneNumber: polishedBiddersData?.phoneno1 || '',
        countryCode: polishedBiddersData?.mobileCountry1 || '',
        mobileNumber: polishedBiddersData?.mobileno1 || '',
        countryCode1: polishedBiddersData?.mobileCountry2 || '',
        mobileNumber1: polishedBiddersData?.mobileno2 || '',
        faxCountry1: polishedBiddersData?.faxCountry1 || '',
        faxNo: polishedBiddersData?.faxno1 || '',
        isActive: Number(polishedBiddersData?.isActive),
        notes: polishedBiddersData?.notes || '',
        accountCode: polishedBiddersData?.Accountcode || '',
      });
      setSelectCountryTel1(countries.find((val) => val.phone === polishedBiddersData?.mobileCountry1) || null);
      setSelectCountryTel2(countries.find((val) => val.phone === polishedBiddersData?.mobileCountry2) || null);
      setSelectCountryTel(countries.find((val) => val.phone === polishedBiddersData?.phoneCountry1) || null);
      setSelectCountryFax(countries.find((val) => val.phone === polishedBiddersData?.faxCountry1) || null);
      setSelectCountry(countries.find((val) => val.label === polishedBiddersData?.co_country) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polishedBiddersData]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}
      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <UpsertTitleContainer id={polishedBiddersNumberId} entityName="Polished Bidder Registration" />
          <Grid container spacing={3} className="print-form-container">
            <Grid item xs={12} md={6} lg={6}>
              <MainCard title="Polished Bidders Details" content={false}>
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
                        disabled={Boolean(polishedBiddersNumberId)}
                      />
                      <Typography sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={handleCheckAvailability}>
                        Check availability
                      </Typography>
                    </InputWithHelperAction>
                    {(isPassword || (!isPassword && !polishedBiddersNumberId)) && (
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
                            values={selectCountryTel1}
                            handleChange={handleChangeCountryTel1}
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
                      label="Email address 2"
                      type="email"
                      value={values.email1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <UpsertSellingGridLeftCountryCode>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>Mobile (+country code) 2</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <CountryCodeSelect id="mobile-country-2" values={selectCountryTel2} handleChange={handleChangeCountryTel2} />
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
                      value={values.accountCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={Boolean(polishedBiddersNumberId)}
                    />
                    {polishedBiddersId && (
                      <PolishedBidderStatusConatinerPoint>
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
                      </PolishedBidderStatusConatinerPoint>
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
                            error={touched.telephoneNumber && Boolean(errors.telephoneNumber)}
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
                              Country code and telephone number are required
                            </FormHelperText>
                          ) : (
                            touched.telephoneNumber &&
                            errors.telephoneNumber && (
                              <FormHelperText error id="telephone-number-error">
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
            {!polishedBiddersNumberId && (
              <Grid item xs={12} md={12} lg={12}>
                <MainCard content={false} title="Legal documents to be submitted for bidder's registration">
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                      <LegalDocumentTableHeader {...{ order, orderBy, onRequestSort: handleRequestSort, rowCount: documentData?.length }} />
                      <LegalDocumentTableBody {...{ data: documentData, page, order, orderBy, loading, rowsPerPage, handleFileChange }} />
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
          <CardActionButtons {...{ isSubmitting, id: polishedBiddersNumberId, handleReset }} />
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

export default UpserPolsihedBiddersForm;
