'use client';
import { Fragment, useMemo } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { StockNoTypography, StyledListItemButton, UserInfoStack } from '../ChatRoom.styled';
import AllLotsListAvatar from './AllLotsListAvatar';
import { SelectBiddersData } from 'services/event/event-action/auction-room/type';
import { AllLotsListItemProps, AllLotsListProps } from 'types/events';
import { filterUsers } from 'utils/filterUsers';

function UserListItem({ user, allLotsSelectedUser, setSelectedBiddersData }: AllLotsListItemProps<SelectBiddersData>) {
  return (
    <StyledListItemButton
      onClick={() => {
        setSelectedBiddersData(user);
      }}
      selected={user.SeqNo?.toString() === allLotsSelectedUser}
    >
      <ListItemAvatar>
        <AllLotsListAvatar user={user} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <UserInfoStack direction="row">
            <StockNoTypography variant="subtitle1" color="text.primary">
              {user.stockNo}
            </StockNoTypography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.SeqNo}
            </Typography>
          </UserInfoStack>
        }
      />
    </StyledListItemButton>
  );
}

export default function AllLotsList({
  search,
  allLotsSelectedUser,
  setSelectedBiddersData,
  allSelectedBidders,
  loading,
}: AllLotsListProps<SelectBiddersData>) {
  const filteredData = useMemo(() => filterUsers(allSelectedBidders, search, ['stockNo']), [allSelectedBidders, search]);

  if (loading)
    return (
      <List>
        {[1, 2, 3, 4, 5].map((index: number) => (
          <ListItem key={index} divider>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton animation="wave" height={24} />}
              secondary={<Skeleton animation="wave" height={16} width="60%" />}
            />
          </ListItem>
        ))}
      </List>
    );

  return (
    <List component="nav">
      {filteredData.map((user) => (
        <Fragment key={user.SeqNo}>
          <UserListItem user={user} allLotsSelectedUser={allLotsSelectedUser} setSelectedBiddersData={setSelectedBiddersData} />
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}
