import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SelectFormControlProps } from 'types/selectDropDown';

const SelectFormControl = ({
  size = 'small',
  label,
  id,
  value,
  onChange,
  options,
  disabled = false,
  error,
  sx,
  loading = false,
}: SelectFormControlProps) => (
  <FormControl size={size} disabled={disabled || loading} sx={sx}>
    <InputLabel id={`${id}-label`} sx={{ top: 3 }}>
      {label}
    </InputLabel>
    <Select
      labelId={`${id}-label`}
      id={id}
      value={value}
      onChange={onChange}
      label={label}
      error={error}
      endAdornment={loading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : undefined}
    >
      {options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectFormControl;
