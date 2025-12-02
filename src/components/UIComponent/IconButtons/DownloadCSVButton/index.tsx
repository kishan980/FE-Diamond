import Tooltip from '@mui/material/Tooltip';
import { DocumentDownload } from 'iconsax-react';
import { DownloadButtonMainBox } from './DownloadCSVXSButton.styled';
import { IconButtonProps } from 'types/button';
import { StyledIconButton } from 'views/common.styled';
import IconButtonProgress from 'components/IconButtonProgress';

const DownloadCSVButton = ({ title, onClick, isLoading }: IconButtonProps) => (
  <Tooltip title={title}>
    <StyledIconButton onClick={onClick} disabled={isLoading}>
      <DownloadButtonMainBox>
        <DocumentDownload style={{ color: '#3c64d0', opacity: isLoading ? 0.5 : 1 }} />
        {isLoading && <IconButtonProgress />}
      </DownloadButtonMainBox>
    </StyledIconButton>
  </Tooltip>
);

export default DownloadCSVButton;
