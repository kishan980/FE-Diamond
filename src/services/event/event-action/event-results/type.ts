import { GenericResponse } from 'types/api/ApiGenericResponse';

export type revisedStatusParams = {
  eventId: number;
};

export type RevisedStatusResponse = GenericResponse & {
  data: string;
};

export type GetBidderListData = {
  refBuyerID_EntityMas: number;
  namee: string;
};

export type GetBidderListResponse = GenericResponse & {
  data: GetBidderListData[];
};

export type DeleteBidderListParams = {
  eventId: number;
  entityId: number;
  stockNos: number[];
};

export type BidderListDetail = {
  seqNoEventStock: number;
  bidValue: number;
  lotValue: number;
  maxPurchaseLimit: null;
};

export type AddBidderListParams = {
  eventId: number;
  entityId: number;
  bidDetails: BidderListDetail[];
};

export type AddBidderListResponse = GenericResponse & {
  data: string;
};

export type DeclareWinnerParams = {
  eventId: number;
  showResultToBidder: string;
};

export type DeclareWinnerResponse = GenericResponse & {
  data: string;
};

export type BidDetail = {
  sold?: number;
  withdrawn?: number;
  offeredParcel?: number;
  noBids?: number;
};

export type UpdateEmergencyParams = {
  id: number;
  type: number;
  eventCategory: number;
  snapShotFirstRowData: BidDetail[];
  caratsDetails: BidDetail[];
  highestBidDetails: BidDetail[];
  reservePriceVal: BidDetail[];
  variancePerReserveVal: BidDetail[];
  highestBidAvg: BidDetail[];
  reservePriceAvg: BidDetail[];
};

export type AttendeesData = {
  NumberOfAttendees: number;
};

export type BiddersData = {
  NumberOfBidders: number;
};

export type BidsData = {
  NumberOfBids: number;
};

export type WinningBiddersData = {
  NumberOfWinningBidders: number;
};

export type NumberOfBiddersAndAttendeesPercentageData = {
  NumberOfWinningBiddersPercentage: number;
};

export type NumberOfBiddersPercentageData = {
  NumberOfBiddersPercentage: number;
};

export type AvgNumOfBidsPerLotData = {
  AvgNumOfBidsPerLot: number;
};

export type AvgNumOfBidsPerBidderData = {
  AvgNumOfBidsPerBidder: number;
};

export type NumberOfWinningBiddersPercentageData = {
  NumberOfWinningBiddersPercentage: number;
};

export type RankingData = {
  lt: number;
  co_name: string;
  nos: number;
  refWinnerID_EntityMas: number;
  purchaseLimit: number;
  rank1: string;
};

export type RankingDataWrapper = {
  RankingData: RankingData[];
};

export type GetBidResultSummaryData =
  | AttendeesData
  | BiddersData
  | BidsData
  | WinningBiddersData
  | NumberOfBiddersAndAttendeesPercentageData
  | NumberOfBiddersPercentageData
  | AvgNumOfBidsPerLotData
  | AvgNumOfBidsPerBidderData
  | NumberOfWinningBiddersPercentageData
  | RankingDataWrapper;

export type GetBidResultSummaryResponse = GenericResponse & {
  data: GetBidResultSummaryData[];
};

export type GetBidDetailsForWinnerData = {
  co_name: string;
  stockDesc: string;
  Size: string;
  cut: string;
  colour: string;
  Shape: string;
  Clarity: string;
  Comment: string;
  bid_value: number;
  SellerName: string;
  SellerID: number;
  MineID: string;
  Win_Rate: number;
  cts: number;
  rate: number;
  pcs: number;
  stockNo: string;
  SeqNo: number;
  refBuyerID_EntityMas: number;
  FinalLotStatus: string;
  noOfBids: number;
  variance: number;
  reserve: number;
  refEventTypeID_EventTypeMas: number;
  SalesType: string;
};

export type GetBidDetailsForWinnerResponse = GenericResponse & {
  data: GetBidDetailsForWinnerData[];
};

export type GetEventDetailsData = {
  startDate: string;
  EndDate: string;
  EventType: string;
  IsDecalareResult: boolean;
  IsAnalysing: boolean;
  Bcount: number;
};

export type GetEventDetailsResponse = GenericResponse & {
  data: GetEventDetailsData[];
};

export type EventAnalysingResultsDetailsData = {
  totalLots: number;
  totalCarats: number;
  totalWinRate: number;
  totalReserveValue: number;
  totalHighestReserveValue: number;
  totalHighestAverage: number;
  totalReservePriceAverage: number;
  soldDataCount: number;
  soldTotalCarats: number;
  soldTotalWinRate: number;
  soldTotalReserve: number;
  soldHighestReserveValue: number;
  soldHighestAverage: number;
  soldReservePriceAverage: number;
  withdrawnDataCount: number;
  withdrawnTotalCarats: number;
  withdrawnTotalWinRate: number;
  withdrawnTotalReserve: number;
  withdrawnHighestReserveValue: number;
  withdrawnHighestAverage: number;
  withdrawnReservePriceAverage: number;
  noBidDataCount: number;
  noBidTotalCarats: number;
  noBidTotalWinRate: number;
  noBidTotalReserve: number;
  noBidHighestReserveValue: number;
  noBidHighestAverage: number;
  noBidReservePriceAverage: number;
};

export type UpdateBidConsiderParams = {
  seqNo: number;
  eventId: number;
  entityId?: number;
  bidValue?: number;
  finalStatus: string;
};

export type BidConsiderUpdateResponse = GenericResponse & {
  data: string;
};

export type UpdateReOpenParams = {
  eventId: number;
  seqNo: number;
};

export type ReOpenUpdateResponse = GenericResponse & {
  data: string;
};

export type GetSameBidEventData = {
  stockNo: string;
  cts: number;
  pcs: number;
  rate: number;
  stockDesc: string;
  Size: string;
  cut: string;
  colour: string;
  Shape: string;
  Clarity: string;
  Comment: string;
  SeqNo: number;
  refEvtId_AuTenEvent: number;
  refEventTypeID_EventTypeMas: number;
  SalesType: string;
};

export type GetSameBidEventResponse = GenericResponse & {
  data: GetSameBidEventData[];
};

export type GetBiddingLotsData = {
  co_name: string;
  stockDesc: string;
  Size: string;
  cts: number;
  bid_value: number;
  Win_Rate: number;
  SeqNo: number;
  refEvtId_AuTenEvent: number;
  Telephone: string;
  ReviseStatus: string;
  refBuyerID_EntityMas: number;
  bseqno: number;
  contactPerson: string;
  mobileno: string;
  AdminComment: string;
};

export type GetBiddingLotsResponse = GenericResponse & {
  data: GetBiddingLotsData[];
};

export type UpdateReviseParams = {
  eventId: number;
  entityId: number;
  stockSeqNo: number;
  bidValue: number;
  userId: string;
  seqNo: number;
  adminComment?: string;
};

export type ReviseUpdateResponse = GenericResponse & {
  data: string;
};

export type GetLotsOverviewTable1 = {
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
  SalesType: string;
};

export type GetLotsOverviewTable2 = {
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
};

export type GetLotsOverviewResponse = GenericResponse & {
  data: [GetLotsOverviewTable2[], GetLotsOverviewTable1[]];
};

export type UpdateRefuseParams = {
  eventId: number;
  entityId: number;
  seqNo: number;
};

export type UpdateBidMultipleConsiderParams = {
  seqNo: string;
  eventId: number;
  finalStatus: string;
};

export type BidMultipleConsiderUpdateResponse = GenericResponse & {
  data: string;
};
