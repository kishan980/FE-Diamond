import { Socket } from 'socket.io-client';
import { ChangeEvent, Dispatch, FocusEvent, SetStateAction } from 'react';
import { LoadingState } from './table';
import { BiddersLotsChatAuctionData, LostedBiddersData, SelectedBiddersData } from 'services/event/event-action/auction-room/type';
import { ChatMessageAPI } from 'services/bidder/auction-room/type';

export interface UserListProps<T> {
  eventId: number;
  search: string;
  selectedUser: string | null;
  setLostedBiddersData: (u: T) => void;
  selectedLostBidders: T[];
  loading: boolean;
  updateUnreadCount: (userId: number, count: number) => void;
}

export interface UserListItemProps<T> {
  eventId: number;
  user: T;
  setLostedBiddersData: (u: T) => void;
  selectedUser: string | null;
  onlineUserIds: number[];
  socket?: Socket | null;
  chatHistory: ChatMessageAPI[];
  setChatHistories: Dispatch<SetStateAction<Record<number, ChatMessageAPI[]>>>;
  updateUnreadCount: (userId: number, count: number) => void;
}

export interface ChatBidderProps<T> {
  loading: LoadingState;
  handleDrawerOpen: () => void;
  lostedBiddersData: T;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
}

export interface ChatHeaderProps<T> {
  loading: LoadingState;
  lostedBiddersData: T;
  handleDrawerOpen: () => void;
}

export interface ChatMessage {
  messageBody: string;
  senderName: string;
  messageTime?: string;
}

export interface ChatHistoryProps<T> {
  chat: T[];
  currentUserName: string;
}

export interface ChatDrawerProps {
  handleDrawerOpen: () => void;
  openChatDrawer: boolean | undefined;
  setSelectedBiddersData: (u: SelectedBiddersData) => void;
  setLostedBiddersData: (u: LostedBiddersData) => void;
  selectedUser: string | null;
  allLotsSelectedUser: string | null;
  biddersLotsChatData: BiddersLotsChatAuctionData[];
  activeTab: 'chat' | 'alllots' | 'allbidders';
  setActiveTab: (tab: 'chat' | 'alllots' | 'allbidders') => void;
  loading: boolean;
}

export interface ChatWidgetDataProps {
  Username: string;
  EntityID: number;
  co_name: string;
}

export interface UnreadCountItem {
  senderID: number;
  UnreadCount: string;
}

export type UnreadMessageCount = {
  UnreadCount: number;
};

export interface InfoRowProps {
  label: string;
  value: string | number | undefined | null;
  valueVariant?: 'h5' | 'h6' | 'body1' | 'body2';
  labelVariant?: 'h5' | 'h6' | 'body1' | 'body2';
}

export interface ChatMessageItemProps<T> {
  msg: T;
  isAdmin: boolean;
  avatarLetter: string;
}

export interface ChatDaySeparatorProps {
  label: string;
}

export interface UserAvatarProps<T> {
  user: T;
  isCurrentUser?: boolean;
}

export interface AuctionTimeCardProps {
  timeLeft: string;
  values: {
    extraTime: string | number;
  };
  touched: {
    extraTime?: boolean;
  };
  errors: {
    extraTime?: string;
  };
  handleChange: (e: ChangeEvent<any>) => void;
  handleBlur: (e: FocusEvent<any>) => void;
  handleAddExtraTimeClick: () => void;
  isSubmitting: boolean;
  buttonLabel?: string;
}
