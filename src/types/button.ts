export interface IconButtonProps {
  title?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export interface StatusButtonProps {
  color: 'default' | 'success' | 'error' | 'info' | 'primary' | 'secondary' | 'warning';
  label: string;
}
