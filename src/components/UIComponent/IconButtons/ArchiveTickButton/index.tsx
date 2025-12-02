import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ArchiveTick } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const ArchiveTickIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <ArchiveTick size={28} style={{ marginTop: 4, color: 'gray' }} />
    </IconButton>
  </Tooltip>
);

export default ArchiveTickIconButton;
