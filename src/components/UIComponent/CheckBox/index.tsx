import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChangeEvent } from 'react';
import { CheckBoxProps } from 'types/checkBox';

const UICheckBox = ({ checked, label, onChange }: CheckBoxProps) => (
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)} />}
    label={label}
  />
);

export default UICheckBox;
