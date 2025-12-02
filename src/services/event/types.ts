import { GenericResponse } from 'types/api/ApiGenericResponse';

export type EventData = {
  Event: string;
  EventID: number;
  SellerID: number;
  EventTypeID: number;
  EventType: string;
  startDate: string;
  EndDate: string;
  PwdValidDays: number | null;
  PageSize: number;
  ShowSellerLogo: string;
  Remarks: string | null;
  InsUserID: string;
  co_name: string;
  EventCategoryID: number;
  EventCategory: string;
  passenddate: string | null;
  STATUS: string;
  AdditionalHepldeskNo: string;
  companyID: number;
  EnbleLink: string;
  EnbleTenderresult: string;
  ManageAttndeeCss: string;
  ResultCSS: string;
  AuctionStartDate: string;
  AuctionEndDate: string;
  AuctionTime: string;
  EnbleAuctionLink: string;
  TenderEndDate: string;
  co_logo: string;
  IsAnalysing: boolean;
};

export type EventListResponse = GenericResponse & {
  data: EventData[];
};

export type PlatformDisplayData = {
  CompanyID: number;
  domainname: string;
};

export type PlatformDisplayResponse = GenericResponse & {
  data: PlatformDisplayData[];
};

export type EventTypeData = {
  EventTypeID: number;
  EventType: string;
};

export type EventTypeResponse = GenericResponse & {
  data: EventTypeData[];
};

export type ProductTypeData = {
  eventcategoryID: number;
  eventcategory: string;
};

export type ProductTypeResponse = GenericResponse & {
  data: ProductTypeData[];
};

export type EventOrganizedForData = {
  sellerId: number;
  sellerName: string;
};

export type EventOrganizedForResponse = GenericResponse & {
  data: EventOrganizedForData[];
};

export type TermsConditionsData = {
  SeqNo: number;
  Title: string;
  Description: string;
};

export type TermsConditionsResponse = GenericResponse & {
  data: TermsConditionsData[];
};

export type AddEventParams = {
  refSellerIdEntityMas: number;
  eventType: number;
  startDateTime: string | null;
  endDateTime: string | null;
  insTerminal: string;
  pageSize: number;
  showSellerLogos: string;
  refTermsConditionsMstSeqNo: number;
  tcTitle: string;
  isTermsncondition: boolean;
  showPurchaseLimit: string;
  maxPurchaseLimit: number | string;
  isPubliciseResultsToBidders: boolean;
  showReservePrice: boolean;
  eventDescription: string;
  eventLocation: string;
  helpDeskLocation: string;
  helpDeskNumber: string;
  refEventCategoryIdEventCategoryMas: number;
  refcomapnyIdComapanyInfo: number;
  auctionStartDate: string | null;
  auctionDuration: string;
  auctionIncrease: number;
  timeEstimation: number;
};

export type AddEventData = {
  pId: number;
};

export type AddEventResponse = GenericResponse & {
  data: AddEventData;
};

export type UpdateEventParams = AddEventParams & {
  auTen_EvtId: number;
};

export type UpdateEventResponse = GenericResponse & {
  data: string;
};

export type EventByIdData = {
  auTen_EvtId: number;
  refSellerId_EntityMas: number;
  refEventTypeID_EventTypeMas: number;
  startDate: string;
  EndDate: string;
  PwdValidDays: string;
  PageSize: number;
  ShowSellerLogo: string;
  Remarks: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  refTermsConditionsMst_SeqNo: number;
  TCtitle: string;
  IsAnalysing: boolean;
  IsDecalareResult: boolean;
  IsTermsncondition: boolean;
  showOverAllPurchaseLimit: string;
  MaximumPurchaseLimit: number;
  ShowResultsToBidder: string;
  ISPubliciseResultsToBidders: boolean;
  EventDescription: string;
  EventLocation: string;
  HelpDeskLocation: string;
  HelpDeskNumber: string;
  refEventCategoryID_EventCategoryMas: number;
  loginurl: string;
  refcomapnyid_comapanyinfo: number;
  AuctionStartDate: string;
  AuctionEndDate: string;
  AuctionDuration: number;
  AuctionIncrease: number;
  TimeEstimation: number;
  TenderEndDate: string;
  ShowReservePrice: boolean;
  AuctionTimerEndDate: string;
  ISAuction: string;
};

export type EventByIdResponse = GenericResponse & {
  data: EventByIdData;
};

export type MinesData = {
  id: number;
  name: string;
};

export type MinesListResponse = GenericResponse & {
  data: MinesData[];
};

export type EventDeleteListResponse = GenericResponse & {
  data: string;
};

export type AddSendMailParams = {
  emailIds: string;
  emailSubject: string;
  emailBody: string;
};

export type AddSendMailResponse = GenericResponse & {
  data: string;
};

export type UnreadMessageData = {
  UnreadCount: number;
};

export type UnreadMessageCountResponse = {
  data: UnreadMessageData[];
};
