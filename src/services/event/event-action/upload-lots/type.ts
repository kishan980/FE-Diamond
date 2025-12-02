import { GenericResponse } from 'types/api/ApiGenericResponse';

export type UploadLotsByIdData = {
  PK_NO: string;
  stockNo: string;
  SeqNo: number;
  cts: number;
  rate: number;
  pcs: number;
  InsTerminal: string;
  InsTimeStamp: string;
  InsUserID: string;
  stockDesc: string;
  Size: string;
  Rfor: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  Cut: string;
  Shape: string;
  Colour: string;
  Clarity: string;
  Comment: string;
  TotalAmt: number;
  refEventTypeID_EventTypeMas: number;
  SellerID: number;
  MineID: number;
  SalesType: string;
  isImageExist: boolean;
  isLotExist: boolean;
};

export type UploadLotsByIdResponse = GenericResponse & {
  data: UploadLotsByIdData;
};

export type AddUploadLotsParams = {
  file: File;
  sellerId: number;
  mineId: number;
  eventId: number;
  type: string;
};

export type AddSaveLotsParams = {
  eventId: number;
  lotsData: string;
  type: string;
};

export type AddUploadLotsResponse = GenericResponse & {
  data: string;
};

export type DeleteUploadLotsParams = {
  eventId: number;
  stockNo: string[];
};

export type ImportUploadLotsResponse = GenericResponse & {
  data: string;
};

export type UploadLotsData = {
  stockNo: string;
  cts: number;
  pcs: number;
  rate: number;
  Shape: string;
  Clarity: string;
  Colour: string;
  Cut: string;
  Comment: string;
  stockDesc: string;
  Size: string;
  SellerID: number;
  MineID: number;
  refEventTypeID_EventTypeMas: number;
  isImageExist: boolean;
  isLotExist: boolean;
};

export type UploadAdditionalLotsByIdData = {
  PK_NO: string;
  stockNo: string;
  SeqNo: number;
  cts: number;
  rate: number;
  pcs: number;
  InsTerminal: string;
  InsTimeStamp: string;
  InsUserID: string;
  stockDesc: string;
  Size: string;
  Rfor: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  Cut: string;
  Shape: string;
  Colour: string;
  Clarity: string;
  Comment: string;
  UpdTerminal: number;
  TransferFlag: number;
  refEventTypeID_EventTypeMas: number;
  SellerID: number;
  MineID: number;
  SalesType: string;
};

export type UploadAdditionalLotsByIdResponse = GenericResponse & {
  data: UploadAdditionalLotsByIdData;
};

export type TransfterToOngoingEventResponse = GenericResponse & {
  data: string;
};

export type AddUploadAdditionalLotsParams = {
  eventId: number;
  sellerId: number;
  mineId: number;
  file: File;
  type: string;
};

export type AddUploadAdditionalLotsResponse = GenericResponse & {
  data: string;
};

export type AddSaveAdditionalLotsParams = {
  eventId: number;
  lotsData: string;
  type: string;
};

export type UploadAdditionalLotsData = {
  stockNo: string;
  cts: number;
  pcs: number;
  rate: number;
  Shape: string;
  Clarity: string;
  Colour: string;
  Cut: string;
  Comment: string;
  stockDesc: string;
  Size: string;
  SellerID: number;
  MineID: number;
  TransferFlag: string;
  refEventTypeID_EventTypeMas: number;
};

export type AddSaveAdditionalLotsResponse = GenericResponse & {
  data: string;
};

export type DeleteLotsParams = {
  eventId: number;
  lotNumbers: string[];
};

export type DeleteOngoingEventLotsResponse = GenericResponse & {
  data: string;
};

export type UpdateGetStockDetailsForExportParams = {
  eventId: number;
  eventCategory: string;
};

export type AddUploadStockDetailsParams = {
  eventId: number;
  seqNo: number;
  file: File;
};

export type ImportUploadStockDetailsResponse = GenericResponse & {
  data: string;
};

export type DeleteImageResponse = GenericResponse & {
  data: string;
};

export type UploadImagesParams = {
  file: File[];
  eventId: number;
  lotNo: string;
  uploadType: 'main' | 'sub' | 'highRes' | 'lowRes';
};

export type uploadImagesData = {
  fileId: string;
  filePath: string;
  fileType: string;
  height: number;
  name: string;
  thumbnailUrl: string;
  url: string;
  width: number;
};

export type UploadImagesResponse = GenericResponse & {
  data: uploadImagesData;
};

export type FetchLotsImage = {
  fileId: string;
  fileType: string;
  url: string;
  thumbnail: string;
};

export type FetchImagesResponse = GenericResponse & {
  data: FetchLotsImage[];
};
