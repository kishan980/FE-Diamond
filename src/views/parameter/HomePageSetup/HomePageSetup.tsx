'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHelperText from '@mui/material/FormHelperText';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { UIStyledGrid } from '../OverallPurchaseLimit/OverallPurchaseLimit.styled';
import { UpsertEmailBodyContainer } from '../EmailTemplates/UpsertEmailTemplate.styled';
import { HomePageGridLeftCountryCode } from './HomePageSetup.styled';
import { HomePageProfileData, UpdateHomePageProfileParams } from 'services/parameter/homePageSetup/type';
import Loader from 'components/Loader';
import useConfig from 'hooks/useConfig';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import { ViewMainContainer } from 'views/event/Event.styled';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EventServices } from 'services/event/event.services';
import { PlatformDisplayData } from 'services/event/types';
import { extractFirstItemValue } from 'utils/extractFirstItemValue';
import { StyledSelect } from 'components/UIComponent/ThemeCSS/StyleSelect';
import { CountryType } from 'types/country';
import CountryCodeSelect from 'components/UIComponent/CountryCodeSelect';
import countries from 'data/countries';
import AnimateButton from 'components/@extended/AnimateButton';
import { HomePageSetupServices } from 'services/parameter/homePageSetup/homePageSetup.services';
import CircularLoader from 'components/CircularLoader';
import { LoadingState } from 'types/table';
import { homePageDisplaySchema } from 'validations/validationSchemas';
import { useFooter } from 'contexts/FooterContext';

const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

type CompanyInfoFormValues = {
  refcomapnyIdComapanyInfo: number;
  companyName: string;
  address: string;
  countryCode: string;
  helpDesk: string;
  telephoneCountryCode: string;
  telephoneNumber: string;
  additionalTelephoneNumber: string;
  additionTelCountryCode: string;
  faxCountry: string;
  faxNumber: string;
  email: string;
  website: string;
  emailBody: string;
};

