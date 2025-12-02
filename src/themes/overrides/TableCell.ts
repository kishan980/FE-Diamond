// MATERIAL - UI
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme: Theme) {
  const commonCell = {
    '&:not(:last-of-type)': {
      position: 'relative',
      '&:after': {
        position: 'absolute',
        content: '""',
        backgroundColor: theme.palette.divider,
        width: 1,
        height: 'calc(100% - 30px)',
        right: 0,
        top: 16,
      },
    },
  };

  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.813rem',
          padding: 12,
          borderColor: theme.palette.divider,
          '&.cell-right': {
            justifyContent: 'flex-end',
            textAlign: 'right',
            '& > *': { justifyContent: 'flex-end', margin: '0 0 0 auto' },
            '& .MuiOutlinedInput-input': { textAlign: 'right' },
          },
          '&.cell-center': {
            justifyContent: 'center',
            textAlign: 'center',
            '& > *': { justifyContent: 'center', margin: '0 auto' },
          },
          '& .MuiTypography-root': { fontSize: 'inherit' },
        },
        sizeSmall: { padding: 8 },
        head: { fontSize: '0.75rem', fontWeight: 700, lineHeight: '1rem', textTransform: 'uppercase', ...commonCell },
        footer: { fontSize: '0.75rem', textTransform: 'uppercase', ...commonCell },
      },
    },
  };
}
