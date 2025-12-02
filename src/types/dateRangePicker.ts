export type DateRangePickerProps = {
  fromDate: Date | null;
  toDate: Date | null;
  onChange: (field: 'fromDatePicker' | 'toDatePicker', value: Date | null) => void;
};
