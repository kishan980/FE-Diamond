'use client';
import Tooltip from '@mui/material/Tooltip';
import { ImportSquare } from 'iconsax-react';
import { IconButtonProps } from 'types/button';
import { StyledIconButton } from 'views/common.styled';

const ImportButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <ImportSquare style={{ color: '#008D3A' }} />
    </StyledIconButton>
  </Tooltip>
);

export default ImportButton;
