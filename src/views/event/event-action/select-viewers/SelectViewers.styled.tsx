import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const ViewSelectMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  '& .MuiOutlinedInput-input': { width: '100px' },
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', marginTop: '-8px' },
}));
