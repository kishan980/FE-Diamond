import Badge from '@mui/material/Badge';
import Avatar from 'components/@extended/Avatar';
import { SelectedBiddersData } from 'services/event/event-action/auction-room/type';

const avatarImage = '/assets/images/users';

interface UserAvatarProps {
  user: SelectedBiddersData;
}

export default function AllLotsListAvatar({ user }: UserAvatarProps) {
  const avatarSrc = user?.stockNo ? `${avatarImage}/${user.stockNo}` : '';

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={(theme) => ({
        '& .MuiBox-root': { width: 6, height: 6 },
        '& .MuiBadge-badge': { top: '3%', right: '25%' },
        padding: 0,
        minWidth: 12,
        '& svg': { bgcolor: 'background.paper', borderRadius: '50%', ...theme.applyStyles('dark', { bgcolor: 'text.primary' }) },
      })}
    >
      <Avatar alt={`User ${user?.SeqNo ?? ''}`} src={avatarSrc} />
    </Badge>
  );
}
