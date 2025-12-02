import Box from '@mui/material/Box';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

export const PreviewImageAndVideoBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    paddingInline: theme.spacing(2),
  },
}));

export const PreviewImageContainer = styled(Image)(() => ({
  objectFit: 'contain',
  objectPosition: 'center',
  maxHeight: 500,
  minWidth: 220,
  height: '100%',
  width: '100%',
}));
