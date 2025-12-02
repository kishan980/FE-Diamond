import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

export const ContainerBox = styled(Container)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100vh - 170px)',
}));
