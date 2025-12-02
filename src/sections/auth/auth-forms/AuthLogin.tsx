'use client';
import { useState, SyntheticEvent } from 'react';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Links from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoadingButton } from '@mui/lab';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import getCustomErrorMessage from 'utils/error.utitls';
import StyledAlert from 'components/UIComponent/StyledAlert';
import { LoginUserParams } from 'services/authuser/types';
import { ReCaptchaService } from 'services/reCaptcha/reCaptcha.services';

const AuthLogin = () => {
  const { push } = useRouter();
  const [alert, setAlert] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginUserParams = { userName: '', password: '', token: '' };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('User name is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event: SyntheticEvent) => event.preventDefault();

  const handleFormSubmit = async (values: LoginUserParams) => {
    try {
      const reCaptchaToken = await ReCaptchaService.generateToken();

      if (!reCaptchaToken) {
        setAlert('ReCaptcha token generation failed. Please try again.');
        return;
      }

      const res = await signIn('login', {
        redirect: false,
        userName: values.userName,
        password: values.password,
        token: reCaptchaToken,
      });

      if (res?.status === 200) push('/event');
      else if (res?.error) setAlert(res.error);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error logging in auth:', error);
      setAlert(getCustomErrorMessage(error));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: LoginUserParams) => handleFormSubmit(values)}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {Boolean(alert) && <StyledAlert severity="error">{alert}</StyledAlert>}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel sx={{ color: '#000' }}>Username</InputLabel>
                <OutlinedInput
                  type="text"
                  value={values.userName}
                  name="userName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter User name"
                  fullWidth
                  error={Boolean(touched.userName && errors.userName)}
                />
                {touched.userName && errors.userName && <FormHelperText error>{errors.userName}</FormHelperText>}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel sx={{ color: '#000' }}>Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
                {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Links variant="h6" component={Link} href={'/forgot-password'} color="text.primary">
                  Forgot Password?
                </Links>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <LoadingButton loading={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                  Login
                </LoadingButton>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthLogin;
