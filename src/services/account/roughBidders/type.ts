import { GenericResponse } from 'types/api/ApiGenericResponse';

export type RoughbiddersData = {
  seqno: number;
  ContactPerson: string;
  co_city: string;
  co_country: string;
  phonecountry1: string;
  phoneno1: string;
  telephone: string;
  entityID: number;
  user_name: string;
  EntityType: string;
  emailID1: string;
  emailID2: string;
  co_name: string;
  co_website: string;
  mobileCountry1: string;
  mobileno1: string;
  contact: string;
  isActive: string;
  ActiveID: number;
  reqdocs: string;
};

export type RoughbiddersListResponse = GenericResponse & {
  data: RoughbiddersData[];
};

export type RoughBiddersDocumentList = {
  seqno: number;
  doctitle: string;
  docDescription: string;
  applicabledate: string;
  isCompulsory: string;
  filetypes: string;
  maxSize: string;
};

export type RoughBiddersDocumentListResponse = GenericResponse & {
  data: RoughBiddersDocumentList[];
};

export type AutogenerateUserNameResponse = GenericResponse & {
  data: string;
};

export type UploadedFile = {
  id: number;
  title: string;
  file: File;
};

export type AddRoughbiddersParams = {
  companyName: string;
  address: string;
  address1: string;
  city: string;
  country: string;
  postCode: string;
  website: string;
  contactPerson: string;
  contactPerson1: string;
  username: string;
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
  isActive: number;
  terminal?: string;
  password: string;
  notes: string;
  accountCode: string;
  docDetails?: string;
};

export type CheckUserNameResponse = GenericResponse & {
  data: string;
};

export type UpdateRoughbiddersParams = AddRoughbiddersParams & {
  id: number;
};

export type RoughbiddersAddResponse = GenericResponse & {
  data: string;
};

export type RoughbiddersUpdateResponse = GenericResponse & {
  data: string;
};

export type RoughbiddersStatusByIdResponse = GenericResponse & {
  data: string;
};

export type RoughbiddersExcelList = {
  seqno: number;
  ContactPerson: string;
  co_city: string;
  co_country: string;
  phonecountry1: string;
  phoneno1: string;
  telephone: string;
  entityID: number;
  user_name: string;
  EntityType: string;
  emailID1: string;
  co_name: string;
  co_website: string;
  mobileCountry1: string;
  mobileno1: string;
  contact: string;
  IsActive: string;
  ActiveID: number;
  Type: string;
  reqdocs: string;
  emailid2: string;
  contact2: string;
  contactPerson2: string;
  address: string;
  Faxno: string;
  co_zip: string;
  notes: string;
  CreationDate: string;
  AccountCode: string;
};

export type RoughbiddersExcelResponse = GenericResponse & {
  data: RoughbiddersExcelList[];
};

export type DocumentEntityWiseData = {
  SeqNo: string;
  refSeqNo_DocTypeCheckList: number;
  EntityType: number;
  EventCategory: number;
  refEntityID_EntityMas: number;
  Docname: string;
  Remark: string | null;
  DocPath: string | null;
  Uploaded_Date: string | null;
  VerifyStatus: string | null;
  VerifyDate: string | null;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string | null;
  UpdTimeStamp: string | null;
  UpdTerminal: string | null;
};

export type ImportRoughBiddersResponse = GenericResponse & {
  data: string;
};
export type DocumentListResponse = GenericResponse & {
  data: DocumentEntityWiseData[];
};

export type DocumentListEntityResponse = GenericResponse & {
  data: string;
};

export type UploadDocsRoughbiddersParams = {
  id: number;
  docId: number;
  document: string;
  docname: string;
  refSeqNo_Doc: number;
};

export type UpdateUploadDocsRoughbiddersParams = UploadDocsRoughbiddersParams & {
  id: number;
  docId: number;
  document: string;
  docname: string;
  refSeqNo_Doc: number;
};

export type RoughbiddersUpdateUploadDocsResponse = GenericResponse & {
  data: string;
};

export type RoughbiddersUploadImagesParams = {
  file: File;
  oldFile: string | null;
  docId: number;
};

export type RoughbiddersUploadImagesResponse = GenericResponse & {
  data: string;
};

export type RoughbiddersUploadPayload = {
  url: string;
};
