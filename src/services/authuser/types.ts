import { GenericResponse } from 'types/api/ApiGenericResponse';

export type LoginUserParams = {
  userName: string;
  password: string;
  token: string;
};

export type CurrentUserDetails = {
  entityID: number;
  entityTypeID: number;
  username: string;
  eventID: number;
  eventID_SellerID: number;
  passwordValidDate: string;
  companyName: string;
  manageEventId: number;
  isAccept: boolean;
  termsConditionID: number;
  startDT: string;
  endDate: string;
  loginUser: string;
  pageSize: number;
  sellerLogo: string;
  showPurchaseLimit: string;
  purchaseLimit: number;
  eventCompanyName: string;
  eventEntityID: string;
  eventTypeID: number;
  existingEventID: number;
  timeOffset: number;
  lotNo: string;
  seqNO: number;
  iSeqNo: number;
  pastEventID: number;
  bidderId: number;
  editEventId: number;
  winnerID: number;
  showResultsToBidders: string;
  showReservePrice: string;
  iSMultiEvent: string;
  selectedMultiEventID: number;
  companyID: number;
  eventCategory: number;
  eventCatType: string;
  additionalHepldeskNo: string;
  eventRound: string;
  eventType: string;
  validForAuction: boolean;
  tenderEnddate?: string;
  auctionStartDate?: string;
  auctionEndDate?: string;
  auction_Winning_Bids: number;
  tender_submitted_bids: number;
  iSTendered: boolean;
  adminEntityId: number;
  iSConfirmAuctionPopup: boolean;
  isAuctionCompleted: boolean;
  isResultDeclare: boolean;
  isAccessArchives: string;
  isDownloadAccess: string;
  isParameterAccess: string;
  isPassword: string;
  isDecalareResult: boolean;
};

export type LoginUserData = {
  accessToken: string;
  token: string;
  expiry: number;
  currentUserDetails: CurrentUserDetails;
};

export type LoginUserResponse = GenericResponse & {
  data: LoginUserData;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ForgotPasswordResponse = GenericResponse & {
  data: string;
};
