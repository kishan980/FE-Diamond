import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';

export const EventResultSearchButtonContainer = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  whiteSpace: 'nowrap',
  display: 'flex',
  [theme.breakpoints.up('sm')]: { justifyContent: 'space-between', flexDirection: 'row' },
  [theme.breakpoints.down('sm')]: { flexDirection: 'column', gap: theme.spacing(1) },
}));

export const EventResultSearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  width: '100%',
}));

export const ChildTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

export const EventAnalysingChildUpperTableMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const EventAnalysingChildTableMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const EventAnalysingChildUpperTableContainer = styled(TableContainer)(({ theme }) => ({
  border: '2px solid',
  borderRadius: theme.spacing(2),
  borderColor: '#C8C8C8',
  maxWidth: 650,
}));

export const EventAnalysingChildMiddleTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.spacing(6),
}));

export const EventAnalysingResultsDetailsTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.spacing(6),
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

export const EventAnalysingChildbuttonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  width: '100%',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
}));

export const EventAnalysingResultsTableMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const LotOverviewMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const YesAndNoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
}));
