import { GenericResponse } from 'types/api/ApiGenericResponse';

export type ViewersData = {
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
  IsMultiVendor: string;
  IsAccessArchives: false;
};

export type ViewersListResponse = GenericResponse & {
  data: ViewersData[];
};

export type ViewersStatusByIdResponse = GenericResponse & {
  data: string;
};

export type ViewersByIdData = {
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
  isLocked: Boolean;
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
  IsAccessArchives: Boolean;
  IsDownloadAccess: Boolean;
  IsParameterAccess: Boolean;
  IsPassword: Boolean;
  IsMultiVendor: Boolean;
};

export type ViewersByIdResponse = GenericResponse & {
  data: ViewersByIdData;
};

export type AddViewersParams = {
  username: string;
  password: string;
  contactPerson: string;
  email: string;
  mobileNumber: string;
  mobCountryCode: string;
  companyName: string;
  address: string;
  address1: string;
  postCode: string;
  city: string;
  country: string;
  telCountry: string;
  telephoneNumber: string;
  faxCountry1: string;
  faxNo: string;
  website: string;
};

export type UpdateViewersParams = AddViewersParams & {
  id: number;
};

export type ViewersAddResponse = GenericResponse & {
  data: string;
};

export type ViewersUpdateResponse = GenericResponse & {
  data: string;
};
