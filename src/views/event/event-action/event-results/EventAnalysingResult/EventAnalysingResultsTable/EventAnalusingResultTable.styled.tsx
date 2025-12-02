import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const DownloadButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.875rem',
  },
}));
