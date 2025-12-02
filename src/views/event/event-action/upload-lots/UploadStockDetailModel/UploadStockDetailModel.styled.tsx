import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const UploadStockDetailMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingBottom: '16px',
    gap: theme.spacing(1),
  },
}));

export const UploadStockDetailInnerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const UploadStockDetailField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const UploadStockDetailTitleTypography = styled(Typography)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.spacing(17.55),
  color: '#808080',
  fontWeight: 'bold',
}));
