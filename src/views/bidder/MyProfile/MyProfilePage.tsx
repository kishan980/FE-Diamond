'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FormHelperText from '@mui/material/FormHelperText';
import { LoadingButton } from '@mui/lab';
import { MoneyChange } from 'iconsax-react';
import { CountryCodeGridColumn } from '../CommonBidder.styled';
import MyProfileTitleContainer from './MyProfileTitleContainer';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import AnimateButton from 'components/@extended/AnimateButton';
import CountrySelect from 'components/UIComponent/CountrySelect';
import { myProfileSchema } from 'validations/validationSchemas';
import { EventMainConatiner, ViewMainContainer } from 'views/event/Event.styled';
import countries from 'data/countries';
import { CountryType } from 'types/country';
import { SellingByIdData } from 'services/parameter/sellingCompany/type';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { AddProfileDetailsParams } from 'services/bidder/my-profile/type';
import PrintLogo from 'components/logo/PrintLogo';

const MyProfilePage = () => {
  const { data: session } = useSession();
  const imageDetails = JSON.parse(session?.user?.image ?? '{}');
  const { entityID } = imageDetails?.currentUserDetails ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [myProfileData, setMyProfileData] = useState<SellingByIdData>();
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);

  const initialValues: AddProfileDetailsParams = {
    companyName: '',
    address: '',
    address1: '',
    city: '',
    postCode: '',
    website: '',
    contactPerson: '',
    contactPerson1: '',
    email: '',
    email1: '',
    telephoneNumber: '',
    countryCode: '',
    mobileNumber: '',
    countryCode1: '',
    mobileNumber1: '',
    faxNo: '',
  };

  const { errors, values, touched, setValues, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, setSubmitting } =
    useFormik({
      initialValues,
      validationSchema: myProfileSchema,
      onSubmit: (values) => {
        // eslint-disable-next-line no-use-before-define
        return handleSubmitForm(values);
      },
    });

  const handleChangeCountry = (value: CountryType | null) => {
    setSelectedCountry(value);
    setFieldValue('country', value?.label || '');
    setFieldValue('countryCode', value?.phone || '');
  };

  const handleSubmitForm = async (values: AddProfileDetailsParams) => {
    try {
      const res = await MyProfileServices.updateProfileDetailsById({ ...values, id: Number(entityID) });
      if (typeof res !== 'string' && res.success) toast.success('MyProfile updated successfully');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in handleSubmitForm myProfile', e);
      toast.error('An error occurred while updating MyProfile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetMyProfileById = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const res = await SellingCompanyServices.getById(id);
      if (typeof res !== 'string' && res.success) setMyProfileData(res.data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in handleGetMyProfileById myProfile', e);
      toast.error('An error occurred while fetching MyProfile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (entityID) handleGetMyProfileById(Number(entityID));
  }, [entityID, handleGetMyProfileById]);

  useEffect(() => {
    if (entityID) {
      setValues({
        ...values,
        companyName: myProfileData?.co_name || '',
        address: myProfileData?.co_add1 || '',
        address1: myProfileData?.co_add2 || '',
        postCode: myProfileData?.co_zip || '',
        city: myProfileData?.co_city || '',
        telephoneNumber: myProfileData?.phoneno1 || '',
        faxNo: myProfileData?.faxno1 || '',
        countryCode: myProfileData?.phoneCountry1 || '',
        website: myProfileData?.co_website || '',
        contactPerson: myProfileData?.contactPerson || '',
        email: myProfileData?.emailID1 || '',
        mobileNumber: myProfileData?.mobileno1 || '',
        contactPerson1: myProfileData?.contactPerson2 || '',
        email1: myProfileData?.emailID2 || '',
        mobileNumber1: myProfileData?.mobileno2 || '',
      });
      setSelectedCountry(countries.find((val) => val.label === myProfileData?.co_country) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProfileData]);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <MyProfileTitleContainer />
          <Grid container spacing={3} className="print-form-container">
            <Grid item xs={12} md={6} lg={6}>
              <MainCard title="Profile Details" content={false}>
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
                      values={selectedCountry}
                      handleChange={handleChangeCountry}
                      title={
                        <Box>
                          Country <span style={{ color: 'red' }}>*</span>
                        </Box>
                      }
                    />
                    <CountryCodeGridColumn>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>
                        Telephone (+country code) <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <FormInput
                            id="countryCode"
                            name="countryCode"
                            value={values.countryCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={8} sm={10} md={9} lg={10}>
                          <FormInput
                            id="telephoneNumber"
                            name="telephoneNumber"
                            type="number"
                            value={values.telephoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.telephoneNumber && Boolean(errors.telephoneNumber)}
                          />
                          {(touched.telephoneNumber && Boolean(errors.telephoneNumber)) ||
                          (touched.countryCode && Boolean(errors.countryCode)) ? (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                              valid country code and telephone number are required
                            </FormHelperText>
                          ) : null}
                        </Grid>
                      </Grid>
                    </CountryCodeGridColumn>
                    <CountryCodeGridColumn>
                      <Typography sx={{ whiteSpace: 'nowrap' }}>Fax (+country code)</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4} sm={2} md={3} lg={2}>
                          <FormInput
                            id="countryCode"
                            name="countryCode"
                            value={values.countryCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled
                          />
                        </Grid>
                        <Grid item xs={8} sm={10} md={9} lg={10}>
                          <FormInput
                            id="faxNo"
                            name="faxNo"
                            value={values.faxNo}
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>
                    </CountryCodeGridColumn>
                    <FormInput
                      id="website"
                      name="website"
                      label="Website"
                      value={values.website || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </EventMainConatiner>
                </CardContent>
              </MainCard>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <EventMainConatiner>
                <MainCard title="Contact Person Details" content={false}>
                  <CardContent>
                    <EventMainConatiner width="100%">
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
                        label="Email address 1"
                        required
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email ? errors.email : undefined}
                      />
                      <CountryCodeGridColumn>
                        <Typography sx={{ whiteSpace: 'nowrap' }}>
                          Mobile (+country code) 1 <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={3} lg={2}>
                            <FormInput
                              id="countryCode"
                              name="countryCode"
                              value={values.countryCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
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
                      </CountryCodeGridColumn>
                      <FormInput
                        id="contactPerson1"
                        name="contactPerson1"
                        label="Contact person 2"
                        value={values.contactPerson1}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                      <CountryCodeGridColumn>
                        <Typography sx={{ whiteSpace: 'nowrap' }}>Mobile (+country code) 2</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={3} lg={2}>
                            <FormInput
                              id="countryCode"
                              name="countryCode"
                              value={values.countryCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
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
                      </CountryCodeGridColumn>
                    </EventMainConatiner>
                  </CardContent>
                </MainCard>
              </EventMainConatiner>
            </Grid>
          </Grid>
          <CardActions sx={{ justifyContent: 'center' }}>
            <AnimateButton>
              <LoadingButton loading={isSubmitting} type="submit" variant="contained" startIcon={<MoneyChange color="#d9e3f0" />}>
                Update
              </LoadingButton>
            </AnimateButton>
          </CardActions>
        </ViewMainContainer>
      </form>
    </>
  );
};

export default MyProfilePage;
