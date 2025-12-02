import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  padding: '8px 16px',
  marginBottom: theme.spacing(2),
}));

export default StyledAlert;
