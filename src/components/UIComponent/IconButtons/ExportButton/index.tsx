'use client';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ExportSquare } from 'iconsax-react';
import { IconButtonProps } from 'types/button';

const ExportButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick}>
      <ExportSquare size={28} style={{ color: 'gray', marginTop: 4 }} />
    </IconButton>
  </Tooltip>
);

export default ExportButton;
