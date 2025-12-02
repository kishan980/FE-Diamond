import { GenericResponse } from 'types/api/ApiGenericResponse';

export type BiddersListData = {
  entityID: number;
  co_name: string;
};

export type BiddersListResponse = GenericResponse & {
  data: BiddersListData[];
};

export type BidderPerformanceDetailsData = {
  co_name: string;
  entityID: number;
  SeqNo: number;
  Totalevent: number;
  totalinvited: number;
  totalparticipate: number;
  totalbidplaced: number;
  totalwon: number;
  totalwoncarat: string;
  totalwoncaratprice: string;
  topHighBid: number;
  TotalEventsAttended: number;
  LastBidDate: string;
  LastPurchaseDate: string;
  Email1: string;
  Email2: string;
  IsActive: string;
  BidderType: string;
};

export type BidderPerformanceDetailsResponse = GenericResponse & {
  data: BidderPerformanceDetailsData[];
};

export type BidderPerformanceData = {
  auTen_EvtId: number;
  startDate: string;
  EndDate: string;
  co_name: string;
  contactPerson: string;
  scompnay: string;
  stockNo: string;
  Size: string;
  stockDesc: string;
  pcs: number;
  rate: number;
  cts: number;
  bid_value: number;
  Clarity: string | null;
  Colour: string | null;
  Shape: string | null;
  Cut: string | null;
  Comment: string | null;
  ranks: number;
  noofbidder: number;
  pvale: string;
  FinalLotStatus: string;
  wvale: string | null;
};

export type BidderPerformanceByIdResponse = GenericResponse & {
  data: BidderPerformanceData[];
};
