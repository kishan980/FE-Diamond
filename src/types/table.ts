import React, { ChangeEvent, Dispatch, FocusEvent, SetStateAction, SyntheticEvent } from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { SelectChangeEvent } from '@mui/material/Select';
import { BidData } from './events';
import { KeyedObject } from './root';
import { OptionItem } from './bidder';
import { DialogProps } from './dialog';
import { GetBidderLotsParams } from 'services/bidder/all-lots/type';
import { GetSameBidEventData } from 'services/event/event-action/event-results/type';
import { EventOrganizedForData } from 'services/event/types';
import { RoughBiddersDocumentList } from 'services/account/roughBidders/type';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';

export type LotBidValues = {
  [key: number]: {
    price: string;
    total: string;
    AdminComment?: string;
  };
};

export interface LoadingState {
  isLoading: boolean;
  isProgress: boolean;
  isCircularLoading?: boolean;
  isTimerLoading?: boolean;
  isButtonLoading?: boolean;
  isExcelButtonLoading?: boolean;
  isXlsxButtonLoading?: boolean;
  isDeleteLoading?: boolean;
  isConfirmLoading?: boolean;
  isSendMailLoading?: boolean;
  isUserLoading?: boolean;
  isChatLoading?: boolean;
  isAuctionButtonLoading?: boolean;
}

export type ArrangementOrder = 'asc' | 'desc' | undefined;
export type SetLoadingFn = (value: (prev: LoadingState) => LoadingState) => void;

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export type ButtonStateValue = 'YesNo' | 'AcceptedReopen' | 'WithdrawReopen';
export type ButtonStateType = Record<string, ButtonStateValue>;

export type SearchFilters = {
  companyName?: string;
  contactPerson?: string;
  accountType?: number;
};

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
  sortable?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  isFixed?: boolean;
  fixedWith?: number | string;
  fixedRight?: number;
  minWidth?: number;
};

export interface SelectedChipProps {
  count: number;
  color?: 'default' | 'primary' | 'secondary';
  variant?: 'filled' | 'outlined' | 'light';
  sx?: object;
}
export interface TableBodyPageProps<T> {
  data: T[];
  page: number;
  rowsPerPage: number;
  loading: LoadingState;
}

export interface TableSortableProps<T> extends TableBodyPageProps<T> {
  order: ArrangementOrder;
  orderBy: string;
}

export interface EnhancedTableHeadProps extends TableCellProps {
  order: ArrangementOrder;
  orderBy?: string;
  numSelected?: number;
  rowCount?: number;
  onSelectAllClick?: (e: ChangeEvent<HTMLInputElement>) => void;
  onRequestSort: (e: SyntheticEvent, p: string) => void;
  handleClick?: (id: string, event: SyntheticEvent) => void;
  handleResetFilters?: () => void;
  handleClickSearch?: () => void;
  values?: { fromDatePicker: Date | null; toDatePicker: Date | null };
  setFieldValue?: (field: string, value: Date | null) => void;
  searchFilters?: SearchFilters;
  setSearchFilters?: Dispatch<SetStateAction<SearchFilters>>;
}

export interface CommonTableHeaderProps<T> extends EnhancedTableHeadProps {
  title: string;
  headCells: HeadCell[];
  showCheckbox?: boolean;
  searchFields?: ('companyName' | 'contactPerson')[];
  searchDropDown?: (keyof SearchFilters)[];
  sellerData?: T[];
  selectedSellerId?: number;
  handleChangeSellerTypeSearch?: (text: number) => void;
}
export interface DocumentTableHeaderProps extends EnhancedTableHeadProps {
  companyNameSearch: string;
}

export interface RoughBiddersDocumentProps extends DialogProps {
  entityID: number;
  co_name: string;
}

export interface PastEventsTableHeaderProps<T> extends EnhancedTableHeadProps {
  sellerData: T[];
  selectedSellerId: number;
  handleChangeSellerTypeSearch: (text: number) => void;
}
export interface SelectViewersTableHeaderProps<T> extends EnhancedTableHeadProps {
  data: T[];
  handleInvitedClick: (property: string) => void;
  handleLoginClick: (property: string) => void;
  handleResetFilters: () => void;
}

export interface EventResultsBidderBodyProps<T> extends TableSortableProps<T> {
  bidderLots: GetBidderLotsParams[];
}

// Events
export interface SelectViewerTableBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number, emailID: string) => void;
}

export interface SelectParticipantsTableBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number, emailID: string, emailID2: string) => void;
  eventCategoryId: number;
}

export interface ManageAttendeesTableBodyProps<T> extends TableSortableProps<T> {
  entityID: number;
  isSelected: (id: number) => boolean;
  handleClick: (id: number) => void;
  fetchPrintLotsData: (entityID: string) => Promise<void>;
  eventCategoryId: number;
}

export interface UploadPaperTableBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number) => void;
  eventCategoryId: number;
  values: LotBidValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export interface EventAnalysingResultsChildUpperTableProps<T> {
  loading: LoadingState;
  getBidResultsSummary: T[];
}

