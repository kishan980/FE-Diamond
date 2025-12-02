import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

export const FooterMainContainer = styled(Box)(() => ({
  marginTop: 'auto',
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: theme.spacing(2.5),
}));

export const MainBoxContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

export const ContainerBox = styled(Container)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100vh - 144px)',
}));
