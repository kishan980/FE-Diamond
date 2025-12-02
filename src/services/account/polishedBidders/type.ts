import { GenericResponse } from 'types/api/ApiGenericResponse';

export type PolishedbiddersData = {
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

export type PolishedbiddersListResponse = GenericResponse & {
  data: PolishedbiddersData[];
};

export type AddPolishedBiddersParams = {
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
export type UpdatePolishedBiddersParams = AddPolishedBiddersParams & {
  id: number;
};
export type PolishedBiddersAddResponse = GenericResponse & {
  data: string;
};

export type PolishedBiddersUpdateResponse = GenericResponse & {
  data: string;
};

export type PolishedbiddersStatusByIdResponse = GenericResponse & {
  data: string;
};

export type PolishedBiddersExcelList = {
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

export type PolishedBiddersExcelResponse = GenericResponse & {
  data: PolishedBiddersExcelList[];
};

export type PolishedBiddersDocumentList = {
  seqno: number;
  doctitle: string;
  docDescription: string;
  applicabledate: string;
  isCompulsory: string;
  filetypes: string;
  maxSize: string;
};

export type PolishedBiddersDocumentListResponse = GenericResponse & {
  data: PolishedBiddersDocumentList[];
};

export type PolishedBiddersUploadImagesParams = {
  file: File;
  oldFile: string | null;
  docId: number;
};

export type PolishedBiddersUploadImagesResponse = GenericResponse & {
  data: string;
};

export type PolishedBiddersUploadPayload = {
  url: string;
};
