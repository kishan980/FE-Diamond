import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';

export interface RenderTableCellProps {
  content: any;
  format?: (value: any) => string;
  defaultValue?: ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sx?: SxProps<Theme>;
}

export interface TableCellComponentProps {
  content: ReactNode;
  defaultValue?: string;
  align?: 'left' | 'center' | 'right';
  component?: 'th' | 'td';
  padding?: 'none' | 'normal' | 'checkbox';
  width?: string;
  redirectUrl?: string;
  maxWidth?: string;
  sx?: SxProps<Theme>;
}

export interface TableCellClickComponentProps extends TableCellComponentProps {
  onClick: () => void;
}

export interface TableCellLinkComponentProps extends TableCellComponentProps {
  redirectUrl?: string;
}
