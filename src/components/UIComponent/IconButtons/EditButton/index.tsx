import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Edit } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const EditIconButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton color="primary" onClick={onClick} sx={{ padding: '4px' }}>
      <Edit size={20} style={{ marginTop: 4 }} />
    </IconButton>
  </Tooltip>
);

export default EditIconButton;
