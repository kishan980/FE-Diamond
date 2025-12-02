'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { ArrowLeft2, Eye, EyeSlash } from 'iconsax-react';
import { InputWithHelperAction } from '../CommonAccount.styled';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import countries from 'data/countries';
import CountrySelect from 'components/UIComponent/CountrySelect';
import { UpsertTitleTypography } from 'views/common.styled';
import { viewerSchema } from 'validations/validationSchemas';
import CountryCodeSelect from 'components/UIComponent/CountryCodeSelect';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import { UpsertSellingGridLeftCountryCode } from 'views/parameter/SellingCompany/SellingCompany.styled';
import { ViewMainContainer, EventMainConatiner } from 'views/event/Event.styled';
import { ViewersServices } from 'services/account/viewers/viewers.services';
import { handleGeneratePassword } from 'utils/passwordUtils';
import { checkUsernameAvailability } from 'utils/checkUsernameAvailability';
import { CountryType } from 'types/country';
import { LoadingState } from 'types/table';
import { AddViewersParams, ViewersByIdData } from 'services/account/viewers/type';
import { RoughBiddersServices } from 'services/account/roughBidders/roughBidders.services';
import CircularLoader from 'components/CircularLoader';
import { checkPasswordProtection } from 'utils/userAccessUtils';
import ConfirmationDialog from 'components/UIComponent/Dialogs/ConfirmationDialog/ConfirmationDialog';

