import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const NavStyledPaper = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  marginTop: theme.spacing(1.5),
  backgroundImage: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

export const NavInnerStyledPaper = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  marginTop: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),

  border: `1px solid ${theme.palette.divider}`,
  backgroundImage: 'none',
}));

export const NavGroupStyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  border: `1px solid ${theme.palette.divider}`,
  backgroundImage: 'none',
}));
