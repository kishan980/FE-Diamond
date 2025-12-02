import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { DocumentText } from 'iconsax-react';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButtonProps } from 'types/button';

const DocumentIconButton = ({ title, onClick, isLoading }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} sx={{ padding: '4px' }}>
      <DocumentText size={20} style={{ marginTop: 4, color: '#28b463' }} />
      {isLoading && <CircularProgress size={24} style={{ position: 'absolute' }} />}
    </IconButton>
  </Tooltip>
);

export default DocumentIconButton;
