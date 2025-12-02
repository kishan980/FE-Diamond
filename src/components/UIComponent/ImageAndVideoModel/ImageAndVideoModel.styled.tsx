import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export const ImageAndVideoMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(1),
}));

export const ImageAndVideoContainer = styled(Box)(() => ({
  borderBottom: 1,
  borderColor: 'divider',
}));

export const ImageAndVideoContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: theme.spacing(2),
  gap: theme.spacing(2),
  overflowY: 'auto',
}));

export const ImageAndVideoCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#f4f4f4',
  boxShadow: 'none',
  borderRadius: 10,
  padding: theme.spacing(1),
}));

export const ImageAndVideoMediaGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: theme.spacing(1.5),
  maxHeight: 260,
  overflowY: 'auto',
}));

export const ImageAndVideoMediaBox = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  aspectRatio: '1',
  cursor: 'pointer',
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
}));
