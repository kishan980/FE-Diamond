import { GenericResponse } from 'types/api/ApiGenericResponse';

export type AuctionRoomSummary = {
  MaxAuctionTime: string;
  AuctionLots: string;
  Biddercount: string;
};

export type Bidder = {
  refSeqNo_EventStock: number;
  bidderName: string;
  refBuyerID_EntityMas: number;
  Max_bid_value: number;
  Max_lot_value: number;
  noOfBids: string;
  bidscss: string;
  onlineuser: string;
};

export type AuctionRoomLotData = {
  stockDesc: string;
  Size: string;
  cut: string | null;
  colour: string | null;
  Shape: string | null;
  Clarity: string | null;
  Comment: string | null;
  cts: number;
  rate: number;
  pcs: number;
  stockNo: string;
  SeqNo: number;
  FinalLotStatus: string | null;
  noOfBids: string;
  bidscss: string;
  Max_bid_value: number;
  Max_lot_value: number;
  SuggesetedMinBid: number;
  reserve: number;
  refEventTypeID_EventTypeMas: number;
  AuctionremainingTime: string;
  CountOfLoggedInUser: number;
  bidders: Bidder[];
};

export type AuctionRoomData = {
  summary: AuctionRoomSummary;
  lots: AuctionRoomLotData[];
};

export type AuctionRoomResponseData = GenericResponse & {
  data: AuctionRoomData[];
};

export type SelectBiddersData = {
  stockNo: string;
  SeqNo: number;
};

export type SelectedBiddersData = {
  stockNo?: string;
  SeqNo?: number;
};

export type LostBiddersData = {
  refBuyerID_EntityMas: number;
  user_name: string;
};

export type LostedBiddersData = {
  refBuyerID_EntityMas?: number;
  user_name?: string;
};

export type BiddersLotsChatAuctionData = {
  selectBidders: SelectBiddersData[];
  lostBidders: LostBiddersData[];
};

export type BiddersLotsChatAuctionResponseData = GenericResponse & {
  data: BiddersLotsChatAuctionData[];
};

export type ChatRoomAllBiddersOrLotsParams = {
  eventId: string;
  type: number;
  seqNo: number;
};

export type SelectAllBiddersAndLots = {
  stockNo: string;
  SizeRange: string;
  LotDesc: string;
  Carat: number;
  ReservedPrice: number;
  TimeEstimation: number;
  TimeLeft: string;
  SuggesetedMinBid: number;
  SuggesetedMinBidPerCt: number;
  HigestBid: number;
};

export type LostAllBiddersAndLots = {
  refSeqNo_EventStock: number;
  bidderName: string;
  refBuyerID_EntityMas: number;
  Max_lot_value: number;
  Max_bid_value: number;
  ranks: number;
  onlineuser: string;
};

export type SelectBidders = {
  LotAuctioned: number;
  LoginUser: number;
  TimeEstimation: number;
  TimeLeft: string;
};

export type ChatRoomAllBiddersOrLotsData = {
  selectAllBiddersAndLots: SelectAllBiddersAndLots[];
  lostAllBiddersAndLots: LostAllBiddersAndLots[];
  selectBidders: SelectBidders[];
};

export type ChatRoomAllBiddersOrLotsResponseData = GenericResponse & {
  data: ChatRoomAllBiddersOrLotsData[];
};

export type UpdateWithdrawAuctionBidParams = {
  eventId: number;
  seqNo: number | null;
  entityId: number | null;
};

export type WithdrawAuctionBidUpdateResponse = GenericResponse & {
  data: string;
};

export type UpdateTimeInMinutesParams = {
  eventId: number;
  timeInMinutes: number | null;
  seqNo?: number | null;
};

export type TimeInMinutesUpdateResponse = GenericResponse & {
  data: string;
};
