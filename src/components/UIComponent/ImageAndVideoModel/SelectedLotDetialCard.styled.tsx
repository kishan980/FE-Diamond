import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface SelectedLotDetialBoxProps {
  isLast: boolean;
}

export const SelectedLotDetialBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLast',
})<SelectedLotDetialBoxProps>(({ theme, isLast }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  borderBottom: isLast ? 'none' : '1px solid #ccc',
}));
