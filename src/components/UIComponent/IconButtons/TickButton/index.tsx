import Tooltip from '@mui/material/Tooltip';
import { TickCircle } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const TickIcon = ({ title }: IconButtonProps) => {
  if (title)
    return (
      <Tooltip title={title}>
        <TickCircle size={25} color="#07bc0c" style={{ marginTop: 4 }} />
      </Tooltip>
    );

  return <TickCircle size={25} color="#07bc0c" style={{ marginTop: 4 }} />;
};

export default TickIcon;
