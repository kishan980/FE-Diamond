import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const TermsAndConditionFormMainContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const TermsAndConditionFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '550px',
}));

export const TermsAndConditionDragPdf = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
}));

export const RevisedTermsAndConditionmMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  width: '100%',
}));

export const RevisedTermsAndConditionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
}));
