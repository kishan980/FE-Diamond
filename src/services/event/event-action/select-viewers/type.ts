import { GenericResponse } from 'types/api/ApiGenericResponse';

export type SelectViewerData = {
  EntityID: number;
  CompanyName: string;
  Country: string;
  ContactPerson: string;
  EmailID: string;
  Contact: string;
  UserName: string;
  st: number;
  isLocked: boolean;
};

export type SelectViewersListResponse = GenericResponse & {
  data: SelectViewerData[];
};

export type UpdateViewerParams = {
  id: number;
  seqNOList: string;
  act: number;
};

export type ViewerUpdateResponse = GenericResponse & {
  data: string;
};
