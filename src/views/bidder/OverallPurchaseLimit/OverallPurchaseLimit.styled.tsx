import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const OverallPurchaseLimitMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  margin: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'end' },
}));

export const OverallPurchaseLimitFilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
}));

export const OverallPurchaseLimitMinAndMaxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

export const OverallPurchaseLimitFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
}));

export const OverallPurchaseBoxContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  border: '1px solid #ccc',
  borderRadius: theme.spacing(2),
  backgroundColor: '#f9f9f9',
  whiteSpace: 'pre-wrap',
  height: 320,
  overflow: 'auto',
}));

export const OverallPurchaseLimitDetailsLoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(2),
}));
