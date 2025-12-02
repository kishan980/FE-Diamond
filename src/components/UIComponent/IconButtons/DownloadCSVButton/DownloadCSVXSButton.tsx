import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { DocumentDownload } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const DownloadCSVXSButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <DocumentDownload size={20} style={{ color: 'gray', cursor: 'pointer' }} />
    </IconButton>
  </Tooltip>
);

export default DownloadCSVXSButton;
