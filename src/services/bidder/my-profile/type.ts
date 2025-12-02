import { GenericResponse } from 'types/api/ApiGenericResponse';

export type ViewParticipateParams = {
  entityId: number;
  companyId: number;
  eventId?: number;
};

export type GetViewParticipateData = {
  EventID: number;
  EventDescription: string;
  EventLocation?: string;
  DefaultNumber?: string;
  HelpDeskLocation?: string;
  HelpDeskNumber?: string;
  startDate: string;
  EndDate: string;
  TermsConditionID?: number;
  EventType: string;
  EventRound: string;
  tenderenddate: string;
  Auctionstartdate: string;
  Auctionenddate: string;
  Qualifiedcount: number;
  ShowReservePrice: boolean;
  EventActive?: string;
  inviteDate?: string;
  IsAccept?: boolean;
  EntityTypeID?: number;
  EntityID?: number;
  Username?: string;
  isActive?: number;
  isLocked?: boolean;
  emailID1?: string;
  emailID2?: string;
  co_name?: string;
  co_add1?: string;
  co_add2?: string;
  co_city?: string;
  co_state?: string;
  co_country?: string;
  co_zip?: string;
  co_logo?: string;
  co_website?: string;
  co_vatno?: number | null;
  contactPerson?: string;
  phoneCountry1?: string;
  phoneno1?: string;
  phoneCountry2?: string;
  phoneno2?: string;
  mobileCountry1?: string;
  mobileno1?: string;
  mobileCountry2?: string;
  mobileno2?: string;
  faxCountry1?: string;
  faxno1?: string;
  PageSize?: number[];
  PwdValidDays?: number | null;
  ShowSellerLogo?: string;
  showPurchaseLimit?: string;
  MaximumPurchaseLimit?: number;
  SellerlogoName?: string;
  EventCompantName?: string;
  PubliciseResultsToBidders?: boolean;
  AdditionalHepldeskNo?: string;
  CompanyID?: number;
  refSellerId_EntityMas?: number;
  Tender_Suubmitted_Bids?: number;
  Auction_Winning_BIds?: number;
  IsconfirmPopup?: boolean;
};

export type GetViewParticipateResponse = GenericResponse & {
  data: GetViewParticipateData[];
};

export type ChangePasswordParams = {
  entityId: number;
  entityTypeId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordResponse = GenericResponse & {
  data: string;
};

export type AddProfileDetailsParams = {
  companyName: string;
  address: string;
  address1: string;
  city: string;
  postCode: string;
  contactPerson: string;
  contactPerson1: string;
  email: string;
  email1: string;
  telephoneNumber: string;
  countryCode: string;
  mobileNumber: string;
  countryCode1: string;
  mobileNumber1: string;
  faxNo: string;
  website?: string;
};

export type UpdateProfileDetailsParams = AddProfileDetailsParams & {
  id: number;
};

export type ProfileDetailsUpdateResponse = GenericResponse & {
  data: string;
};

export type AddConfirmProfileDetailsParams = {
  companyName: string;
  address: string;
  address1: string;
  city: string;
  postCode: string;
  contactPerson: string;
  contactPerson1: string;
  email: string;
  email1: string;
  telephoneNumber: string;
  countryCode: string;
  mobileNumber: string;
  countryCode1: string;
  mobileNumber1: string;
  faxNo: string;
  website?: string;
};

export type UpdateConfirmProfileDetailsParams = AddConfirmProfileDetailsParams & {
  id: number;
  eventId: number;
};

export type ConfirmProfileDetailsUpdateResponse = GenericResponse & {
  data: string;
};
