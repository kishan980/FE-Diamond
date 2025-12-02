import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const EventResultMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export const EventResultChildContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  width: '100%',
}));

export const EventResultChildBox = styled(Box)(({ theme }) => ({
  flex: theme.spacing(1),
}));

export const StyledEventResultsTotalValueContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  width: 'auto',
  minWidth: 250,
  maxWidth: '100%',
  textAlign: 'center',
}));

export const MainBoxContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledUploadButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '42px',
  whiteSpace: 'nowrap',
  fontSize: '0.75rem',

  [theme.breakpoints.up('sm')]: {
    fontSize: '0.875rem',
  },
}));
