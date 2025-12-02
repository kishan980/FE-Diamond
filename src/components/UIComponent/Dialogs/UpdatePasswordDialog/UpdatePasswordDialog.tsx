'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import { Eye, EyeSlash, Minus, PasswordCheck, TickCircle } from 'iconsax-react';
import FormInput from 'components/UIComponent/FormInput';
import IconButton from 'components/@extended/IconButton';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import AnimateButton from 'components/@extended/AnimateButton';
import { updatePasswordDialogSchema } from 'validations/validationSchemas';
import { UpdatePasswordModelProps } from 'types/dialog';
import { isLowercaseChar, isNumber, isSpecialChar, isUppercaseChar, minLength } from 'utils/password-validation';

type PasswordField = 'password' | 'newPassword' | 'confirmPassword';

type PasswordErrorType = {
  password: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

const UpdatePasswordDialog = ({ open, handleClose, handleUpdateModalCilck }: UpdatePasswordModelProps) => {
  const [showPassword, setShowPassword] = useState<PasswordErrorType>({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  const initialValues = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  const { errors, values, touched, resetForm, handleBlur, setSubmitting, isSubmitting, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: updatePasswordDialogSchema,
    onSubmit: (values) => {
      handleUpdateModalCilck(values.password, values.newPassword, values.confirmPassword, setSubmitting, resetForm);
    },
  });

  const togglePasswordVisibility = (field: PasswordField) =>
    setShowPassword((prev: PasswordErrorType) => ({ ...prev, [field]: !prev[field] }));

  const handleDialogClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      content={
        <Box component="form" onSubmit={handleSubmit} sx={{ px: 3, py: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} textAlign="center">
              <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
                <Typography variant="h3">Reset Password</Typography>
                <Typography color="secondary">Please choose your new password</Typography>
              </Stack>
            </Grid>
            <Grid item container spacing={1}>
              <Grid item container xs={12} sm={6}>
                {['password', 'newPassword', 'confirmPassword'].map((field) => (
                  <Grid item xs={12} key={field}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor={`${field}-reset`}>
                        {field === 'password' ? 'Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                      </InputLabel>
                      <FormInput
                        fullWidth
                        id={`${field}-reset`}
                        type={showPassword[field as PasswordField] ? 'text' : 'password'}
                        name={field}
                        value={values[field as keyof typeof values]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched[field as keyof typeof touched] && Boolean(errors[field as keyof typeof errors])}
                        helperText={touched[field as keyof typeof touched] ? errors[field as keyof typeof errors] : undefined}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => togglePasswordVisibility(field as PasswordField)} edge="end">
                                {showPassword[field as PasswordField] ? <Eye /> : <EyeSlash />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Grid>
                ))}
              </Grid>

              <Grid item container xs={12} sm={6}>
                <Box sx={{ px: { xs: 2, sm: 3 } }}>
                  <Typography variant="h5">New Password must contain:</Typography>
                  <List sx={{ p: 0, mt: 1 }}>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: minLength(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {minLength(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 8 characters" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isLowercaseChar(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isLowercaseChar(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 lower letter (a-z)" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isUppercaseChar(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isUppercaseChar(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 uppercase letter (A-Z)" />
                    </ListItem>
                    <ListItem divider>
                      <ListItemIcon sx={{ color: isNumber(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isNumber(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 number (0-9)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: isSpecialChar(values.newPassword) ? 'success.main' : 'inherit' }}>
                        {isSpecialChar(values.newPassword) ? <TickCircle /> : <Minus />}
                      </ListItemIcon>
                      <ListItemText primary="At least 1 special characters" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={
                    isSubmitting ||
                    !minLength(values.newPassword) ||
                    !isLowercaseChar(values.newPassword) ||
                    !isUppercaseChar(values.newPassword) ||
                    !isNumber(values.newPassword) ||
                    !isSpecialChar(values.newPassword)
                  }
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<PasswordCheck />}
                >
                  Reset Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </Box>
      }
    />
  );
};

export default UpdatePasswordDialog;
