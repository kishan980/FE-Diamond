'use client';
import Tooltip from '@mui/material/Tooltip';
import { Printer } from 'iconsax-react';
import IconButtonProgress from 'components/IconButtonProgress';
import { StyledIconButton } from 'views/common.styled';

const PrintIconButton = ({ title, isLoading, onClick }: { title: string; isLoading?: boolean; onClick?: () => void }) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <Printer style={{ color: '#1b2631' }} />
      {isLoading && <IconButtonProgress />}
    </StyledIconButton>
  </Tooltip>
);

export default PrintIconButton;
