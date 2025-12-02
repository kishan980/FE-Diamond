import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const UpsertDefinedFilterMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const UpsertDefinedFilterTabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: theme.spacing(1),
  borderColor: 'divider',
}));

export const UpsertDefinedFilterButtonsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
}));

export const UpsertSelectedMainColumnContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));

export const UpsertSelectedColumnContainer = styled(Box)(({ theme }) => ({
  minWidth: '200px',
  border: '1px solid #ddd',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flex: '1 1 100%',
  },
  [theme.breakpoints.up('sm')]: {
    flex: '1 1 calc(25% - 16px)',
  },
}));

export const UpsertCustomisedButtontainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

export const ConfirmModelButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  '&:hover': { backgroundColor: '#0056b3' },
}));
