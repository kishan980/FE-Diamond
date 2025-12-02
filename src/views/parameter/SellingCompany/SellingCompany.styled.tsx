import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

export const UpsertSellingMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const UpsertSellingGridLeftCountryCode = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
}));

export const UpsertSellingCompanyLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
}));

export const UpsertSellingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledMainCard = styled(MainCard)(({ theme }) => ({
  '& .MuiCardHeader-root': {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),

    '& .MuiCardHeader-action': {
      margin: 0,
      alignSelf: 'flex-start',
      width: '100%',

      [theme.breakpoints.up('sm')]: {
        margin: '0px auto',
        alignSelf: 'center',
        width: 'auto',
      },
    },
  },
}));
