import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countries from 'data/countries';
import { CountrySelectProps } from 'types/country';

const CountrySelect = ({ values, handleChange, title, readOnly }: CountrySelectProps) => (
  <Autocomplete
    size="small"
    fullWidth
    id="country-select-demo"
    options={countries}
    autoHighlight
    readOnly={readOnly}
    value={values}
    getOptionLabel={(option) => option.label}
    onChange={(event, value) => handleChange(value)}
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
          {option.label} ({option.code}) {option.phone}
        </Box>
      );
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label={title}
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password',
        }}
      />
    )}
  />
);

export default CountrySelect;
