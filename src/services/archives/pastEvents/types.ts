import { GenericResponse } from 'types/api/ApiGenericResponse';

export type PastEventSeachData = {
  auTen_EvtId: number;
  startDate: string;
  EndDate: string;
  co_name: string;
  Invitation: number;
  Participant: number;
  TotalCts: number;
  Totallots: number;
  lotssold: number;
  caratsold: number;
  valuesold: number;
  PageSize: number;
  refSellerId_EntityMas: number;
  Attendance: number;
  EventCategory: number;
  EventCatType: string;
};

export type PastEventSearchListResponse = GenericResponse & {
  data: PastEventSeachData[];
};

export type PastEventsData = {
  EventID: string;
  auTen_EvtId: number;
  startDate: string;
  EndDate: string;
  SellingCompany: string;
  EventCategory: string;
};

export type PastEventsListResponse = GenericResponse & {
  data: PastEventsData[];
};

export type TenderBidsDetailsData = {
  auTen_EvtId: number;
  startDate: string;
  co_name: string;
  EndDate: string;
  SeqNo: number;
  stockNo: string;
  Size: string;
  stockDesc: string;
  Shape: string;
  Colour: string;
  Clarity: string;
  cut: string;
  pcs: number;
  rate: number;
  cts: number;
  NoOfBids: number;
  WinnerAmt: string;
  lotsvalue: string;
  reserve: number;
  valuesold: number;
};

export type TenderBidsDetailsListResponse = GenericResponse & {
  data: TenderBidsDetailsData[];
};

export type eventCategoryListData = {
  refEventCategoryID_EventCategoryMas: number;
};

export type EventCategoryListResponse = GenericResponse & {
  data: eventCategoryListData;
};

export type UpdatePastEventsEmergencyParams = {
  eventId: number;
  eventCategory: number;
  type: number;
};

export type GetCancelBiddingDataParams = {
  seqNo: number;
  eventId: number;
};

export type BidsData = {
  bid_value: number;
  InsTimeStamp: string;
  co_name: string;
  winner_Id: number;
  ranks: number;
  lot_value: number;
  diff: number;
  refEvtId_AuTenEvent: number;
  refBuyerID_EntityMas: number;
  refSeqNo_EventStock: number;
  bidStatus1: number;
  FinalLotStatus: string;
};

export type LotsData = {
  startDate: string;
  EndDate: string;
  co_name: string;
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  stockNo: string;
  cts: number;
  pcs: number;
  rate: number;
  totAmt: number;
  stockDesc: string;
  Size: string;
  Rfor: string;
  Remark: string;
  DefaultLotStatus: string;
  FinalLotStatus: string;
  refWinnerID_EntityMas: number;
  WinnerAmt: number;
  WinnerRemarks: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  Cut: string;
  Shape: string;
  Colour: string;
  Clarity: string;
  Comment: string;
  refEventTypeID_EventTypeMas: number;
  EvtStkExtendedTime: string;
  SellerID: number;
  MineID: number;
  marketprice: number;
  varianceprice: number;
  FinalLotStatus1: string;
};

export type GetCancelBiddingData = (BidsData | LotsData)[];

export type GetCancelBiddingDataResponse = GenericResponse & {
  data: GetCancelBiddingData[];
};

export type GetTenderHistoryParams = {
  seqNo: number;
  eventId: number;
};

export type GetTenderHistoryData = {
  ranks: number;
  co_name: string;
  contactPerson: string;
  bid_value: number;
  winningcompany: string;
  winningbid: string;
  winningparcel: string;
};

export type GetTenderHistoryListResponse = GenericResponse & {
  data: GetTenderHistoryData[];
};

export type GetContactBiddersParams = {
  eventId: number;
  eventCategory: number;
};

export type GetContactBiddersData = {
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  refBuyerID_EntityMas: number;
  inviteDate: string;
  co_name: string;
  co_add1: string;
  co_add2: string;
  co_city: string;
  co_state: string;
  co_country: string;
  co_zip: string;
  co_website: string;
  co_vatno: string;
  contactPerson: string;
  password: string;
  emailID1: string;
  emailID2: string;
  PhoneNO: string;
  phoneCountry2: string;
  phoneno2: string;
  mobileCountry1: string;
  mobileno1: string;
  mobileCountry2: string;
  mobileno2: string;
  faxCountry1: string;
  faxCountry2: string;
  faxno1: string;
  faxno2: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  user_name: string;
  EmailID: string;
};

export type GetContactBiddersListResponse = GenericResponse & {
  data: GetContactBiddersData[];
};

export type UpdatePastEventsPublicisedTenderResultParams = {
  eventId: number;
  eventCategory: number;
};

export type UpdatePastEventsExcelForTenderBidHistoryParams = {
  eventId: string;
  entityId: number;
  startDate: Date | null;
  endDate: Date | null;
};

export type UpdatePastEventsRealLocateBidParams = {
  eventId: number;
  seqNo: number;
  bidValue: number;
  entityId: number;
};

export type PastEventsRealLocateBidUpdateResponse = GenericResponse & {
  data: string;
};

export type UpdateModifyBidAccessParams = {
  password: string;
};

export interface ModifyBidAccessData {
  CompanyID: number;
  CompanyName: string;
  Address: string;
  HelpDeskNo: string;
  ContactNo1: string;
  ContactNo2: string;
  FaxNo1: string;
  FaxNo2: string;
  EmailID1: string;
  EmailID2: string;
  WebURL: string;
  UserID: string;
  Password: string;
  InsUserID: string | null;
  InsTimeStamp: string | null;
  InsTerminal: string | null;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
}

export type ModifyBidAccessUpdateResponse = GenericResponse & {
  data: ModifyBidAccessData[];
};