const HomePageSetup = () => {
  const { themeDirection } = useConfig();

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });
  const [homePageData, setHomePageData] = useState<HomePageProfileData>();
  const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());
  const [platformDisplayData, setPlatformDisplayData] = useState<PlatformDisplayData[]>([]);
  const [selectCountryHelpDesk, setSelectCountryHelpDesk] = useState<CountryType | null>(null);
  const [selectCountryTel, setSelectCountryTel] = useState<CountryType | null>(null);
  const [selectCountryAdditionTel, setSelectCountryAdditionTel] = useState<CountryType | null>(null);
  const [selectCountryFax, setSelectCountryFax] = useState<CountryType | null>(null);
  const { refreshFooter } = useFooter();

  const initialValues: CompanyInfoFormValues = {
    refcomapnyIdComapanyInfo: 0,
    companyName: '',
    address: '',
    countryCode: '',
    helpDesk: '',
    telephoneCountryCode: '',
    telephoneNumber: '',
    additionalTelephoneNumber: '',
    additionTelCountryCode: '',
    faxCountry: '',
    faxNumber: '',
    email: '',
    website: '',
    emailBody: '',
  };

  const { errors, values, touched, handleChange, handleBlur, setValues, handleSubmit, setFieldValue, isSubmitting } = useFormik({
    initialValues,
    validationSchema: homePageDisplaySchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const fetchHomePageSetup = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    const res = await HomePageSetupServices.getHomepageProfile();
    if (typeof res !== 'string' && res.success) setHomePageData(res.data);
    setLoading((prev) => ({ ...prev, isProgress: false }));
  }, []);

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    setFieldValue('emailBody', htmlContent);
  };

  const handleSubmitForm = async (values: CompanyInfoFormValues) => {
    const params: UpdateHomePageProfileParams = {
      company_id: values.refcomapnyIdComapanyInfo,
      company_name: values.companyName,
      address: values.address,
      contactNo1: `${values.additionTelCountryCode}#${values.additionalTelephoneNumber}`,
      contactNo2: `${values.telephoneCountryCode}#${values.telephoneNumber}`,
      faxNo1: `${values.faxCountry}#${values.faxNumber}`,
      helpDeskNo: `${values.countryCode}#${values.helpDesk}`,
      emailId: values.email,
      webURL: values.website,
      uptender: values.emailBody,
    };
    const res = await HomePageSetupServices.updateHomepageProfile(params);
    if (typeof res !== 'string' && res.success) {
      toast.success('Home page updated successfully');
      refreshFooter();
    }
  };

  const fetchPlatformDisplay = async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));

    const platformDisplay = await EventServices.getPlatformDisplay();
    if (typeof platformDisplay !== 'string' && platformDisplay.success) setPlatformDisplayData(platformDisplay.data);

    setValues({
      ...values,
      refcomapnyIdComapanyInfo: extractFirstItemValue(platformDisplay, 'CompanyID', 0),
    });
    setLoading((prev) => ({ ...prev, isProgress: false }));
  };

  const handleChangeCountryHelpDesk = (value: CountryType | null) => {
    setSelectCountryHelpDesk(value);
    setFieldValue('countryCode', value?.phone || '');
  };

  const handleChangeCountryTel = (value: CountryType | null) => {
    setSelectCountryTel(value);
    setFieldValue('telephoneCountryCode', value?.phone || '');
  };

  const handleChangeCountryAdditionTel = (value: CountryType | null) => {
    setSelectCountryAdditionTel(value);
    setFieldValue('additionTelCountryCode', value?.phone || '');
  };

  const handleChangeCountryFax = (value: CountryType | null) => {
    setSelectCountryFax(value);
    setFieldValue('faxCountry', value?.phone || '');
  };

  const parseContactInfo = (contactString: string | undefined): [string, string] => {
    const [countryCode, number] = contactString?.split('#') || ['', ''];
    return [countryCode, number];
  };

  useEffect(() => {
    fetchPlatformDisplay();
    fetchHomePageSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (homePageData) {
      const [helpDeskCountry, helpDeskNumber] = parseContactInfo(homePageData.HelpDeskNo);
      const [telCountry, telNumber] = parseContactInfo(homePageData.ContactNo2);
      const [additionalCountry, additionalNumber] = parseContactInfo(homePageData.ContactNo1);
      const [faxCountryCode, faxNo] = parseContactInfo(homePageData.FaxNo1);

      setValues({
        ...values,
        refcomapnyIdComapanyInfo: homePageData?.CompanyID ?? (platformDisplayData.length > 0 ? platformDisplayData[0].CompanyID : 0),
        companyName: homePageData?.CompanyName || '',
        address: homePageData?.Address || '',
        countryCode: helpDeskCountry || '',
        helpDesk: helpDeskNumber || '',
        telephoneCountryCode: telCountry || '',
        telephoneNumber: telNumber || '',
        additionalTelephoneNumber: additionalNumber || '',
        additionTelCountryCode: additionalCountry || '',
        faxCountry: faxCountryCode || '',
        faxNumber: faxNo || '',
        email: homePageData?.EmailID1 || '',
        website: homePageData?.WebURL || '',
        emailBody: homePageData?.uptender || '',
      });

      setSelectCountryHelpDesk(countries.find((val) => val.phone === helpDeskCountry) || null);
      setSelectCountryTel(countries.find((val) => val.phone === telCountry) || null);
      setSelectCountryAdditionTel(countries.find((val) => val.phone === additionalCountry) || null);
      setSelectCountryFax(countries.find((val) => val.phone === faxCountryCode) || null);

      if (homePageData?.uptender) {
        const contentState = stateFromHTML(homePageData.uptender);
        setEditorState(EditorState.createWithContent(contentState));
      } else setEditorState(EditorState.createEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePageData]);

  return loading?.isLoading ? (
    <Loader />
  ) : (
    <>
      {loading.isProgress && <CircularLoader isProgress={loading.isProgress} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <MainCard title="Home Page Setup" content={false}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <FormControl size="small" sx={{ width: '100%' }}>
                    <InputLabel>
                      Select <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <StyledSelect
                      size="small"
                      id="refcomapnyIdComapanyInfo"
                      name="refcomapnyIdComapanyInfo"
                      value={values.refcomapnyIdComapanyInfo}
                      onChange={handleChange}
                      error={Boolean(errors.refcomapnyIdComapanyInfo) && touched.refcomapnyIdComapanyInfo}
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
                </Grid>

                <Grid item xs={12} sm={6}>
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    id="address"
                    name="address"
                    label="Address"
                    required
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address ? errors.address : undefined}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <HomePageGridLeftCountryCode>
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      Helpdesk number (+country code) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4} sm={2} md={3} lg={2}>
                        <CountryCodeSelect
                          id="helpdesk-country-1"
                          values={selectCountryHelpDesk}
                          handleChange={handleChangeCountryHelpDesk}
                          error={touched.countryCode && Boolean(errors.countryCode)}
                        />
                      </Grid>
                      <Grid item xs={8} sm={10} md={9} lg={10}>
                        <FormInput
                          id="helpDesk"
                          name="helpDesk"
                          value={values.helpDesk}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.helpDesk && Boolean(errors.helpDesk)}
                        />
                        {touched.countryCode && errors.countryCode && touched.helpDesk && errors.helpDesk ? (
                          <FormHelperText error id="combined-error">
                            Country code and mobile number are required
                          </FormHelperText>
                        ) : (
                          touched.helpDesk &&
                          errors.helpDesk && (
                            <FormHelperText error id="phone-number-error">
                              {errors.helpDesk}
                            </FormHelperText>
                          )
                        )}
                      </Grid>
                    </Grid>
                  </HomePageGridLeftCountryCode>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <HomePageGridLeftCountryCode>
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
                        {touched.telephoneCountryCode &&
                        errors.telephoneCountryCode &&
                        touched.telephoneNumber &&
                        errors.telephoneNumber ? (
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
                  </HomePageGridLeftCountryCode>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <HomePageGridLeftCountryCode>
                    <Typography sx={{ whiteSpace: 'nowrap' }}>Additional telephone (+country code)</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4} sm={2} md={3} lg={2}>
                        <CountryCodeSelect
                          id="additionalTel-country"
                          values={selectCountryAdditionTel}
                          handleChange={handleChangeCountryAdditionTel}
                        />
                      </Grid>
                      <Grid item xs={8} sm={10} md={9} lg={10}>
                        <FormInput
                          id="additionalTelephoneNumber"
                          name="additionalTelephoneNumber"
                          type="number"
                          value={values.additionalTelephoneNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                    </Grid>
                  </HomePageGridLeftCountryCode>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <HomePageGridLeftCountryCode>
                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                      Fax (+country code) <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4} sm={2} md={3} lg={2}>
                        <CountryCodeSelect
                          id="fax-country-1"
                          values={selectCountryFax}
                          handleChange={handleChangeCountryFax}
                          error={touched.faxCountry && Boolean(errors.faxCountry)}
                        />
                      </Grid>
                      <Grid item xs={8} sm={10} md={9} lg={10}>
                        <FormInput
                          id="faxNumber"
                          name="faxNumber"
                          value={values.faxNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.faxNumber && Boolean(errors.faxNumber)}
                        />
                        {touched.faxCountry && errors.faxCountry && touched.faxNumber && errors.faxNumber ? (
                          <FormHelperText error id="combined-error">
                            Country code and mobile number are required
                          </FormHelperText>
                        ) : (
                          touched.faxNumber &&
                          errors.faxNumber && (
                            <FormHelperText error id="phone-number-error">
                              {errors.faxNumber}
                            </FormHelperText>
                          )
                        )}
                      </Grid>
                    </Grid>
                  </HomePageGridLeftCountryCode>
                </Grid>

                <Grid item xs={12} sm={6}>
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormInput
                    id="website"
                    name="website"
                    label="Website"
                    value={values.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <UIStyledGrid themeDirection={themeDirection} container spacing={2}>
                    <Grid item xs={12}>
                      <UpsertEmailBodyContainer>
                        <InputLabel>
                          Email body <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <Editor editorState={editorState} onEditorStateChange={handleEditorChange} />
                        {errors.emailBody && touched.emailBody && <FormHelperText error>{errors.emailBody}</FormHelperText>}
                      </UpsertEmailBodyContainer>
                    </Grid>
                  </UIStyledGrid>
                </Grid>
              </Grid>
            </CardContent>
          </MainCard>

          <CardActions>
            <AnimateButton>
              <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                Update Home Page
              </LoadingButton>
            </AnimateButton>
          </CardActions>
        </ViewMainContainer>
      </form>
    </>
  );
};

export default HomePageSetup;