export interface EventAnalysingResultsChildTableBodyProps<T> extends EventAnalysingResultsChildUpperTableProps<T> {
  showOverAllPurchaseLimit: string | undefined;
  handleProfileDetailsReadClick: (sellerID: number) => void;
}

export interface EventResultsBidderTableProps<T> extends EventAnalysingResultsChildUpperTableProps<T> {
  isPubliciseResults: boolean | undefined;
  showOverAllPurchaseLimit: string | undefined;
  handleProfileDetailsReadClick: (sellerID: number) => void;
  handleActionClick: (action: 'Yes' | 'No', message: string) => void;
}

export interface EventResultsTableBodyProps<T> {
  data: T[];
  loading: LoadingState;
  order: ArrangementOrder;
  orderBy: string;
  handleClick: (id: number) => void;
  isSelected: (id: number) => boolean;
  onSelectData: (data: BidData, actionType: string) => void;
  eventId: number;
  fetchBidDetails: () => void;
  handleProfileDetailsReadClick: (sellerID: number) => void;
  buttonState: ButtonStateType;
  setButtonState: React.Dispatch<React.SetStateAction<ButtonStateType>>;
  eventCategoryID: number;
}

export interface EventAnalysisResultTableBodyProps<T> {
  totals: T;
  loading: LoadingState;
}

export interface ContactAttendeesTableBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number, emailID1: string, emailID2: string) => void;
}

// Parameters
export interface SellingCompanyTableBodyProps<T> extends TableSortableProps<T> {
  onStatusToggle: (entityID: number) => void;
  onWebsiteLinkClick: (url: string) => void;
}

export interface TermsAndConditionTableBodyProps<T> extends TableSortableProps<T> {
  onDeleteClick: (seqNo: number) => void;
  onViewPDFClick: (description: string) => void;
}

export interface TableWithActionsProps<T> extends TableSortableProps<T> {
  onDeleteClick: (seqNo: number) => void;
}

export type LegalDocumentTableBodyProps<T> = TableWithActionsProps<T>;
export type EmailTemplateTableBodyProps<T> = TableWithActionsProps<T>;

// Accounts
export interface AdministratorsTableBodyProps<T> extends TableSortableProps<T> {
  isDownloadAccess: boolean;
  onDeleteClick: (entityID: number) => void;
}

export interface DocumentTableBodyProps<T> extends TableSortableProps<T> {
  onSingleFileClick: (seqNo: string, docPath: string) => void;
  onDeleteClick: (seqNo: string) => void;
  onMoreMenuClick: (docPath: string) => void;
}

export interface PolishedBidderTableBodyProps<T> extends TableSortableProps<T> {
  onDocumentClick: (entityID: number, co_name: string) => void;
  onDeleteClick: (entityID: number) => void;
}

export interface RoughBiddersTableBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number, emailID1: string, emailID2: string) => void;
  onDocumentClick: (entityID: number, co_name: string) => void;
  onDeleteClick: (entityID: number) => void;
}

export interface LegalTableBodyProps<T> extends TableSortableProps<T> {
  handleFileChange: (row: number | RoughBiddersDocumentList, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface ViewersTableBodyProps<T> extends TableSortableProps<T> {
  onDeleteClick: (entityID: number) => void;
}

// Access
export interface AccessTableBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number) => void;
}

// Bidders
export interface AllLotsTableProps<T> {
  isMineLoading: boolean;
  eventTenderData: GetViewParticipateData[];
  data: T[];
  values: Record<number, { price: string; total: string }>;
  selected: number[];
  mineData: OptionItem[];
  pageSize: number;
  selectedMineID: number;
  isSubmitting: boolean;
  setValues: (values: LotBidValues) => void;
  handleBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editedRows: Set<number>;
  isSelected: (id: number) => boolean;
  remainingTime: string | null;
  submittedRows: Set<number>;
  setEditedRows: Dispatch<SetStateAction<Set<number>>>;
  loading: LoadingState;
  eventCategory: number | null;
  handleClick: (id: number | string) => void;
  handleSelect: (event: SelectChangeEvent<number | string | boolean>) => void;
  handleWithdraw: () => void;
  handleSubmitForm: (values: LotBidValues) => void;
  handleSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMediaMenuClick: (stockNo: string) => void;
  withdrawBidLoading: boolean;
}

export interface SubmittedBidsTableProps<T> {
  eventTenderData: GetViewParticipateData[];
  data: T[];
  values: Record<number, { price: string; total: string }>;
  selected: number[];
  setValues: (values: LotBidValues) => void;
  handleBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSelected: (id: number) => boolean;
  handleClick: (id: string | number) => void;
  handleSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  eventCategory: number | null;
  remainingTime: string | null;
  loading: LoadingState;
  handleSubmitForm: (values: LotBidValues) => void;
  handleMediaMenuClick: (stockNo: string) => void;
}

