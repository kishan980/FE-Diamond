import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { RadioButtonsGroupProps } from 'types/selectRadio';

const UIRadioButtonsGroup = ({ options, defaultValue, onChange, disabled }: RadioButtonsGroupProps) => (
  <FormControl>
    <RadioGroup value={defaultValue} onChange={(event) => onChange(event.target.value)} sx={{ display: 'flex', flexDirection: 'row' }}>
      {options.map((option, index) => (
        <FormControlLabel
          key={index}
          value={option.id}
          sx={{ gap: 1 }}
          control={<Radio color="secondary" sx={{ padding: 0, paddingLeft: 1.5 }} disabled={disabled} />}
          label={
            <Box
              sx={{
                fontWeight: option.id === defaultValue ? 'bold !important' : 'normal !important',
              }}
            >
              {option.name}
            </Box>
          }
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default UIRadioButtonsGroup;
