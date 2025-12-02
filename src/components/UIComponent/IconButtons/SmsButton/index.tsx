'use client';
import Button from '@mui/material/Button';
import { Sms } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const SmsIconButton = ({ title, onClick, disabled = false }: { title: string; onClick?: () => void; disabled?: boolean }) => {
  const theme = useTheme();
  const upSM = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Button
      type="submit"
      size={upSM ? 'medium' : 'small'}
      startIcon={<Sms style={{ color: disabled ? 'gray' : undefined }} />}
      color="primary"
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={{ whiteSpace: 'nowrap', height: 'fit-content', px: { xs: 0.75, sm: 1.5 } }}
    >
      {title}
    </Button>
  );
};

export default SmsIconButton;
