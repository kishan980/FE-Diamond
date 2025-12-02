import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

export const StyledMainCard = styled(MainCard)(({ theme }) => ({
  '& .MuiCardHeader-root': {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    gap: theme.spacing(0.5),
    alignItems: 'flex-start',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
      gap: theme.spacing(1),
      alignItems: 'center',
      flexDirection: 'row',
    },
  },
  '& .MuiCardHeader-action': {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
}));
