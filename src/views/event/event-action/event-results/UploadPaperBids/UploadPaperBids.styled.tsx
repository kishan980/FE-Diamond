import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const EventUploadPaperSearchButtonContainer = styled(Stack)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  whiteSpace: 'nowrap',
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const EventUploadPaperSearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));

export const EventResultSubmitBtn = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  height: '100%',
}));

export const TitleMainBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  cursor: 'pointer',
  maxWidth: 'fit-content',
}));
