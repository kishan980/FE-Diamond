'use client';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StyledMobileDatePicker } from './DateRangePicker.styled';
import { DateRangePickerProps } from 'types/dateRangePicker';

const DateRangePicker = ({ fromDate, toDate, onChange }: DateRangePickerProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box display="flex" gap={2}>
      <StyledMobileDatePicker
        label="From"
        value={fromDate}
        format="MM/dd/yyyy"
        onChange={(newValue) => onChange('fromDatePicker', newValue as Date | null)}
        slotProps={{ textField: { size: 'small' } }}
      />
      <StyledMobileDatePicker
        label="To"
        value={toDate}
        format="MM/dd/yyyy"
        onChange={(newValue) => onChange('toDatePicker', newValue as Date | null)}
        minDate={fromDate || new Date()}
        slotProps={{ textField: { size: 'small', fullWidth: true } }}
      />
    </Box>
  </LocalizationProvider>
);

export default DateRangePicker;
