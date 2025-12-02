import Tooltip from '@mui/material/Tooltip';
import { DocumentText } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const DocumentTextIcon = ({ title }: IconButtonProps) => (
  <Tooltip title={title}>
    <DocumentText size={28} style={{ color: 'gray', marginTop: 4 }} />
  </Tooltip>
);

export default DocumentTextIcon;
