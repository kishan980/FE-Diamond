import { styled } from '@mui/material/styles';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export const StyledMobileDatePicker = styled(MobileDatePicker)(() => ({
  width: '100%',
  maxWidth: 124,
  textTransform: 'none',
  '& .MuiFormLabel-root': { lineHeight: '1.4375em !important' },
}));
