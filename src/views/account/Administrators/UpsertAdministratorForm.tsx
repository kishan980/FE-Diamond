'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { Eye, EyeSlash } from 'iconsax-react';
import { InputWithHelperAction } from '../CommonAccount.styled';
import { AdministratorsAccessCheckTitle, AdministratorsAccessCheckType } from './Administrators.styled';
import countries from 'data/countries';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import UICheckBox from 'components/UIComponent/CheckBox';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import CountryCodeSelect from 'components/UIComponent/CountryCodeSelect';
import UpsertTitleContainer from 'components/UIComponent/UpsertTitleContainer';
import { ViewMainContainer } from 'views/event/Event.styled';
import { administratorSchema } from 'validations/validationSchemas';
import { UpsertSellingGridLeftCountryCode } from 'views/parameter/SellingCompany/SellingCompany.styled';
import { UpsertDocumentDescMainContainer, UpsertDocumentDesContainer } from 'views/parameter/LegalDocument/UpsertLegalDocument.styled';
import { AdministratorServices } from 'services/account/administrators/administrators.services';
import { handleGeneratePassword } from 'utils/passwordUtils';
import { checkUsernameAvailability } from 'utils/checkUsernameAvailability';
import { CountryType } from 'types/country';
import { LoadingState } from 'types/table';
import { AddAdministratorParams, AdministratorsByIdData } from 'services/account/administrators/type';
import CircularLoader from 'components/CircularLoader';
import PrintLogo from 'components/logo/PrintLogo';
import { checkDownloadAccess } from 'utils/userAccessUtils';

