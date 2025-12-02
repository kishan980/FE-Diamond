import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const AuthSliderMainContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '&:before': {
    content: '" "',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'linear-gradient(338deg, rgba(0, 0, 0, 0.3), transparent)',
  },
}));

export const AuthSliderContainer = styled(Box)(({ theme }) => ({
  width: 500,
  margin: '0 auto',
  color: theme.palette.common.white,
  '& .slick-dots': {
    bottom: '-45px',
    '& li': {
      width: 'auto',
      margin: 0,
      '& button': {
        width: 'auto',
        '&:before': {
          position: 'relative',
          display: 'inline-block',
          content: '""',
          width: 6,
          height: 6,
          borderRadius: theme.spacing(1),
          backgroundColor: theme.palette.common.white,
        },
      },
      '&.slick-active button:before': { width: 30 },
    },
  },
  '& .MuiSkeleton-root': { backgroundColor: '#403f69' },
}));

export const SliderMainBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const EventTitleBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const EventTypeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const EventTimeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  '& .MuiTypography-root': {
    lineHeight: 1,
    [theme.breakpoints.down('md')]: { lineHeight: 1.25 },
  },
}));
