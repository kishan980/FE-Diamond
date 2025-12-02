import CardMedia, { CardMediaProps } from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const StyledCardMedia = styled(CardMedia)<CardMediaProps>(({ theme }) => ({
  top: 8,
  left: 8,
  borderRadius: theme.spacing(2),
  width: 400,
  backgroundColor: theme.palette.background.paper,
  objectFit: 'contain',
}));

export const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  height: '200px',
  display: 'flex',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

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

export const StackMainDivContainer = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
  '@media (max-width: 330px)': {
    '&.MuiStack-root': {
      marginTop: 0,
    },
  },
}));

export const TextTypography = styled(Typography)(({ theme }) => ({
  '@media (max-width: 330px)': {
    '&.MuiTypography-root': {
      marginTop: 0,
    },
  },
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(1),
  },
}));
