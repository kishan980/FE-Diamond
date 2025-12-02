import CircularProgress from '@mui/material/CircularProgress';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const LoadingTableRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} sx={{ textAlign: 'center', py: 3 }}>
      <CircularProgress size={24} />
    </TableCell>
  </TableRow>
);

export default LoadingTableRow;
