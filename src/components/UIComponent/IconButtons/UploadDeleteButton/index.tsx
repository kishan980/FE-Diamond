'use client';
import Tooltip from '@mui/material/Tooltip';
import { TrushSquare } from 'iconsax-react';
import { StyledIconButton } from 'views/common.styled';
import { IconButtonProps } from 'types/button';

const UploadDeleteButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <TrushSquare style={{ color: 'red' }} />
    </StyledIconButton>
  </Tooltip>
);

export default UploadDeleteButton;
