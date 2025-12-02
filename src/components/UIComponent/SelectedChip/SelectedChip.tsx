import Chip from '@mui/material/Chip';
import { SelectedChipProps } from 'types/table';

const SelectedChip = ({ count, color = 'secondary', variant = 'light', sx = {} }: SelectedChipProps) =>
  count > 0 ? (
    <Chip
      size="small"
      label={`${count} row(s) selected`}
      color={color}
      variant={variant}
      sx={{ borderRadius: '0 4px 0 4px', justifyContent: 'left', ...sx }}
    />
  ) : null;

export default SelectedChip;
