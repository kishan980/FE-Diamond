import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const NoDataTableRow = ({ colSpan, padding }: { colSpan: number; padding?: boolean }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center', pt: padding ? 1 : 3 }}>
        No Data Found!
      </TableCell>
    </TableRow>
  );
};

export default NoDataTableRow;
