import { memo } from 'react';
import { DaySeparatorLabel, DaySeparatorWrapper } from './ChatWidget.styled';
import { ChatDaySeparatorProps } from 'types/chat';

const ChatDaySeparator = ({ label }: ChatDaySeparatorProps) => {
  if (!label) return null;

  return (
    <DaySeparatorWrapper>
      <DaySeparatorLabel variant="caption">{label}</DaySeparatorLabel>
    </DaySeparatorWrapper>
  );
};

export default memo(ChatDaySeparator);