const UpsertAdministratorForm = () => {
  const { id } = useParams();
  const administratorsId = Number(id);
  const { push } = useRouter();

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false, isCircularLoading: false });
  const [administratorsData, setAdministratorsData] = useState<AdministratorsByIdData>();
  const [archive, setArchive] = useState<boolean>(false);
  const [parameters, setParameters] = useState<boolean>(false);
  const [downloadFiles, setDownloadFiles] = useState<boolean>(false);
  const [accessPassword, setAccessPassword] = useState<boolean>(false);
  const [generatePassword, setGeneratePassword] = useState('');
  const [selectCountry, setSelectCountry] = useState<CountryType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDownloadAccess, setIsDownloadAccess] = useState(false);

  const initialValues = {
    username: '',
    password: generatePassword || '',
    confirmpassword: '',
    contactPerson: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    archive: false,
    parameters: false,
    downloadFiles: false,
    accessPassword: false,
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
    validationSchema: administratorSchema(administratorsId, isDownloadAccess),
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (values: AddAdministratorParams) => {
    try {
      const res = administratorsId
        ? await AdministratorServices.update({ ...values, id: administratorsId })
        : await AdministratorServices.add(values);
      if (typeof res !== 'string' && res.success) {
        toast.success('Administrator ' + (administratorsId ? 'updated' : 'added') + ' successfully');
        push('/account/administrators');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting:', error);
      toast.error('Error submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckAvailability = async () =>
    await checkUsernameAvailability(values.username, AdministratorServices.checkUsername, setLoading);

  const handlePasswordGeneration = () => handleGeneratePassword(setGeneratePassword, setValues);

  const handleGetAdministratorsById = async (id: number) => {
    setLoading((prev) => ({ ...prev, isCircularLoading: true }));
    try {
      const res = await AdministratorServices.getById(id);
      if (typeof res !== 'string' && res.success) setAdministratorsData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      toast.error('Error fetching data.');
    } finally {
      setLoading((prev) => ({ ...prev, isCircularLoading: false }));
    }
  };

  const handleCheckboxChange = (field: keyof AddAdministratorParams, setValue: Dispatch<SetStateAction<boolean>>) => {
    return () => {
      setValue((prev: boolean) => {
        const newValue = !prev;
        setValues((prevValues) => ({ ...prevValues, [field]: newValue }));
        return newValue;
      });
    };
  };

  const handleChangeCountry = (value: CountryType | null) => {
    setSelectCountry(value);
    setFieldValue('countryCode', value?.phone || '');
  };

  useEffect(() => {
    checkDownloadAccess(setIsDownloadAccess, setLoading);
  }, []);

  useEffect(() => {
    if (administratorsId) handleGetAdministratorsById(administratorsId);
  }, [administratorsId]);

  useEffect(() => {
    if (administratorsData) {
      setValues((prevValues) => {
        return {
          ...prevValues,
          username: administratorsData?.user_name || '',
          password: administratorsData?.Password || '',
          contactPerson: administratorsData?.contactPerson || '',
          email: administratorsData?.emailID1 || '',
          countryCode: administratorsData?.mobileCountry1 || '',
          phoneNumber: administratorsData?.mobileno1 || '',
          archive: Boolean(administratorsData?.IsAccessArchives),
          parameters: Boolean(administratorsData?.IsParameterAccess),
          downloadFiles: Boolean(administratorsData?.IsDownloadAccess),
          accessPassword: Boolean(administratorsData?.IsPassword),
        };
      });
      setArchive(Boolean(administratorsData?.IsAccessArchives));
      setParameters(Boolean(administratorsData?.IsParameterAccess));
      setDownloadFiles(Boolean(administratorsData?.IsDownloadAccess));
      setAccessPassword(Boolean(administratorsData?.Accountcode));
      setSelectCountry(countries.find((val) => val.phone === administratorsData?.mobileCountry1) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [administratorsData]);

  useEffect(() => {
    setValues((prevValues) => ({ ...prevValues, archive, parameters, downloadFiles, accessPassword }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {(loading.isCircularLoading || loading.isLoading) && <CircularLoader isProgress={loading.isCircularLoading || loading.isLoading} />}
      <PrintLogo />
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <UpsertTitleContainer id={administratorsId} entityName="Administrator Registration" />
          <Grid container spacing={3} className="print-form-container">
            <Grid item xs={12}>
              <MainCard title="Administrator Details" content={false}>
                <CardContent>
                  <UpsertDocumentDescMainContainer>
                    <UpsertDocumentDesContainer>
                      {!administratorsId && (
                        <>
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
                            />
                            <Typography sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => handleCheckAvailability()}>
                              Check availability
                            </Typography>
                          </InputWithHelperAction>
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
                          Mobile (+country code) 1 <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4} sm={2} md={2} lg={2}>
                            <CountryCodeSelect
                              id="mobile-country-1"
                              values={selectCountry}
                              handleChange={handleChangeCountry}
                              error={touched.countryCode && Boolean(errors.countryCode)}
                            />
                          </Grid>
                          <Grid item xs={8} sm={10} md={10} lg={10}>
                            <FormInput
                              id="phoneNumber"
                              name="phoneNumber"
                              value={values.phoneNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                            />
                            {touched.countryCode && errors.countryCode && touched.phoneNumber && errors.phoneNumber ? (
                              <FormHelperText error id="combined-error">
                                Country code and mobile number are required
                              </FormHelperText>
                            ) : (
                              touched.phoneNumber &&
                              errors.phoneNumber && (
                                <FormHelperText error id="phone-number-error">
                                  {errors.phoneNumber}
                                </FormHelperText>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </UpsertSellingGridLeftCountryCode>
                      {(isDownloadAccess || (isDownloadAccess && !administratorsId)) && (
                        <AdministratorsAccessCheckTitle>
                          <Typography>
                            Access to<span style={{ color: 'red' }}>*</span>
                          </Typography>
                          <AdministratorsAccessCheckType>
                            <UICheckBox checked={values.archive} label="History" onChange={handleCheckboxChange('archive', setArchive)} />
                            <UICheckBox
                              checked={values.parameters}
                              label="Master Setup"
                              onChange={handleCheckboxChange('parameters', setParameters)}
                            />
                            <UICheckBox
                              checked={values.downloadFiles}
                              label="Download Files"
                              onChange={handleCheckboxChange('downloadFiles', setDownloadFiles)}
                            />
                            <UICheckBox
                              checked={values.accessPassword}
                              label="Access Password"
                              onChange={handleCheckboxChange('accessPassword', setAccessPassword)}
                            />
                          </AdministratorsAccessCheckType>
                          {errors.accessPassword && touched.accessPassword && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                              {errors.accessPassword}
                            </FormHelperText>
                          )}
                        </AdministratorsAccessCheckTitle>
                      )}
                    </UpsertDocumentDesContainer>
                  </UpsertDocumentDescMainContainer>
                </CardContent>
              </MainCard>
            </Grid>
          </Grid>
          <CardActionButtons isSubmitting={isSubmitting} id={administratorsId} handleReset={handleReset} />
        </ViewMainContainer>
      </form>
    </>
  );
};

export default UpsertAdministratorForm;
