import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const ExcelDialogContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 20px 20px 20px',
  gap: theme.spacing(1.5),
}));

export const ExcelDialogPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  boxShadow: 'none',
}));
