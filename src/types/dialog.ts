import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from 'react';
import { FormikState } from 'formik';
import { LoadingState } from './table';
import { SellingData } from 'services/parameter/sellingCompany/type';
import { GetCancelBiddingData, GetTenderHistoryData } from 'services/archives/pastEvents/types';
import { DialogFilters, Filter, SelectColumnData, SelectedColumnValue } from 'services/archives/customisedReports/types';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import { TermConditionAgreementItem } from 'services/parameter/termsAndCondition/type';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';

export interface DialogProps {
  open: boolean;
  handleClose: () => void;
}

export interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export interface BidderDocumentModalProps extends DialogProps {
  docName: string;
  entityID: number;
  selectedDocPath: string;
  refSeqNo: string | number;
  selectedSeqNo: string;
  fetchData: () => void;
}

export type RoughBidderModalProps = BidderDocumentModalProps;
export type PolishedBidderModalProps = BidderDocumentModalProps;

export interface LoginModelProps extends DialogProps {
  handleLoginModalCilck: (password: string, setSubmitting: (isSubmitting: boolean) => void, onSuccess: () => void) => void;
}

export interface RevisedTermsAndConditionModelProps extends DialogProps {
  eventId: number;
}

export interface UpdatePasswordModelProps extends DialogProps {
  handleUpdateModalCilck: (
    password: string,
    newPassword: string,
    confirmPassword: string,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: (
      nextState?: Partial<
        FormikState<{
          password: string;
          newPassword: string;
          confirmPassword: string;
        }>
      >
    ) => void
  ) => void;
}

export interface DeleteDialogProps extends DialogProps {
  onConfirm: () => void;
  title: string;
  loading: LoadingState;
}

export interface ExcelDialogProps extends DialogProps {
  title: string;
  handleDataWithFormula: () => void;
  handleDataWithoutFormula: () => void;
  dataGetLoader: 'dataWith' | 'dataWithout' | null;
}

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: LoadingState;
}

export interface DocumentListDialogProps extends DialogProps {
  entityID: number;
  co_name: string;
}

export interface UploadImageAndVideoDialogProps<T> extends DialogProps {
  moreMenuLotNo: string;
  handleGetUploadLotsById: (id: number, isInitialLoad?: boolean) => void;
  uploadedImages: T;
}

export interface ImageAndVideoDialogProps<T> extends DialogProps {
  uploadedImages: T;
  selectedLot: GetAllLotsData | null;
}

export interface UploadXLSFileDialogProps extends DialogProps {
  eventCatagoryId: number;
  selectedSellerID: string;
  selectedMineID: string;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  isLoading: boolean;
  handleGetUploadLotsById: (id: number, isInitialLoad?: boolean) => void;
}

export interface UploadAdditionalXlxsFileDialogProps extends DialogProps {
  eventCatagoryId: number;
  selectedSellerID: string;
  selectedMineID: string;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
  isLoading: boolean;
  handleGetUploadLotsById: (id: number) => void;
}

export interface FilterDialogProps extends DialogProps {
  filters: { BIDDINGPER: Filter[]; PERFORMANCE: Filter[] };
  onSubmit: (filters: DialogFilters) => void;
  selectFilterValues: string[];
  selectColumnData: SelectColumnData[];
  setFilters: Dispatch<SetStateAction<{ BIDDINGPER: Filter[]; PERFORMANCE: Filter[] }>>;
  loading: LoadingState;
}
export interface SellingCompanyDialogProps<T> extends DialogProps {
  onSubmit: (selectSellerValues: T[]) => void;
  sellerData: SellingData[];
  selectSellerValues: T[];
  setSelectSellerValues: Dispatch<SetStateAction<T[]>>;
  loading: LoadingState;
}

export interface SelectColumnDialogProps extends DialogProps {
  onSubmit: (selectedValues: SelectedColumnValue[]) => void;
  selectColumnData: SelectColumnData[];
  selectColumnValues: SelectedColumnValue[];
  setSelectColumnValues: Dispatch<SetStateAction<SelectedColumnValue[]>>;
  loading: LoadingState;
}

export interface ViewTermsAndConditionDialogProps<T> extends DialogProps {
  loading: LoadingState;
  handleAcceptClick: () => void;
  handleDeclineClick: () => void;
  termAndConditionItem: T[];
}

export interface TenderHistoryDialogProps extends DialogProps {
  eventCategoryID: number;
  tenderHistoryData: GetTenderHistoryData[];
  cancelBiddingData: GetCancelBiddingData[];
}

export interface ExportExcelReportDialogProps extends DialogProps {
  isDownloadAccess: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

export interface UploadInstructionsDialogProps extends DialogProps {
  eventCategoryID: number;
}

export interface UploadStockDetailsDialogProps extends DialogProps {
  moreMenuLotNo: string;
  loading: LoadingState;
  setLoading: Dispatch<SetStateAction<LoadingState>>;
}

export interface ProfileDetailsReadDialogProps extends DialogProps {
  entityID: number | null;
}

export interface ProfileDetailsDialogProps extends DialogProps {
  entityID: number | null;
  eventId: number;
  setIsViewParticipateDialogOpen: Dispatch<SetStateAction<boolean>>;
  termAndConditionnAgreementItem: TermConditionAgreementItem[];
  eventTenderData: GetViewParticipateData[];
}

export interface EmailInvitationDialogProps extends DialogProps {
  selectedEmail: string;
  setSelectedEmails: Dispatch<SetStateAction<string[]>>;
  setSelected: Dispatch<SetStateAction<number[]>>;
}

export interface ContactEmailBiddersDialogProps<T> extends DialogProps {
  data: T[];
  isDownloadAccess: boolean;
  selectedEmail: string;
  setSelectedEmails: Dispatch<SetStateAction<string[]>>;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  isSelected: (id: number) => boolean;
  handleClick: (id: number, emailID: string, emailID2: string) => void;
  loading: LoadingState;
  handleDownloadPublicisedFile: () => void;
  handleSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface BidSubmissionSuccessDialogProps extends DialogProps {
  auctionStartDate: string;
}

export interface ErrorMessageDialogProps extends DialogProps {
  bidValue: number | null;
}

export interface AuctionRoomProcessDialogProps extends DialogProps {
  handleAuctionClick: () => void;
  eventId: number;
  loading: LoadingState;
}

export interface AuctionCloseDialogProps extends DialogProps {
  onConfirm: () => void;
}
