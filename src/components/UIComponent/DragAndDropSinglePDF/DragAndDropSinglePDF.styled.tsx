import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    flexDirection: 'row',
  },
}));

export const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));
