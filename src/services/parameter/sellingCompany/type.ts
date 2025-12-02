import { GenericResponse } from 'types/api/ApiGenericResponse';
import { CustomFile } from 'types/dropzone';

export type SellingData = {
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
  Type: string;
  reqdocs: string;
  emailid2: string;
  contact2: string;
  contactPerson2: string;
  address: string;
  Faxno: string;
  co_zip: string;
  notes: string;
  IsMultiVendor: boolean;
  IsAccessArchives: boolean;
};

export type SellingListResponse = GenericResponse & {
  data: SellingData[];
};

export type AddSellingParams = {
  website: string;
  companyName: string;
  add1: string;
  add2: string;
  postCode: string;
  city: string;
  country: string;
  countryCode: string;
  phoneNo: string;
  faxNo: string;
  terminal: string;
  multiVendor: boolean;
  companyLogo: string;
};

export type AddSellingResponse = GenericResponse & {
  data: string;
};

export type SellingCompanyValuesType = {
  website: string;
  companyName: string;
  add1: string;
  add2: string;
  postCode: string;
  city: string;
  country: string;
  countryCode: string;
  phoneNo: string;
  faxNo: string;
  terminal: string;
  multiVendor: boolean;
  companyLogo: string | CustomFile[];
};

export type SellingByIdData = {
  entityID: number;
  refEntityTypeID_EntityTypeMas: number;
  co_name: string;
  co_add1: string;
  co_add2: string;
  co_city: string;
  co_state: string;
  co_country: string;
  co_zip: string;
  co_logo: string;
  co_website: string;
  co_vatno: string;
  contactPerson: string;
  user_name: string;
  emailID1: string;
  emailID2: string;
  phoneCountry1: string;
  phoneno1: string;
  phoneCountry2: string;
  phoneno2: string;
  mobileCountry1: string;
  mobileno1: string;
  mobileCountry2: string;
  mobileno2: string;
  faxCountry1: string;
  faxno1: string;
  faxCountry2: string;
  faxno2: string;
  isActive: number;
  isLocked: false;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  EntityTypeID: number;
  EntityType: string;
  Termscondition: string;
  Password: string;
  contactPerson2: string;
  notes: string;
  Accountcode: string;
  IsAccessArchives: false;
  IsDownloadAccess: false;
  IsParameterAccess: false;
  IsPassword: false;
  IsMultiVendor: boolean;
};

export type UpdateSellingParams = AddSellingParams & {
  id: number;
};

export type UpdateSellingResponse = GenericResponse & {
  data: string;
};

export type SellingByIdResponse = GenericResponse & {
  data: SellingByIdData;
};

export type SellingStatusByIdResponse = GenericResponse & {
  data: string;
};

export type SellerUploadImagesParams = {
  file: File;
  oldFile?: string | null;
};

export type SellerUploadImagesResponse = GenericResponse & {
  data: string;
};
