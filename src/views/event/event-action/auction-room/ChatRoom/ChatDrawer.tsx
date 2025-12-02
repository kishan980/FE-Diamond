'use client';
import { useState, ChangeEvent, useCallback, memo, useMemo } from 'react';
import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { SearchNormal1 } from '@wandersonalwes/iconsax-react';
import { UserSquare } from 'iconsax-react';
import Tab from '@mui/material/Tab';
import { useParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import UserList from './UserList';
import AllLotsList from './AllLots/AllLotsList';
import {
  BottomListContainer,
  ChatDrawerStyled,
  ChatTabsStyled,
  MessagesChip,
  MessagesContainerStyled,
  SimpleBarContainer,
  SimpleBarSubContainer,
} from './ChatRoom.styled';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'types/config';
import { ChatDrawerProps } from 'types/chat';
import { useDebounce } from 'hooks/useDebounce';

const SearchInput = memo(function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <OutlinedInput
      fullWidth
      placeholder="Search"
      value={value}
      onChange={onChange}
      sx={{ height: 36, '& .MuiOutlinedInput-input': { py: 1 } }}
      startAdornment={
        <InputAdornment position="start">
          <SearchNormal1 style={{ fontSize: 'small' }} />
        </InputAdornment>
      }
    />
  );
});

const ChatDrawer = ({
  handleDrawerOpen,
  openChatDrawer,
  setSelectedBiddersData,
  setLostedBiddersData,
  selectedUser,
  allLotsSelectedUser,
  biddersLotsChatData,
  activeTab,
  setActiveTab,
  loading,
}: ChatDrawerProps) => {
  const { id } = useParams();
  const eventId = Number(id);

  const theme = useTheme();
  const isLargeDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const [searchChat, setSearchChat] = useState('');
  const [searchLots, setSearchLots] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  const debouncedChatSearch = useDebounce(searchChat, 300);
  const debouncedLotsSearch = useDebounce(searchLots, 300);

  const totalUnreadCount = useMemo(() => Object.values(unreadCounts).reduce((sum, count) => sum + count, 0), [unreadCounts]);

  const showChatTab = activeTab === 'chat';
  const showAllLotsTab = activeTab === 'alllots';

  const handleSearchChange = (setter: (v: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  const updateUnreadCount = useCallback((userId: number, count: number) => {
    setUnreadCounts((prev) => ({ ...prev, [userId]: count }));
  }, []);

  return (
    <ChatDrawerStyled
      sx={{ display: { xs: openChatDrawer ? 'block' : 'none', lg: 'block' }, zIndex: { xs: openChatDrawer ? 1300 : -1, lg: 0 } }}
      variant={isLargeDown ? 'temporary' : 'persistent'}
      anchor="left"
      open={openChatDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      <MainCard
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px 0 0 12px',
          borderRight: 'none',
          height: '100%',
          '& div:nth-of-type(2)': { height: 'auto' },
        }}
        border={!isLargeDown}
        content={false}
      >
        <MessagesContainerStyled>
          <Stack gap={1}>
            <ChatTabsStyled value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
              <Tab label="Chat" value="chat" />
              <Tab label="All Lots" value="alllots" />
            </ChatTabsStyled>
            {showChatTab && (
              <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                <Typography variant="h5" color="inherit">
                  Messages
                </Typography>
                <MessagesChip label={totalUnreadCount} color={theme.palette.mode === ThemeMode.DARK ? 'default' : 'secondary'} />
              </Stack>
            )}

            {showChatTab && <SearchInput value={searchChat} onChange={handleSearchChange(setSearchChat)} />}
            {showAllLotsTab && <SearchInput value={searchLots} onChange={handleSearchChange(setSearchLots)} />}
          </Stack>
        </MessagesContainerStyled>

        <SimpleBarContainer>
          <SimpleBarSubContainer>
            {showChatTab && (
              <UserList
                eventId={eventId}
                search={debouncedChatSearch}
                selectedUser={selectedUser}
                setLostedBiddersData={setLostedBiddersData}
                selectedLostBidders={biddersLotsChatData[0]?.lostBidders || []}
                loading={loading}
                updateUnreadCount={updateUnreadCount}
              />
            )}
            {showAllLotsTab && (
              <AllLotsList
                search={debouncedLotsSearch}
                allLotsSelectedUser={allLotsSelectedUser}
                setSelectedBiddersData={setSelectedBiddersData}
                allSelectedBidders={biddersLotsChatData[0]?.selectBidders || []}
                loading={loading}
              />
            )}
          </SimpleBarSubContainer>
        </SimpleBarContainer>

        <BottomListContainer>
          <List dense sx={{ '& .MuiListItemIcon-root': { minWidth: 28 } }}>
            <ListItemButton onClick={() => setActiveTab('allbidders')} sx={{ py: 0.5, minHeight: 36 }}>
              <ListItemIcon>
                <UserSquare variant="Bulk" />
              </ListItemIcon>
              <ListItemText primary="All Bidders" primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          </List>
        </BottomListContainer>
      </MainCard>
    </ChatDrawerStyled>
  );
};

export default ChatDrawer;
