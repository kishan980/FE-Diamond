import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { FolderOpen } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const FolderIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} color="primary" sx={{ padding: '4px' }}>
      <FolderOpen size={20} style={{ color: 'gray', marginTop: 4 }} />
    </IconButton>
  </Tooltip>
);

export default FolderIconButton;
