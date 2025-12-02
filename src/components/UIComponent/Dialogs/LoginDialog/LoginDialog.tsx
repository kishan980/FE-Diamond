'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';
import { ArrowCircleRight2, CloseCircle, Eye, EyeSlash } from 'iconsax-react';
import FormInput from 'components/UIComponent/FormInput';
import AnimateButton from 'components/@extended/AnimateButton';
import { LoginModelProps } from 'types/dialog';
import { loginDialogSchema } from 'validations/validationSchemas';

const LoginDialog = ({ open, handleClose, handleLoginModalCilck }: LoginModelProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const { errors, values, touched, handleBlur, setSubmitting, resetForm, isSubmitting, handleChange, handleSubmit } = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: loginDialogSchema,
    onSubmit: (values) => {
      handleLoginModalCilck(values.password, setSubmitting, () => {
        resetForm();
        handleClose();
      });
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleDialogClose = () => {
    resetForm();
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 1, py: 1.5 }}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Password:</DialogContentText>
          <FormInput
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password ? errors.password : undefined}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 0.5 }}
          />
        </DialogContent>
        <DialogActions>
          <AnimateButton>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              type="submit"
              fullWidth
              size="small"
              startIcon={<ArrowCircleRight2 color="#d9e3f0" />}
            >
              Continue
            </LoadingButton>
          </AnimateButton>
          <Button color="error" size="small" onClick={handleDialogClose} startIcon={<CloseCircle />}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;