export interface EventResultsTableProps<T> {
  eventId: number;
  loading: LoadingState;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  sellerData: EventOrganizedForData[];
  bidEventData: GetSameBidEventData[];
  getBidDetails: T[];
  handleClickExcelButton: () => void;
  fetchBidDetails: () => void;
  fetchGetBidEventData: () => void;
  onSelectData: (data: BidData, actionType: string) => void;
  handleProfileDetailsReadClick: (sellerID: number) => void;
  isSellerLoading: boolean;
}

// Archives
export interface CustomisedReportsTableBodyProps<T> extends TableSortableProps<T> {
  isDownloadAccess: boolean;
  onDeleteClick: (seqNo: number) => void;
  onExcelClick: (seqNo: number) => void;
}

export interface PastEventsTableBodyProps<T> extends TableSortableProps<T> {
  isDownloadAccess: boolean;
  onExcelClick: (eventId: number, categoryId: number) => void;
  isLoading?: boolean;
  isPastEventsInitialLoading: boolean;
}

export interface TenderBidsDetailsTableBodyProps<T> extends TableSortableProps<T> {
  eventCategoryID: number;
  onDetailsClick: (seqNo: number) => void;
  onModifyClick: (seqNo: number) => void;
  isLoading?: boolean;
}

export interface CancelBiddingTableBodyProps<T> {
  data: T[];
  eventCategoryID: number;
  loading: LoadingState;
}

export interface CancelWinningTableBodyProps<T> {
  data: T[];
  loading: LoadingState;
  handleReallocateBid: (eventId: number, seqNo: number, bidValue: number, entityId: number) => void;
  handleWithdrawBid: (status: string, seqNo: number) => void;
  handleProfileDetailsReadClick: (sellerID: number) => void;
}

export interface ContactBiddersBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number, emailID: string, emailID2: string) => void;
}

export interface BidderPerformanceTableBodyProps<T> extends TableSortableProps<T> {
  isDownloadAccess: boolean;
  entityType: 'Rough' | 'Polished';
  onExcelClick: (entityID: number) => void;
}

export interface BiddersPerformanceDetailsTableBodyProps<T> extends TableSortableProps<T> {
  entityType: string | null;
}

export interface ExportExcelReportBodyProps<T> extends TableSortableProps<T> {
  isSelected: (id: number) => boolean;
  handleClick: (id: number) => void;
}

export interface EventCollapsibleAnalysingTableProps<T> {
  bidEventData: T[];
  loading: LoadingState;
  eventId: number;
  fetchBidDetails: () => void;
  fetchGetBidEventData: () => void;
  eventCategoryID: number;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  handleProfileDetailsReadClick: (sellerID: number) => void;
}

export interface EventCollapsibleAnalysingTableBodyProps<T> {
  data: T[];
  loading: LoadingState;
  order: ArrangementOrder;
  orderBy: string;
  eventId: number;
  eventCategoryID: number;
  fetchBidDetails: () => void;
  fetchGetBidEventData: () => void;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  handleProfileDetailsReadClick: (sellerID: number) => void;
}

export interface EventCollapsibleAnalysingTableBodyRowProps<T> {
  row: T;
  eventId: number;
  fetchGetBidEventData: () => void;
  fetchBidDetails: () => void;
  eventCategoryID: number;
  loading: LoadingState;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  handleProfileDetailsReadClick: (sellerID: number) => void;
}

export type LotOverviewTableBodyProps<T> = TableSortableProps<T>;

export interface LotOverviewDetailsTableProps<T> extends TableSortableProps<T> {
  showFinalStatusCell: Boolean;
  onRefuseClick: (entityId: number) => void;
}

export type CommonLotsTableBodyProps<T> = {
  eventTenderData: GetViewParticipateData[];
  data: T[];
  values: Record<number, { price: string; total: string }>;
  isSelected: (id: number) => boolean;
  handleClick: (id: number) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, field: 'price' | 'total') => void;
  handleBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  remainingTime: string | null;
  eventCategory: number | null;
  loading: LoadingState;
  onSubmitForm: (values: LotBidValues) => void;
  onMediaMenuClick: (stockNo: string) => void;
  handleManualPriceChange?: (rowId: number, delta: number) => void;
  order: ArrangementOrder;
  orderBy: string;
};

export interface LotOverviewSubTableProps<T> {
  detailsData: T[];
  showFinalStatusCell: boolean;
  handleOpenConfirmModal: (entityId: number) => void;
  loading: LoadingState;
}

export interface AuctionRoomBiderTableBodyProps<T> extends TableSortableProps<T> {
  remainingTime: string;
  eventCategory: number;
  entityID: number;
  eventId: number;
  auctionDurations: { [key: number]: string };
  onUpdateRow?: (seqNo: number, updated: Partial<T>) => void;
}

export interface AuctionRoomTableBodyProps<T> extends TableSortableProps<T> {
  loading: LoadingState;
  auctionDurations: { [key: number]: string };
  handleProfileDetailsReadClick: (sellerID: number) => void;
  onlineUserIds: number[];
}

export interface AllLotsTableBodyProps<T> extends TableSortableProps<T> {
  onDeleteClick: (seqNo: number, entityId: number) => void;
  eventId: number;
  seqNo: number;
  onlineUserIds: number[];
}
