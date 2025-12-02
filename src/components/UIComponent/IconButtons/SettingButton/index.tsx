import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Setting2 } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const SettingIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <Setting2 size={20} style={{ marginTop: 4 }} />
    </IconButton>
  </Tooltip>
);

export default SettingIconButton;
