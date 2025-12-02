import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Import } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const ChooseFileIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ fontSize: 25, padding: '3px' }}>
      <Import style={{ height: '100%', width: '100%', color: 'gray', marginTop: 4 }} />
    </IconButton>
  </Tooltip>
);

export default ChooseFileIconButton;
