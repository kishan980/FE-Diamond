import { ReactNode } from 'react';

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export interface CountrySelectProps {
  id?: string;
  values: CountryType | null;
  handleChange: (value: CountryType | null) => void;
  title?: ReactNode;
  error?: boolean;
  readOnly?: boolean;
}
