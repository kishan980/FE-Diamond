import Image from 'next/image';
import Tooltip from '@mui/material/Tooltip';
import { DownloadButtonMainBox } from '../DownloadCSVButton/DownloadCSVXSButton.styled';
import { IconButtonProps } from 'types/button';
import { StyledIconButton } from 'views/common.styled';
import IconButtonProgress from 'components/IconButtonProgress';

const DownloadXMLButton = ({ title, onClick, isLoading }: IconButtonProps) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick}>
      <DownloadButtonMainBox>
        <Image loading="lazy" src="/assets/icons/xml.png" width={24} height={24} style={{ color: 'gray', cursor: 'pointer' }} alt="xml" />
        {isLoading && <IconButtonProgress />}
      </DownloadButtonMainBox>
    </StyledIconButton>
  </Tooltip>
);

export default DownloadXMLButton;
