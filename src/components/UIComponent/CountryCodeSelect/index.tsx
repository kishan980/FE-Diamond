import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countries from 'data/countries';
import { CountrySelectProps } from 'types/country';

const CountryCodeSelect = ({ id, values, handleChange, error = false }: CountrySelectProps) => (
  <Autocomplete
    size="small"
    fullWidth
    id={id}
    options={countries}
    autoHighlight
    value={values}
    getOptionLabel={(option) => option.phone}
    onChange={(event, value) => handleChange(value)}
    PaperComponent={({ children }) => <Box sx={{ minWidth: 200, backgroundColor: 'white' }}>{children}</Box>}
    sx={{
      '& .MuiAutocomplete-clearIndicator svg': { display: 'none' },
      '& .MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator svg': { display: 'none' },
      '& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': { width: '100%', minWidth: '38px' },
      '& .MuiAutocomplete-popupIndicator svg': { display: 'none' },
    }}
    renderOption={(props, option) => {
      const { key, ...rest } = props;
      return (
        <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...rest}>
          <Box
            component="img"
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code?.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code?.toLowerCase()}.png`}
            alt=""
          />
          {option.phone}
        </Box>
      );
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        error={error}
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password',
        }}
      />
    )}
  />
);

export default CountryCodeSelect;
