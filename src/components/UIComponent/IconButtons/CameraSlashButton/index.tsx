import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import IconButton from 'components/@extended/IconButton';
import { IconButtonProps } from 'types/button';

const CameraSlashIconButton = ({ title }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton size="small" shape="rounded" aria-label="upload picture" sx={{ '& svg': { width: 18, height: 18 } }}>
      <Box component="img" src="/assets/icons/gallery.png" alt="gallery" height={20} width={20} />
    </IconButton>
  </Tooltip>
);

export default CameraSlashIconButton;
