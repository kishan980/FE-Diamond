import { GenericResponse } from 'types/api/ApiGenericResponse';

export type TermsAndConditionData = {
  SeqNo: number;
  Title: string;
  Description: string;
};

export type TermsAndConditionResponse = GenericResponse & {
  data: TermsAndConditionData[];
};

export type AddTermsAndConditionParams = {
  title: string;
  termsConditionDoc: string;
  terminal: string;
};

export type AddTermsAndConditionResponse = GenericResponse & {
  data: string;
};

export type TermsAndConditionByIdData = {
  SeqNo: number;
  Title: string;
  Description: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string | null;
  UpdTimeStamp: string | null;
  UpdTerminal: string | null;
};

export type TermsAndConditionByIdResponse = GenericResponse & {
  data: TermsAndConditionByIdData;
};

export type UpdateTermsAndConditionParams = AddTermsAndConditionParams & {
  id: number;
};

export type UpdateTermsAndConditionResponse = GenericResponse & {
  data: string;
};

export type GetTermsAndConditionParams = {
  eventId: number;
  entityId: string;
};

export type TermConditionItem = {
  refEvtId_AuTenEvent: number;
  SeqNo: number;
  TermsCondition: string;
  Amendment: string | null;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string | null;
  UpdTimeStamp: string | null;
  UpdTerminal: string | null;
};

export type TermConditionAgreementItem = {
  refEvtId_AuTenEvent: number;
  refSeqNo_TermsCondition: number;
  SeqNo: number;
  refBuyerID_EntityMas: number;
  AgreementStatus: 'Accept' | 'Reject' | string; // extend with other statuses if any
  statusDate: string;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string | null;
  UpdTimeStamp: string | null;
  UpdTerminal: string | null;
};

export type GetTermsAndConditionData = {
  termConditionData: TermConditionItem[][];
  termConditionAgreementData: TermConditionAgreementItem[];
};

export type GetTermsAndConditionResponse = GenericResponse & {
  data: GetTermsAndConditionData;
};

export type UpdateStatusTermsConditionParams = {
  eventId: number;
  entityId: number;
  termsConditionId: number;
  agreementStatus: string;
  insUserId: number;
};

export type UpdateStatusTermsConditionResponse = GenericResponse & {
  data: string;
};

export type TermsConditionUploadImagesParams = {
  file: File;
  oldFile?: string | null;
};

export type TermsConditionUploadImagesResponse = GenericResponse & {
  data: string;
};

export type RevisedTermsAndConditionParams = {
  eventId: number;
  fileName: string;
};

export type RevisedTermsConditionResponse = GenericResponse & {
  data: string;
};

export type AddRevisedTermsAndConditionParams = {
  termsConditionDoc: string;
};

export type RevisedTermsAndConditionData = {
  SeqNo: number;
  refEvtId_AuTenEvent: number;
  TermsCondition: string;
  Amendment: string;
};

export type RevisedTermsAndConditionResponse = GenericResponse & {
  data: RevisedTermsAndConditionData;
};
