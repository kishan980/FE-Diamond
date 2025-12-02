import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { PasswordCheck } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const PasswordIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <PasswordCheck size={28} style={{ marginTop: 4, color: '#7d6608' }} />
    </IconButton>
  </Tooltip>
);

export default PasswordIconButton;
