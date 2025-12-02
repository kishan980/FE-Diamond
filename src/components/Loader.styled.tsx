'use client';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const LoaderMainBox = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
}));