const UpsertViewersForm = () => {
  const { push, back } = useRouter();
  const { id: viewersId } = useParams();
  const viewersNumberId = Number(viewersId);

  const [viewersData, setViewersData] = useState<ViewersByIdData>();
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isCircularLoading: false });
  const [generatePassword, setGeneratePassword] = useState('');
  const [selectMobileCountry, setSelectMobileCountry] = useState<CountryType | null>(null);
  const [selectCountry, setSelectCountry] = useState<CountryType | null>(null);
  const [selectTelephoneCountry, setSelectTelephoneCountry] = useState<CountryType | null>(null);
  const [selectFaxCountry, setSelectFaxCountry] = useState<CountryType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const initialValues = {
    username: '',
    password: generatePassword || '',
    confirmpassword: '',
    contactPerson: '',
    email: '',
    mobCountryCode: '',
    mobileNumber: '',
    companyName: '',
    address: '',
    address1: '',
    postCode: '',
    city: '',
    country: '',
    telCountry: '',
    telephoneNumber: '',
    faxCountry1: '',
    faxNo: '',
    website: '',
  };

  const handleSubmitForm = async (values: AddViewersParams) => {
    try {
      const res = viewersId ? await ViewersServices.update({ ...values, id: viewersNumberId }) : await ViewersServices.add(values);
      if (typeof res !== 'string' && res.success) {
        toast.success('Viewers ' + (viewersId ? 'updated' : 'added') + ' successfully');
        push('/account/viewers');
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

  const handleOpenConfirmModel = (values: AddViewersParams) => {
    if (viewersNumberId && values.password !== viewersData?.Password) {
      setIsConfirmDialogOpen(true);
    } else {
      handleSubmitForm(values);
    }
  };

  const {
    errors,
    values,
    touched,
    setValues,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: viewerSchema(viewersNumberId, isPassword),
    onSubmit: (values) => {
      if (viewersNumberId) {
        handleOpenConfirmModel(values);
      } else {
        handleSubmitForm(values);
      }
    },
  });

  const handleCheckAvailability = async () =>
    await checkUsernameAvailability(values.username, RoughBiddersServices.checkUsername, setLoading);

  const handleChangeMobileCountry = (value: CountryType | null) => {
    setSelectMobileCountry(value);
    setFieldValue('mobCountryCode', value?.phone || '');
  };

  const handleChangeCountry = (value: CountryType | null) => {
    setSelectCountry(value);
    setFieldValue('country', value?.label || '');
  };

  const handleChangeTelephoneCountry = (value: CountryType | null) => {
    setSelectTelephoneCountry(value);
    setFieldValue('telCountry', value?.phone || '');
  };

  const handleChangeFaxCountry = (value: CountryType | null) => {
    setSelectFaxCountry(value);
    setFieldValue('faxCountry1', value?.phone || '');
  };

  const handlePasswordGeneration = () => handleGeneratePassword(setGeneratePassword, setValues);

  const handleGetViewersById = async (id: number) => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));
    try {
      const res = await ViewersServices.getById(id);
      if (typeof res !== 'string' && res.success) setViewersData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      toast.error('Error fetching data.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
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
    if (viewersNumberId) handleGetViewersById(viewersNumberId);
  }, [viewersNumberId]);

  useEffect(() => {
    checkPasswordProtection(setIsPassword);
  }, []);

  useEffect(() => {
    if (viewersData) {
      setValues((prevValues) => {
        return {
          ...prevValues,
          username: viewersData?.user_name || '',
          password: viewersData?.Password || '',
          confirmpassword: viewersData?.Password || '',
          contactPerson: viewersData?.contactPerson || '',
          email: viewersData?.emailID1 || '',
          mobCountryCode: viewersData?.mobileCountry1 || '',
          mobileNumber: viewersData?.mobileno1 || '',
          companyName: viewersData?.co_name || '',
          address: viewersData?.co_add1 || '',
          address1: viewersData?.co_add2 || '',
          postCode: viewersData?.co_zip || '',
          city: viewersData?.co_city || '',
          country: viewersData?.co_country || '',
          telCountry: viewersData?.phoneCountry1 || '',
          telephoneNumber: viewersData?.phoneno1 || '',
          faxCountry1: viewersData?.faxCountry1 || '',
          faxNo: viewersData?.faxno1 || '',
          website: viewersData?.co_website || '',
        };
      });
      setSelectMobileCountry(countries.find((country) => country.phone === viewersData?.mobileCountry1) || null);
      setSelectCountry(countries.find((country) => country.label === viewersData?.co_country) || null);
      setSelectTelephoneCountry(countries.find((country) => country.phone === viewersData?.phoneCountry1) || null);
      setSelectFaxCountry(countries.find((country) => country.phone === viewersData?.faxCountry1) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewersData]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <UpsertTitleTypography onClick={() => back()}>
            <ArrowLeft2 />
            <Typography variant="h4">{viewersId ? 'Update' : 'Add'} Viewer Registration</Typography>
          </UpsertTitleTypography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MainCard title="Viewers Details" content={false}>
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
                        disabled={Boolean(viewersId)}
                      />
                      {viewersNumberId ? null : (
                        <Typography sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={handleCheckAvailability}>
                          Check availability
                        </Typography>
                      )}
                    </InputWithHelperAction>
                    {(isPassword || (!isPassword && !viewersId)) && (
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
                      label="Contact person"
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
                      label="Email address"
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
                        Mobile (+country code) <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <CountryCodeSelect
                            id="mobile-country"
                            values={selectMobileCountry}
                            handleChange={handleChangeMobileCountry}
                            error={touched.mobCountryCode && Boolean(errors.mobCountryCode)}
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
                          {touched.mobCountryCode && errors.mobCountryCode && touched.mobileNumber && errors.mobileNumber ? (
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
                            id="telephone-country-1"
                            values={selectTelephoneCountry}
                            handleChange={handleChangeTelephoneCountry}
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
                              Country code and telephone number are required
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
                          <CountryCodeSelect id="fax-country-1" values={selectFaxCountry} handleChange={handleChangeFaxCountry} />
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
                  </EventMainConatiner>
                </CardContent>
              </MainCard>
            </Grid>
          </Grid>
          <CardActionButtons isSubmitting={isSubmitting} id={viewersNumberId} handleReset={handleReset} />
        </ViewMainContainer>
      </form>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onCancel={handleCloseModel}
        onConfirm={handleDialogConfirm}
        title={'Are you sure you want to change password?'}
      />
    </>
  );
};

export default UpsertViewersForm;
