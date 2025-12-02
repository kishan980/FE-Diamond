'use client';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Stack } from '@mui/system';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import Links from '@mui/material/Link';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { ArrowLeft } from 'iconsax-react';
import { ForgotPasswordMainBox } from './AuthForgotPassword.styled';
import { ForgotPasswordParams } from 'services/authuser/types';
import getCustomErrorMessage from 'utils/error.utitls';
import StyledAlert from 'components/UIComponent/StyledAlert';
import AnimateButton from 'components/@extended/AnimateButton';
import { AuthServices } from 'services/authuser/authuser.services';

const AuthForgotPassword = () => {
  const [alert, setAlert] = useState('');
  const [isShowSentEmail, setIsShowSentEmail] = useState(false);

  const initialValues: ForgotPasswordParams = { email: '' };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
  });

  const handleFormSubmit = async (values: ForgotPasswordParams) => {
    try {
      const res = await AuthServices.forgotPassword({ email: values.email });

      if (typeof res !== 'string') {
        if (res.success) setIsShowSentEmail(true);
        else setAlert(res.error);
      } else setAlert(res);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error forgot password:', error);
      setAlert(getCustomErrorMessage(error));
    }
  };

  return isShowSentEmail ? (
    <ForgotPasswordMainBox>
      <Typography variant="h5">
        An email with a password has been sent to your provided email address. It might take a few minutes to arrive. Please also check your
        spam or junk folder.
      </Typography>
      <Button variant="contained" LinkComponent={Link} href="/" startIcon={<ArrowLeft />}>
        Back to Login
      </Button>
    </ForgotPasswordMainBox>
  ) : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: ForgotPasswordParams) => handleFormSubmit(values)}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {Boolean(alert) && <StyledAlert severity="error">{alert}</StyledAlert>}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel sx={{ color: '#000' }}>Email</InputLabel>
                <OutlinedInput
                  type="text"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" alignItems="center" spacing={2} gap={1}>
                Already remenber password?
                <Links variant="h6" component={Link} href="/" color="primary.main">
                  Login
                </Links>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <LoadingButton loading={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                  Submit
                </LoadingButton>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthForgotPassword;
