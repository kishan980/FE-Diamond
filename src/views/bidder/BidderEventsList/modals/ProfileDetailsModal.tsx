'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import CardActions from '@mui/material/CardActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/navigation';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import AnimateButton from 'components/@extended/AnimateButton';
import CountrySelect from 'components/UIComponent/CountrySelect';
import { profileDetailSchema } from 'validations/validationSchemas';
import { StyledActionButtonGroup, UpsertTitle } from 'views/common.styled';
import { ViewMainContainer, EventMainConatiner } from 'views/event/Event.styled';
import countries from 'data/countries';
import { CountryType } from 'types/country';
import { SellingByIdData } from 'services/parameter/sellingCompany/type';
import { AllLotsValuesType } from 'services/bidder/all-lots/type';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { ProfileDetailsDialogProps } from 'types/dialog';
import { MyProfileServices } from 'services/bidder/my-profile/myProfile.services';
import { CountryCodeGridColumn } from 'views/bidder/CommonBidder.styled';

const ProfileDetailsModal = ({
  open,
  handleClose,
  eventId,
  entityID,
  setIsViewParticipateDialogOpen,
  termAndConditionnAgreementItem,
  eventTenderData,
}: ProfileDetailsDialogProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [biddersData, setBiddersData] = useState<SellingByIdData>();
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);

  const initialValues: AllLotsValuesType = {
    companyName: '',
    address: '',
    address1: '',
    city: '',
    postCode: '',
    contactPerson: '',
    contactPerson1: '',
    email: '',
    email1: '',
    telephoneNumber: '',
    telCountry: '',
    country: '',
    countryCode: '',
    countryCode1: '',
    mobileNumber: '',
    mobileNumber1: '',
    faxNo: '',
    faxCountry1: '',
  };

  const { errors, values, touched, setValues, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, setSubmitting } =
    useFormik({
      initialValues,
      validationSchema: profileDetailSchema,
      onSubmit: (values) => {
        // eslint-disable-next-line no-use-before-define
        return handleSubmitForm(values);
      },
    });

  const handleChangeCountry = (value: CountryType | null) => {
    setSelectedCountry(value);
    setFieldValue('country', value?.label || '');
    setFieldValue('telCountry', value?.phone || '');
    setFieldValue('faxCountry1', value?.phone || '');
    setFieldValue('countryCode', value?.phone || '');
    setFieldValue('countryCode1', value?.phone || '');
  };

  const handleSubmitForm = async (values: AllLotsValuesType) => {
    const res = await MyProfileServices.confirmProfileDetailsById({ ...values, id: Number(entityID), eventId });
    if (typeof res !== 'string' && res.success) {
      toast.success('Bidder updated successfully');
      handleClose();
      setTimeout(() => {
        if (termAndConditionnAgreementItem[0]?.AgreementStatus !== 'Accept') setIsViewParticipateDialogOpen(true);
        else if (eventTenderData[0]?.showPurchaseLimit === 'Yes') router.push(`/bidder/${eventId}/purchase-limit`);
        else router.push(`/bidder/${eventId}/all-lots`);
      }, 300);
    }
    setSubmitting(false);
  };

  const handleGetBiddersById = async (id: number) => {
    setIsLoading(true);
    const res = await SellingCompanyServices.getById(id);
    if (typeof res !== 'string' && res.success) setBiddersData(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (entityID) handleGetBiddersById(Number(entityID));
  }, [entityID]);

  useEffect(() => {
    if (entityID) {
      setValues({
        ...values,
        companyName: biddersData?.co_name || '',
        address: biddersData?.co_add1 || '',
        address1: biddersData?.co_add2 || '',
        postCode: biddersData?.co_zip || '',
        city: biddersData?.co_city || '',
        telephoneNumber: biddersData?.phoneno1 || '',
        faxNo: biddersData?.faxno1 || '',
        country: biddersData?.co_country || '',
        telCountry: biddersData?.phoneCountry1 || '',
        countryCode1: biddersData?.phoneCountry1 || '',
        faxCountry1: biddersData?.phoneCountry1 || '',
        countryCode: biddersData?.phoneCountry1 || '',
        contactPerson: biddersData?.contactPerson || '',
        email: biddersData?.emailID1 || '',
        mobileNumber: biddersData?.mobileno1 || '',
        contactPerson1: biddersData?.contactPerson2 || '',
        email1: biddersData?.emailID2 || '',
        mobileNumber1: biddersData?.mobileno2 || '',
      });
      setSelectedCountry(countries.find((val) => val.label === biddersData?.co_country) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biddersData]);
  return isLoading ? (
    <Loader />
  ) : (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleClose();
      }}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Please confirm your profile details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <ViewMainContainer>
            <UpsertTitle>
              <Typography variant="h6">
                <span style={{ color: 'red' }}>*</span> Mandatory fields
              </Typography>
            </UpsertTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Profile Details" content={false}>
                  <CardContent>
                    <EventMainConatiner width="100%">
                      <FormInput
                        id="companyName"
                        name="companyName"
                        label="Company"
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
                          <Grid item xs={4} sm={2} md={2} lg={2}>
                            <FormInput
                              id="telCountry"
                              name="telCountry"
                              value={values.telCountry}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={8} sm={10} md={10} lg={10}>
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
                            (touched.telCountry && Boolean(errors.telCountry)) ? (
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
                          <Grid item xs={4} sm={2} md={2} lg={2}>
                            <FormInput
                              id="faxCountry1"
                              name="faxCountry1"
                              value={values.faxCountry1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={8} sm={10} md={10} lg={10}>
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
                    </EventMainConatiner>
                  </CardContent>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Bidder Details" content={false}>
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
                          <Grid item xs={4} sm={2} md={2} lg={2}>
                            <FormInput
                              id="countryCode"
                              name="countryCode"
                              value={values.countryCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={8} sm={10} md={10} lg={10}>
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
                          <Grid item xs={4} sm={2} md={2} lg={2}>
                            <FormInput
                              id="countryCode1"
                              name="countryCode1"
                              value={values.countryCode1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={8} sm={10} md={10} lg={10}>
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
              </Grid>
            </Grid>
            <CardActions>
              <StyledActionButtonGroup direction="row">
                <AnimateButton>
                  <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                    <Box
                      component="img"
                      src="/assets/icons/save.png"
                      width={18}
                      height={18}
                      sx={{ mr: 1, filter: 'invert(1) brightness(2)' }}
                    />
                    Save
                  </LoadingButton>
                </AnimateButton>
              </StyledActionButtonGroup>
            </CardActions>
          </ViewMainContainer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetailsModal;
