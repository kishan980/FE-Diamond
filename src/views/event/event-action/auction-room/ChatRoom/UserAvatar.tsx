import { StyledBadge } from './ChatRoom.styled';
import { LostBiddersData } from 'services/event/event-action/auction-room/type';
import { UserAvatarProps } from 'types/chat';
import { StyledAvatar } from 'views/bidder/AuctionRoom/ChatDrawer/ChatWidget.styled';

export default function UserAvatar({ user, isCurrentUser }: UserAvatarProps<LostBiddersData>) {
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <StyledAvatar isAdmin={isCurrentUser}>{user?.user_name?.charAt(0).toUpperCase()}</StyledAvatar>
    </StyledBadge>
  );
}
