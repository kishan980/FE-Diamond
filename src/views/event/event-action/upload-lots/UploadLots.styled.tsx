import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

export const UploadLotsSecondaryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  '& .MuiOutlinedInput-input': {
    width: '100px',
  },
}));

export const UploadLotsStackContainerButton = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'end',
  margin: theme.spacing(1),
}));

export const UploadLotsStackSelectMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    flexDirection: 'row',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const UploadLotsStackSelectBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  width: '100%',
  maxWidth: '380px',
}));

export const UploadLotsStackSelectContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const UploadPhotosMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    paddingInline: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export const UploadPhotosFieldBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
}));

export const UploadPhotosField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  width: '100%',
}));

export const UploadTitleTypography = styled(Typography)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.spacing(17.55),
  color: '#808080',
  fontWeight: 'bold',
}));

export const UploadDescriptionMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export const UploadDescriptionMain = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const UploadDescriptionFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const UploadLotsStackButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const UploadLotsStackButton = styled(Stack)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '14px',
    paddingRight: '14px',
    flexDirection: 'column',
    width: '100%',
  },
}));

export const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'rgba(0, 0, 0, 0.5)',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.7)',
  },
}));

export const UploadButton = styled(Button)(() => ({
  whiteSpace: 'nowrap',
  height: 'fit-content',
  textTransform: 'none',
  width: '100%',
}));
