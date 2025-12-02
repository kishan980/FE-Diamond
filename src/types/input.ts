import { SxProps, Theme } from '@mui/material/styles';
import { ChangeEvent, FocusEvent, KeyboardEvent, MouseEventHandler, ReactNode } from 'react';
import { InputProps as MuiInputProps } from '@mui/material/Input';

export interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label?: string | ReactNode;
  required?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  rows?: number;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: MouseEventHandler<HTMLInputElement>;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  InputProps?: MuiInputProps;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputMode?: 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal';
}
