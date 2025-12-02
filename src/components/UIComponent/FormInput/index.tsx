import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormInputProps } from 'types/input';

const FormInput = ({
  id,
  name,
  type = 'text',
  required = false,
  label,
  size = 'small',
  fullWidth = true,
  readOnly = false,
  multiline = false,
  rows,
  value,
  onChange,
  onBlur,
  onClick,
  onKeyDown,
  error,
  helperText,
  inputMode,
  disabled = false,
  InputProps = {},
  sx,
  ...props
}: FormInputProps) => (
  <TextField
    id={id}
    name={name}
    type={type}
    size={size}
    fullWidth={fullWidth}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    onClick={onClick}
    onKeyDown={onKeyDown}
    InputProps={{
      ...InputProps,
      readOnly,
    }}
    multiline={multiline}
    rows={rows}
    error={error}
    helperText={helperText}
    label={
      typeof label === 'string' ? (
        <Box>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Box>
      ) : (
        label
      )
    }
    inputMode={inputMode}
    disabled={disabled}
    sx={{ ...sx, textTransform: 'none', '& .MuiFormLabel-root': { lineHeight: '1.4375em !important' } }}
    {...props}
  />
);

export default FormInput;
