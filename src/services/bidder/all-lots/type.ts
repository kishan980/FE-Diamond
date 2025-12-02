import { GenericResponse } from 'types/api/ApiGenericResponse';

export type AllLotsValuesType = {
  companyName: string;
  address: string;
  address1: string;
  city: string;
  country: string;
  postCode: string;
  contactPerson: string;
  contactPerson1: string;
  email: string;
  email1: string;
  telCountry: string;
  telephoneNumber: string;
  countryCode: string;
  mobileNumber: string;
  countryCode1: string;
  mobileNumber1: string;
  faxCountry1: string;
  faxNo: string;
};

export type GetAllLotsData = {
  refSeqNo_EventStock?: number;
  refBuyerID_EntityMas?: number;
  STATUS?: string;
  Max_bid_value?: number | null;
  Max_lot_value?: number | null;
  EvtStkExtendedTime?: number;
  SuggesetedMinBid?: number;
  isImageExist: boolean;
  Cut?: string;
  Comment?: string;
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  stockNo: string;
  cts: number;
  pcs: number;
  rate: number;
  totAmt: number;
  stockDesc: string;
  Size: string;
  Shape: string;
  Colour: string;
  Clarity: string;
  EventType: string;
  startDate: string;
  EndDate: string;
  bid_value: number;
  lot_value: number;
  refEventTypeID_EventTypeMas: number;
  SalesType: string;
  LotStatus: string;
  MinesName: string;
  MineID: number;
};

export type GetAllLotsResponse = GenericResponse & {
  data: GetAllLotsData[];
};

export type GetAllLotsParams = {
  eventId: number;
  entityId: string;
  mineId: number;
};

export type LotDetail = {
  seqNoEventStock: number;
  bidValue: number;
  lotValue: number;
};

export type AddBidderLotsParams = {
  eventId: number;
  entityId: number;
  bidDetails: LotDetail[];
};

export type AddAllLotsResponse = GenericResponse & {
  data: string;
};

export type DeleteAllLotsParams = {
  eventId: number;
  entityId: number;
  stockNos: number[];
};

export type GetAllLotsTotalLotsParams = {
  eventId: number;
  eventCategory: number;
  entityId: string;
};

export type GetAllLotsTotalLotsData = {
  startDate: string;
  EndDate: string;
  tenderenddate: string;
  auctionstartdate: string;
  EventType: string;
  Bcount: number;
  co_logo: string;
  ShowSellerLogo: string;
  ISAuction: string;
  ISTender: string;
  Tender_Suubmitted_Bids: number;
  Auction_Winning_BIds: number;
  IsDecalareResult: boolean;
};

export type GetAllLotsTotalLotsResponse = GenericResponse & {
  data: GetAllLotsTotalLotsData[];
};

export type GetWinnerAllLotsDetailsParams = {
  eventId: number;
  entityId: number;
  entityTypeId: number;
};

export type GetBidderLotsParams = {
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
};

export type GetWinnerAllLotsDetailsResponse = GenericResponse & {
  data: {
    data: Array<
      Array<
        | { data1?: boolean }
        | { data2?: number }
        | {
            stockNo: string;
            Size: string;
            stockDesc: string;
            pcs: number;
            cts: number;
            Shape: string;
            Clarity: string;
            Comment: string;
            Colour: string;
            tenderresult: string;
            tenderresultVal: string;
          }
        | { ShowResultsToBidder?: string }
        | {
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
          }
      >
    >;
  };
};

export type GetExcelExportParams = {
  eventId: number;
  entityId: number;
  eventCategory: string;
};

export type SendMailResponse = GenericResponse & {
  data: string;
};

export type GetPopupAuctionRoomData = {
  TotalAuctionLots: number;
  startDate: string;
  EndDate: string;
  auctionstartdate: string;
  tenderenddate: string;
  AuctionTitle: string;
  AuctionMsg: string;
  AuctionNavigatePage: string;
  IsValid: string;
};

export type GetAuctionRoomResponse = GenericResponse & {
  data: GetPopupAuctionRoomData[];
};

export type UpdateBidderPopupStatusResponse = GenericResponse & {
  data: string;
};
