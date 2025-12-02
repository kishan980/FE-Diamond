import Chip from '@mui/material/Chip';
import { StatusButtonProps } from 'types/button';

const StatusChip = ({ color, label }: StatusButtonProps) => (
  <Chip color={color} label={label} variant="light" size="small" sx={{ width: '100%', maxWidth: 'fit-content', p: 1 }} />
);

export default StatusChip;
