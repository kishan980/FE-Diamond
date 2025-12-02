import { GenericResponse } from 'types/api/ApiGenericResponse';

export type ManageAttendData = {
  EntityID: number;
  CompanyName: string;
  Country: string;
  ContactPerson: string;
  EmailID: string;
  Contact: string;
  UserName: string;
  st: number;
  bidcount: number;
  IsActive: boolean;
  IsAttended: boolean | null;
  contactPerson2: string;
};

export type ManageAttendDataListResponse = GenericResponse & {
  data: ManageAttendData[];
};

export type UpdateInvitedManageAttendeesParams = {
  id: number;
  seqNOList: string;
  act: number;
};

export type InvitedManageAttendeesUpdateResponse = GenericResponse & {
  data: string;
};
