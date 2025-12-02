import { Sms } from 'iconsax-react';
import Tooltip from '@mui/material/Tooltip';
import { StyledIconButton } from 'views/common.styled';
import IconButtonProgress from 'components/IconButtonProgress';
import { IconButtonProps } from 'types/button';

const SmsIcon = ({ title, onClick, isLoading }: IconButtonProps) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <Sms style={{ color: '#00A854' }} />
      {isLoading && <IconButtonProgress />}
    </StyledIconButton>
  </Tooltip>
);

export default SmsIcon;
