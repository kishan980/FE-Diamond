import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

export const StyledMainCard = styled(MainCard)(({ theme }) => ({
  '& .MuiCardHeader-root': {
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),

    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  '& .MuiCardHeader-content': {
    width: '100%',
  },
}));
