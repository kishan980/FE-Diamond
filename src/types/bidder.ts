import { SelectChangeEvent } from '@mui/material/Select';
import { LoadingState } from './table';
import { GetAllLotsTotalLotsData } from 'services/bidder/all-lots/type';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';

export interface BidderActionButtonsProps {
  isSubmitting: boolean;
  handleWithdraw: () => void;
  remainingTime: string | null;
  withdrawBidLoading: boolean;
}

export interface EventResultActionButtonsProps {
  isSubmitting: boolean;
  handleWithdraw: () => void;
  withdrawBidLoading: boolean;
}

export interface AuctionEventInfoProps {
  remainingTime: string;
  basicDetailsLots: GetAllLotsTotalLotsData[];
  eventTenderData: GetViewParticipateData[];
  loading: LoadingState;
}

export interface CommonBidderDetailsProps {
  eventId: number;
  remainingTime: string;
  totalCommitment: number;
  totalNumberOfBids: number;
  loading: LoadingState;
  showOverAllPurchaseLimit: string;
  maximumPurchaseLimit?: number;
  basicDetailsLots: GetAllLotsTotalLotsData[];
  eventTenderData: GetViewParticipateData[];
}

export type AllLotsBidderDetailsProps = CommonBidderDetailsProps;
export type SubmittedBidDetailsProps = CommonBidderDetailsProps;

export interface OverallPurchaseLimitInfoProps {
  show: boolean;
  loading: LoadingState;
  maximumPurchaseLimit: number | undefined;
  eventId: number;
}

export interface OverallPurchaseLimitEventTimerProps<T> {
  eventData: T | undefined;
  eventId: number;
  remainingTime: string;
  loading: LoadingState;
}

export interface OptionItem {
  id: number;
  name: string;
}
export interface SelectAndActionsBidsProps<T> {
  data: T[];
  id: string;
  selected: number[];
  isSubmitting: boolean;
  handleWithdraw: () => void;
  selectedID: string;
  handleSelect: (event: SelectChangeEvent<number | string | boolean>) => void;
  withdrawBidLoading: boolean;
}

export interface BidderPerformancePageProps {
  entityType: 'Rough' | 'Polished';
  pageTitle: string;
}

export interface PerformanceDetailsProps {
  data: {
    label: string;
    value: number | string;
  }[];
}

export interface SubmittedBidsSelectAndActionsProps<T> {
  isMineLoading: boolean;
  mineData: OptionItem[];
  isSubmitting: boolean;
  handleWithdraw: () => void;
  selectedMineID: number;
  data: T[];
  remainingTime: string | null;
  handleSelect: (event: SelectChangeEvent<number | string | boolean>) => void;
  withdrawBidLoading: boolean;
  loading: LoadingState;
}

export interface AuctionRoomBidsDetailsProps<T> {
  data: T[];
  eventId: number;
  loading: LoadingState;
  remainingTime: string;
  eventTenderData: GetViewParticipateData[];
  basicDetailsLots: GetAllLotsTotalLotsData[];
}

export interface ChatWidgetProps<T> {
  eventId: number;
  userInfo: T;
  token: string | null;
}

export interface AuctionRoomBidTableRowProps<T> {
  row: T;
  values: Record<number, { price: string; total: string }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  isItemSelected: boolean;
  handleClick: (id: number) => void;
  eventCategoryId: number;
  index: number;
}

export interface ImageAndVideoPreviewModalProps<T> {
  selectedMedia: T | null;
  previewOpen: boolean;
  handlePreviewClose: () => void;
}
