import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { StyledSelect } from '../ThemeCSS/StyleSelect';
import { SelectDropDownProps } from 'types/selectDropDown';

const SelectDropDown = ({ size = 'medium', id, name, value, options, onChange, sx }: SelectDropDownProps) => (
  <StyledSelect
    size={size}
    id={id}
    name={name}
    value={value}
    onChange={(e: SelectChangeEvent<unknown>) => onChange(e.target.value as string)}
    sx={{ ...sx, textTransform: 'none' }}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </StyledSelect>
);

export default SelectDropDown;
