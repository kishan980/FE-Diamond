'use client';
import Tooltip from '@mui/material/Tooltip';
import { RefreshSquare } from 'iconsax-react';
import { StyledIconButton } from 'views/common.styled';

const RefreshIconButton = ({ title, onClick }: { title: string; onClick?: () => void }) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <RefreshSquare style={{ color: 'gray' }} />
    </StyledIconButton>
  </Tooltip>
);

export default RefreshIconButton;
