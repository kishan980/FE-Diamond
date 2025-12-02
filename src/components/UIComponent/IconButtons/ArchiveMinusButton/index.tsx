import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ArchiveMinus } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const ArchiveMinusIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <ArchiveMinus size={28} style={{ marginTop: 4, color: 'gray' }} />
    </IconButton>
  </Tooltip>
);

export default ArchiveMinusIconButton;
