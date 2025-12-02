import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { UserSquare } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const ContactIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <UserSquare size={20} style={{ marginTop: 4, color: 'gray' }} />
    </IconButton>
  </Tooltip>
);

export default ContactIconButton;
