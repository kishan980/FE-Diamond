'use client';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { HambergerMenu } from '@wandersonalwes/iconsax-react';
import { memo, useMemo } from 'react';
import UserAvatar from './UserAvatar';
import IconButton from 'components/@extended/IconButton';
import { LostedBiddersData } from 'services/event/event-action/auction-room/type';
import { ChatHeaderProps } from 'types/chat';

// ==============================|| CHAT HEADER ||============================== //

const ChatHeader = ({ loading, lostedBiddersData, handleDrawerOpen }: ChatHeaderProps<LostedBiddersData>) => {
  const userData = useMemo(
    () => ({
      user_name: lostedBiddersData?.user_name || '',
      refBuyerID_EntityMas: lostedBiddersData?.refBuyerID_EntityMas || 0,
    }),
    [lostedBiddersData]
  );
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton onClick={handleDrawerOpen} color="secondary" size="large">
        <HambergerMenu />
      </IconButton>
      {loading?.isUserLoading && Object.keys(lostedBiddersData).length === 0 ? (
        <List disablePadding>
          <ListItem disablePadding disableGutters>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              sx={{ my: 0 }}
              primary={<Skeleton animation="wave" height={24} width={50} />}
              secondary={<Skeleton animation="wave" height={16} width={80} />}
            />
          </ListItem>
        </List>
      ) : (
        <>
          <UserAvatar user={userData} />
          <Typography variant="subtitle1" noWrap>
            {lostedBiddersData?.user_name || 'Unknown User'}
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default memo(ChatHeader);
