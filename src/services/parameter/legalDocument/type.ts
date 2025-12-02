import { GenericResponse } from 'types/api/ApiGenericResponse';

export type AddLegalDocumentParams = {
  title: string;
  eventCategoryId: number;
  docDescription: string;
  terminal: string;
};

export type AddLegalDocumentData = {
  id: number;
};

export type AddLegalDocumentResponse = GenericResponse & {
  data: AddLegalDocumentData;
};

export type LegalDocumentData = {
  SeqNo: number;
  refEntityTypeID_EntityTypeMas: string | null;
  DocTitle: string;
  EventCategory: string;
  docDescription: string;
  applicableDate: string | null;
  isCompulsory: string | null;
  filetypes: string | null;
  maxSize: string | null;
  IsActive: string | null;
  DocumentFor: string | null;
};

export type LegalDocumentListResponse = GenericResponse & {
  data: LegalDocumentData[];
};

export type LegalDocumentByIdData = {
  DocTitle: string;
  IsActive: string | null;
  SeqNo: number;
  applicableDate: string | null;
  docDescription: string;
  filetypes: string | null;
  isCompulsory: string | null;
  maxSize: string | null;
  refEntityTypeID_EntityTypeMas: string | null;
  refEventCategoryID_EventCategoryMas: number;
};
export type LegalDocumentByIdResponse = GenericResponse & {
  data: LegalDocumentByIdData;
};

export type UpdateLegalDocumentParams = AddLegalDocumentParams & {
  id: number;
};

export type UpdateLegalDocumentResponse = GenericResponse & {
  data: string;
};

export type LegalDocumentResponse = GenericResponse & {
  data: LegalDocumentData[];
};
