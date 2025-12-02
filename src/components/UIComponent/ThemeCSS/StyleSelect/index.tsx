import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

export const StyledSelect = styled(Select)(() => ({
  '& .MuiSelect-select': { padding: '6.5px 14px' },
}));
