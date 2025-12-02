import { SelectChangeEvent } from '@mui/material/Select';
import { Dispatch, SetStateAction } from 'react';
import { LoadingState } from './table';
import { EventOrganizedForData, MinesData } from 'services/event/types';
import { AuctionRoomSummary, ChatRoomAllBiddersOrLotsData, SelectedBiddersData } from 'services/event/event-action/auction-room/type';

export type MenuDetails = {
  EventID: number;
  startDate: string;
  endDate: string;
  eventCategoryID: number;
  isAnalysis: boolean;
  TenderEndDate: string;
  AuctionEndDate: string;
  EnbleAuctionLink?: string;
  ISAuction?: string;
};

export interface CardActionButtonsProps {
  isSubmitting: boolean;
  id: number;
  handleReset: (e: any) => void;
  remainingTime?: string;
  isEnabled?: boolean;
  handleDeleteClick?: () => void;
}

export interface UploadLotsActionsGroupProps {
  eventId?: number;
  remainingTime?: string;
  eventCategoryID?: number;
  handleExportListOfLotsClick?: () => void;
  handleUploadLotsClick: () => void;
  setIsInstructionDialogOpen: (open: boolean) => void;
  handleSaveModificationClick?: () => void;
  handleUploadAdditionalLotsClick?: () => void;
  isLoading?: LoadingState;
}

export interface EventTitleProps {
  eventId?: number | null;
  remainingTime?: string;
  loading?: LoadingState;
}

export interface CountDownTimerProps {
  eventId: number | null;
  remainingTime: string;
  loading: LoadingState;
}

export interface UploadLotsActionsProps extends EventTitleProps {
  isSubmitting: boolean;
  handleAddRow: () => void;
  handleClickTransferButton?: () => void;
}

export interface EventTimerProps extends CountDownTimerProps {
  startformatDate: string;
  endformatDate: string;
}

export interface UpsertTitleContainerProps {
  id: number;
  entityName: string;
}

export interface UploadLotStackSelectContainerProps {
  isSellerLoading: boolean;
  isMineLoading: boolean;
  eventId?: number;
  remainingTime?: string;
  mineData: MinesData[];
  sellerData: EventOrganizedForData[];
  eventCategoryID: number;
  selectedMineID: string;
  selectedSellerID: string;
  setSelectedMineID: Dispatch<SetStateAction<string>>;
  setIsInstructionDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedSellerID: Dispatch<SetStateAction<string>>;
  setUploadLotsCSVOpen: Dispatch<SetStateAction<boolean>>;
  handleExportListOfLotsClick?: () => void;
  handleSaveModificationClick?: () => void;
  isLoading?: LoadingState;
}

export interface SearchAndButtonContainerProps<T> {
  selected: number[];
  loading: LoadingState;
  selectedID: string;
  handleSellerChange: (event: SelectChangeEvent<number | string | boolean>) => void;
  sellerData: T[];
  handleClickExcelButton: () => void;
  handleAcceptBid: (actionType: 'accept' | 'refuse') => void;
  isSellerLoading: boolean;
}

export type BidData = {
  cts: number;
  Win_Rate: number;
  rate: number;
};

export interface EmailInvitationCardActionsProps {
  isSubmitting: boolean;
  handleReset: () => void;
  handleClose: () => void;
}

export interface AuctionRoomEventTimerProps extends EventTitleProps {
  summary: AuctionRoomSummary | undefined;
}

export interface AllLotsInfoProps {
  data: ChatRoomAllBiddersOrLotsData[];
  selectEventId: number;
  selectedBiddersData: SelectedBiddersData;
  loading: LoadingState;
}

export interface AllBiddersInfoProps {
  data: ChatRoomAllBiddersOrLotsData[];
  selectEventId: number;
  loading: LoadingState;
}

export interface AllLotsListProps<T> {
  search: string;
  allLotsSelectedUser: string | null;
  setSelectedBiddersData: (u: SelectedBiddersData) => void;
  allSelectedBidders: T[];
  loading: boolean;
}

export interface AllLotsListItemProps<T> {
  user: T;
  setSelectedBiddersData: (u: SelectedBiddersData) => void;
  allLotsSelectedUser: string | null;
}

export interface AllLotsProps {
  selectedBiddersData: SelectedBiddersData;
  selectEventId: number;
}
