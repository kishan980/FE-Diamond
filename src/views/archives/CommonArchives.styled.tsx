import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

export const StyledMainCard = styled(MainCard)(({ theme }) => ({
  '& .MuiCardHeader-root': {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
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
