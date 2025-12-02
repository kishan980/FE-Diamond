import { GenericResponse } from 'types/api/ApiGenericResponse';

export type GetSubmittedBidsParams = {
  eventId: number;
  entityId: string;
  mineId: number;
};

export type GetSubmittedBidsData = {
  refSeqNo_EventStock: number;
  refBuyerID_EntityMas: number;
  STATUS: string;
  isImageExist: boolean;
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

export type GetSubmittedBidsResponse = GenericResponse & {
  data: GetSubmittedBidsData[];
};

export type SendMailResponse = GenericResponse & {
  data: string;
};
