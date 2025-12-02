import { GenericResponse } from 'types/api/ApiGenericResponse';

export type AuctionRoomData = {
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  stockNo: string;
  cts: number;
  pcs: number;
  rate: number;
  totAmt: number;
  stockDesc: string;
  Size: string;
  EventType: string;
  startDate: string;
  EndDate: string;
  Max_bid_value: number;
  bid_value: number;
  Max_lot_value: number;
  lot_value: number;
  EvtStkExtendedTime: [string, string];
  SuggesetedMinBid: number;
  EnableLots: string;
  Shape: string | null;
  Colour: string | null;
  Cut: string | null;
  Comment: string | null;
  Clarity: string | null;
  refEventTypeID_EventTypeMas: number;
  SalesType: string;
  LotStatus: string;
  BidStatus: string;
  AuctionTime: string | null;
  LotsEndDate: string;
};

export type AuctionRoomResponse = GenericResponse & {
  data: AuctionRoomData[];
};

export type UpdateAuctionBidParams = {
  seqNo: number;
  bidValue: number;
  lotValue: number;
  eventId: number;
  minimumNewBid: number;
  entityID: number;
};

export type AuctionBidUpdateResponse = GenericResponse & {
  data: string;
};

export interface ChatMessageAPI {
  senderID: number;
  messageBody: string;
  senderName: string;
  messageTime: string;
  isRead: boolean;
}

export interface ChatMessageUpdate {
  id: number;
  senderID: number;
  senderName: string;
  messageBody: string;
  messageTime: string;
  isRead: boolean;
  recipientID?: number;
  recipientName?: string;
  refEvtId_AuTenEvent?: number;
  StockSeqNo?: number;
}

export interface ChatUpdatedPayload {
  eventId: number;
  messages: ChatMessageAPI[];
  newMessage: {
    eventId: number;
    entityId: number;
    senderName: string;
    messageBody: string;
    type: number;
    bidderId: number;
    updatedChat: ChatMessageUpdate[];
    timestamp: string;
  };
}

export type AuctionChatResponse = GenericResponse & {
  data: ChatMessageAPI[];
};
