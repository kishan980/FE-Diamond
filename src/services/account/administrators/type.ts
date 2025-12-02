import { GenericResponse } from 'types/api/ApiGenericResponse';

export type AdministratorsData = {
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
  IsMultiVendor: Boolean;
  IsAccessArchives: Boolean;
};

export type AdministratorsListResponse = GenericResponse & {
  data: AdministratorsData[];
};

export type AdministratorsByIdData = {
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
  InsTerminal: string | null;
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

export type AdministratorsByIdResponse = GenericResponse & {
  data: AdministratorsByIdData;
};

export type CheckUserNameResponse = GenericResponse & {
  data: string;
};

export type AddAdministratorParams = {
  username: string;
  countryCode: string;
  password: string;
  email: string;
  contactPerson: string;
  phoneNumber: string;
  archive: boolean;
  parameters: boolean;
  downloadFiles: boolean;
  accessPassword: boolean;
  terminal?: string;
};
export type UpdateAdministratorParams = AddAdministratorParams & {
  id: number;
};

export type AdministratorsAddResponse = GenericResponse & {
  data: string;
};

export type AdministratorsUpdateResponse = GenericResponse & {
  data: string;
};
