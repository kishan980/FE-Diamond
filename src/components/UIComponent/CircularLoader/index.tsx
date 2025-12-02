import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const CircularLoader = ({ isProgress }: { isProgress: boolean }) => (
  <Backdrop sx={{ zIndex: 10000 }} open={isProgress}>
    <CircularProgress color="primary" />
  </Backdrop>
);

export default CircularLoader;
