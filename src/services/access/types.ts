import { GenericResponse } from 'types/api/ApiGenericResponse';

export type EventAccessData = {
  auTen_EvtId: number;
  refSellerId_EntityMas: number;
  refEventTypeID_EventTypeMas: number;
  startDate: string;
  EndDate: string;
  PwdValidDays: string | null;
  PageSize: number;
  ShowSellerLogo: string;
  Remarks: string | null;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string | null;
  UpdTerminal: string | null;
  refTermsConditionsMst_SeqNo: number;
  TCtitle: string;
  IsAnalysing: boolean;
  IsDecalareResult: boolean;
  IsTermsncondition: boolean;
  showOverAllPurchaseLimit: string;
  MaximumPurchaseLimit: number;
  ShowResultsToBidder: string | null;
  ISPubliciseResultsToBidders: boolean;
  EventDescription: string;
  EventLocation: string;
  HelpDeskLocation: string;
  HelpDeskNumber: string;
  refEventCategoryID_EventCategoryMas: number;
  loginurl: string | null;
  refcomapnyid_comapanyinfo: number;
  AuctionStartDate: string | null;
  AuctionEndDate: string | null;
  AuctionDuration: number;
  AuctionIncrease: number;
  TimeEstimation: number;
  TenderEndDate: string;
  ShowReservePrice: boolean;
};

export type AccessListResponse = GenericResponse & {
  data: EventAccessData[];
};

export type AccessData = {
  EntityID: number;
  CompanyName: string;
  Country: string;
  ContactPerson: string;
  EmailID: string;
  Contact: string;
  UserName: string;
  EntityType: string;
  EntityTypeID: string;
  IsActive: boolean;
  Seqno: string;
};

export type AccessByIdResponse = GenericResponse & {
  data: AccessData[];
};

export type UpdateAccessParams = {
  seqNOList: string;
  act: number;
};

export type AccessUpdateResponse = GenericResponse & {
  data: string;
};
