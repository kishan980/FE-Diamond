import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const UploadXLSFileMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export const UploadXLSFileButton = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
}));
