import Tooltip from '@mui/material/Tooltip';
import { CloseCircle } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const CloseIcon = ({ title }: IconButtonProps) => {
  if (title)
    return (
      <Tooltip title={title}>
        <CloseCircle size={25} color="#FF0000" style={{ marginTop: 4 }} />
      </Tooltip>
    );

  return <CloseCircle size={25} color="#FF0000" style={{ marginTop: 4 }} />;
};

export default CloseIcon;
