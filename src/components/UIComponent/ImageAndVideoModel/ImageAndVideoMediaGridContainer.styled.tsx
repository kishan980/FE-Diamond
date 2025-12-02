import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export const ImageStyledBox = styled(Image)(() => ({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  objectPosition: 'center',
}));

export const VideoStyledBox = styled('video')(() => ({
  width: '100%',
  borderRadius: 8,
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
}));

export const ImageAndVideoMediaBackDropBox = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const TextTypographyContainer = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  color: 'gray',
}));

export const StyledCountdownMessageLine = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  color: theme.palette.success.main,
  fontSize: '1rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.25rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.5rem',
  },
}));
