import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const TenderHistoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingBottom: theme.spacing(2),
  paddingInline: theme.spacing(2),
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: { paddingInline: theme.spacing(1), paddingBottom: theme.spacing(1) },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '12px 15px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '10px 15px',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

export const TenderHistoryTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  boxShadow: theme.shadows[3],
}));
