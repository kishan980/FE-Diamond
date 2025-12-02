import Image from 'next/image';
import Tooltip from '@mui/material/Tooltip';
import { IconButtonProps } from 'types/button';
import { StyledIconButton } from 'views/common.styled';

const PdfButton = ({ title, onClick }: IconButtonProps) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <Image loading="lazy" src="/assets/icons/pdf.png" width={20} height={20} style={{ color: 'gray', cursor: 'pointer' }} alt="pdf" />
    </StyledIconButton>
  </Tooltip>
);

export default PdfButton;
