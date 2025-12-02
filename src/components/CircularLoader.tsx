import CircularProgress from '@mui/material/CircularProgress';
import { StyledBackdrop } from 'views/common.styled';

const CircularLoader = ({ isProgress }: { isProgress: boolean }) => (
  <StyledBackdrop open={isProgress} sx={{ zIndex: 2000 }}>
    <CircularProgress color="primary" />
  </StyledBackdrop>
);

export default CircularLoader;
