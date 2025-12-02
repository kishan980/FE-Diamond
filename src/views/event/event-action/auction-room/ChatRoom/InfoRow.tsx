import React from 'react';
import { InfoRowContainer } from './ChatRoom.styled';
import { StyledEllipsisText } from 'views/common.styled';
import { InfoRowProps } from 'types/chat';

const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueVariant = 'h5', labelVariant = 'h6' }) => (
  <InfoRowContainer>
    <StyledEllipsisText variant={labelVariant} color="text.primary">
      {label}
    </StyledEllipsisText>
    <StyledEllipsisText variant={valueVariant} color="primary">
      {value}
    </StyledEllipsisText>
  </InfoRowContainer>
);

export default InfoRow;
