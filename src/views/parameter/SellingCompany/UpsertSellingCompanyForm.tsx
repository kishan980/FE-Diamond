'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import {
  UpsertSellingMainContainer,
  UpsertSellingGridLeftCountryCode,
  UpsertSellingContainer,
  UpsertSellingCompanyLogoContainer,
} from './SellingCompany.styled';
import countries from 'data/countries';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import CountrySelect from 'components/UIComponent/CountrySelect';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import DragAndDropSingleImage from 'components/UIComponent/DragAndDropSingleImage';
import { ViewMainContainer } from 'views/event/Event.styled';
import { sellingCompanySchema } from 'validations/validationSchemas';
import { handleFetchData } from 'utils/apiHelpers';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { CountryType } from 'types/country';
import { LoadingState } from 'types/table';
import { SellingByIdData, SellingCompanyValuesType } from 'services/parameter/sellingCompany/type';
import CircularLoader from 'components/CircularLoader';

const UpsertSellingCompanyForm = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const sellingId = Number(id);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [sellingData, setSellingData] = useState<SellingByIdData>();
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);

  const initialValues: SellingCompanyValuesType = {
    companyName: '',
    add1: '',
    add2: '',
    postCode: '',
    city: '',
    country: '',
    countryCode: '',
    phoneNo: '',
    faxNo: '',
    website: '',
    companyLogo: '',
    multiVendor: false,
    terminal: window.location.origin,
  };

  const {
    errors,
    values,
    touched,
    handleChange,
    setFieldError,
    handleBlur,
    handleReset,
    setValues,
    handleSubmit,
    setFieldValue,
    setTouched,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: sellingCompanySchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleAddSelling = async (values: SellingCompanyValuesType) => {
    try {
      const res = sellingId
        ? await SellingCompanyServices.update({ ...values, companyLogo: values.companyLogo as string, id: sellingId })
        : await SellingCompanyServices.add({ ...values, companyLogo: values.companyLogo as string });
      if (typeof res !== 'string' && res.success) {
        push('/master-setup/selling-Company');
        toast.success('Selling Company ' + (sellingId ? 'updated' : 'added') + ' successfully');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while saving the Selling Company:', error);
      toast.error('Failed to ' + (sellingId ? 'update' : 'add') + ' Selling Company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForm = async (values: SellingCompanyValuesType) => {
    try {
      if (typeof values.companyLogo !== 'string') {
        const uploadRes = await SellingCompanyServices.uploadImage({
          file: values.companyLogo[0],
          oldFile: sellingData?.co_logo ?? null,
        });

        if (typeof uploadRes !== 'string' && uploadRes.success) {
          values.companyLogo = uploadRes.data;
        }
      }

      await handleAddSelling(values);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeCountry = (value: CountryType | null) => {
    setSelectedCountry(value);
    setFieldValue('country', value?.label || '');
    setFieldValue('countryCode', value?.phone || '');
  };

  const handleChangeMultiVendor = () => setFieldValue('multiVendor', !values.multiVendor);

  const handleGetSellingById = async (id: number) =>
    await handleFetchData<SellingByIdData | undefined>(() => SellingCompanyServices.getById(id), setSellingData, setLoading);

  useEffect(() => {
    if (sellingId) handleGetSellingById(sellingId);
  }, [sellingId]);

  useEffect(() => {
    if (sellingId && sellingData) {
      setValues({
        companyName: sellingData?.co_name || '',
        add1: sellingData?.co_add1 || '',
        add2: sellingData?.co_add2 || '',
        postCode: sellingData?.co_zip || '',
        city: sellingData?.co_city || '',
        country: sellingData?.co_country || '',
        countryCode: sellingData?.phoneCountry1 || '',
        phoneNo: sellingData?.phoneno1 || '',
        faxNo: sellingData?.faxno1 || '',
        website: sellingData?.co_website || '',
        companyLogo: sellingData?.co_logo || '',
        multiVendor: sellingData?.IsMultiVendor || false,
        terminal: window.location.origin,
      });
      setSelectedCountry(countries.find((val) => val.label === sellingData?.co_country) ?? null);
    }
  }, [sellingData, sellingId, setValues]);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {loading.isProgress && <CircularLoader isProgress={loading.isProgress} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <MainCard title={`${sellingId ? 'Update' : 'Add'} Selling Company Registration`} content={false}>
                <CardContent>
                  <UpsertSellingMainContainer>
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

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <UpsertSellingMainContainer>
                          <FormInput
                            id="add1"
                            name="add1"
                            label="Address (line 1)"
                            value={values.add1}
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

                          <CountrySelect values={selectedCountry} handleChange={handleChangeCountry} title="Country" />

                          <UpsertSellingGridLeftCountryCode>
                            <Typography whiteSpace="nowrap">Fax (+country code)</Typography>
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
                                  type="number"
                                  value={values.faxNo}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </Grid>
                            </Grid>
                          </UpsertSellingGridLeftCountryCode>
                        </UpsertSellingMainContainer>
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <UpsertSellingMainContainer>
                          <FormInput
                            id="add2"
                            name="add2"
                            label="Address (line 2)"
                            value={values.add2}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          <FormInput id="city" name="city" label="City" value={values.city} onChange={handleChange} onBlur={handleBlur} />

                          <FormInput
                            id="website"
                            name="website"
                            label="Website"
                            value={values.website}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.website && Boolean(errors.website)}
                            helperText={touched.website ? errors.website : undefined}
                          />

                          <UpsertSellingGridLeftCountryCode>
                            <Typography sx={{ whiteSpace: 'nowrap' }}>Telephone (+country code)</Typography>
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
                                  id="phoneNo"
                                  name="phoneNo"
                                  type="number"
                                  value={values.phoneNo}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </Grid>
                            </Grid>
                          </UpsertSellingGridLeftCountryCode>
                        </UpsertSellingMainContainer>
                      </Grid>
                    </Grid>
                    <UpsertSellingCompanyLogoContainer>
                      <Typography>Company logo</Typography>
                      <DragAndDropSingleImage
                        name="companyLogo"
                        setFieldValue={setFieldValue}
                        file={values.companyLogo}
                        error={touched.companyLogo && Boolean(errors.companyLogo)}
                        formik={{ setFieldValue, setFieldError, setTouched, touched, errors }}
                      />
                      {touched.companyLogo && errors.companyLogo && <FormHelperText error>{errors.companyLogo}</FormHelperText>}
                    </UpsertSellingCompanyLogoContainer>

                    <UpsertSellingContainer>
                      <Typography>Is Multi Vendor</Typography>
                      <FormControlLabel
                        control={<Checkbox checked={values.multiVendor} onChange={() => handleChangeMultiVendor()} />}
                        label="Yes"
                      />
                    </UpsertSellingContainer>
                  </UpsertSellingMainContainer>
                </CardContent>
              </MainCard>
            </Grid>
          </Grid>

          <CardActionButtons isSubmitting={isSubmitting} id={sellingId} handleReset={handleReset} />
        </ViewMainContainer>
      </form>
    </>
  );
};

export default UpsertSellingCompanyForm;
