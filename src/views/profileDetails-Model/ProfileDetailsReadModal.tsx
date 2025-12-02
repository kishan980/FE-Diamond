'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';
import { CloseCircle } from 'iconsax-react';
import { toast } from 'react-toastify';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import CountrySelect from 'components/UIComponent/CountrySelect';
import { ViewMainContainer, EventMainConatiner } from 'views/event/Event.styled';
import countries from 'data/countries';
import { SellingByIdData } from 'services/parameter/sellingCompany/type';
import { AllLotsValuesType } from 'services/bidder/all-lots/type';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { ProfileDetailsReadDialogProps } from 'types/dialog';
import { CountryCodeGridColumn } from 'views/bidder/CommonBidder.styled';

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

const ProfileDetailsReadModal = ({ open, handleClose, entityID }: ProfileDetailsReadDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [biddersData, setBiddersData] = useState<SellingByIdData>();

  const formik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const { values, setValues, handleBlur, handleChange } = formik;

  const selectedCountry = useMemo(() => {
    return countries.find((val) => val.label === biddersData?.co_country) || null;
  }, [biddersData]);

  const fetchBidderById = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const res = await SellingCompanyServices.getById(id);
      if (typeof res !== 'string' && res.success) {
        setBiddersData(res.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch bidder details:', error);
      toast.error('Failed to fetch bidder details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (entityID && open) {
      fetchBidderById(entityID);
    }
  }, [entityID, open, fetchBidderById]);

  useEffect(() => {
    if (!biddersData) return;

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biddersData]);

  const renderInput = useCallback(
    (id: keyof AllLotsValuesType, label?: string, type?: string) => (
      <FormInput id={id} name={id} label={label} type={type} value={values[id]} onChange={handleChange} onBlur={handleBlur} readOnly />
    ),
    [values, handleChange, handleBlur]
  );

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
      aria-labelledby="profile-details-dialog-title"
    >
      <DialogTitle id="profile-details-dialog-title">
        <IconButton onClick={handleClose} style={{ position: 'absolute', right: 8, top: 3 }}>
          <CloseCircle />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 0, sm: 2.5 }, mt: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <ViewMainContainer>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Profile Details" content={false}>
                  <CardContent sx={{ padding: { xs: '12px !important', sm: '24px !important' } }}>
                    <EventMainConatiner width="100%">
                      {renderInput('companyName', 'Company name')}
                      {renderInput('address', 'Address (line 1)')}
                      {renderInput('address1', 'Address (line 2)')}
                      {renderInput('postCode', 'Post code', 'number')}
                      {renderInput('city', 'City')}
                      <CountrySelect
                        values={selectedCountry}
                        handleChange={() => {}}
                        title={
                          <Box>
                            Country <span style={{ color: 'red' }}>*</span>
                          </Box>
                        }
                        readOnly
                      />
                      <CountryCodeGridColumn>
                        <Typography sx={{ whiteSpace: 'nowrap' }}>
                          Telephone (+country code) <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={3} lg={2}>
                            {renderInput('telCountry')}
                          </Grid>
                          <Grid item xs={8} sm={10} md={9} lg={10}>
                            {renderInput('telephoneNumber', undefined, 'number')}
                          </Grid>
                        </Grid>
                      </CountryCodeGridColumn>
                      <CountryCodeGridColumn>
                        <Typography sx={{ whiteSpace: 'nowrap' }}>Fax (+country code)</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={3} lg={2}>
                            {renderInput('faxCountry1')}
                          </Grid>
                          <Grid item xs={8} sm={10} md={9} lg={10}>
                            {renderInput('faxNo', undefined, 'number')}
                          </Grid>
                        </Grid>
                      </CountryCodeGridColumn>
                    </EventMainConatiner>
                  </CardContent>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Bidder Details" content={false}>
                  <CardContent sx={{ padding: { xs: '12px !important', sm: '24px !important' } }}>
                    <EventMainConatiner width="100%">
                      {renderInput('contactPerson', 'Contact person')}
                      {renderInput('email', 'Email address 1', 'email')}

                      <CountryCodeGridColumn>
                        <Typography sx={{ whiteSpace: 'nowrap' }}>
                          Mobile (+country code) 1 <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={3} lg={2}>
                            {renderInput('countryCode')}
                          </Grid>
                          <Grid item xs={8} sm={10} md={9} lg={10}>
                            {renderInput('mobileNumber', undefined, 'number')}
                          </Grid>
                        </Grid>
                      </CountryCodeGridColumn>
                      {renderInput('contactPerson1', 'Contact person 2')}
                      {renderInput('email1', 'Email address 2', 'email')}
                      <CountryCodeGridColumn>
                        <Typography sx={{ whiteSpace: 'nowrap' }}>Mobile (+country code) 2</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={3} lg={2}>
                            {renderInput('countryCode1')}
                          </Grid>
                          <Grid item xs={8} sm={10} md={9} lg={10}>
                            {renderInput('mobileNumber1', undefined, 'number')}
                          </Grid>
                        </Grid>
                      </CountryCodeGridColumn>
                    </EventMainConatiner>
                  </CardContent>
                </MainCard>
              </Grid>
            </Grid>
          </ViewMainContainer>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetailsReadModal;
