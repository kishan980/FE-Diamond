import LinearProgress from '@mui/material/LinearProgress';
import { LoaderMainBox } from './Loader.styled';

const Loader = () => (
  <LoaderMainBox>
    <LinearProgress color="primary" sx={{ height: 4 }} />
  </LoaderMainBox>
);

export default Loader;
