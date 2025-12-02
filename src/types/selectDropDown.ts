import { SelectChangeEvent } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { LoadingState } from './table';

export interface SelectDropDownProps {
  size?: 'small' | 'medium';
  id?: string;
  name?: string;
  value: unknown;
  options: { value: string | number; label: string }[];
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
}

export interface SelectFormControlProps {
  size?: 'small' | 'medium';
  label: string;
  id: string;
  value: number | string | boolean;
  onChange: (event: SelectChangeEvent<number | string | boolean>) => void;
  options: { value: string | number; label: string }[];
  disabled?: boolean;
  error?: boolean;
  sx?: SxProps<Theme>;
  loading?: boolean;
}

export interface ManageAttendFiltersProps<T> {
  data: T[];
  attended: string;
  selected: number[];
  loginEnabled: string;
  remainingTime: string;
  handleChangeAttended: (event: SelectChangeEvent<number | string | boolean>) => void;
  handleChangeLoginEnabled: (event: SelectChangeEvent<number | string | boolean>) => void;
}

export interface SelectParticipantsFiltersProps<T> {
  data: T[];
  loading: LoadingState;
  selected: number[];
  participants: string;
  handleContactParticipants: () => void;
  handleParticipantStatusChange: (event: SelectChangeEvent<number | string | boolean>) => void;
}

export interface SelectViewersFiltersProps {
  invited: string;
  loginEnabled: string;
  isDropdownEnabled: boolean;
  handleChangeInvited: (event: SelectChangeEvent<number | string | boolean>) => void;
  handleChangeLoginEnabled: (event: SelectChangeEvent<number | string | boolean>) => void;
}

export interface GenericFilterProps<T> {
  filterdata: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  selectedEventId?: number;
  handleSelectEvent?: (value: number) => void;
}
