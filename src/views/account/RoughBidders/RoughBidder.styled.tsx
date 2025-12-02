import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const RoughBidderStatusConatinerPoint = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

export const MainStyleBoxConatiner = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'normal',
  },
}));

export const MainBoxContainer = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
}));

export const IconsMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1),
  },
}));
