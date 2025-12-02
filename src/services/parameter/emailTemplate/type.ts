import { GenericResponse } from 'types/api/ApiGenericResponse';

export type EmailTemplateData = {
  SeqNo: number;
  refSeqNo_EmailSetting: number;
  EmailTempTitle: string;
  EmailSubject: string;
  EmailBody: string;
  EmailSignature: string | null;
  IsActive: string | null;
  InsUserID: string | null;
  InsDate: string | null;
  InsNode: string | null;
  UpdUserID: string | null;
  UpdDate: string | null;
  UpdNode: string | null;
};

export type EmailTemplateListResponse = GenericResponse & {
  data: EmailTemplateData[];
};

export type AddEmailTemplateParams = {
  emailBody: string;
  emailSubject: string;
};

export type AddEmailTemplateResponse = GenericResponse & {
  data: string;
};

export type EmailTemplateByIdData = {
  SeqNo: number;
  refSeqNo_EmailSetting: number;
  EmailTempTitle: string;
  EmailSubject: string;
  EmailBody: string;
  EmailSignature: string;
  IsActive: boolean;
  InsUserID: string;
  InsDate: string;
  InsNode: string;
  UpdUserID: string;
  UpdDate: string;
  UpdNode: string;
};

export type EmailTemplateByIdResponse = GenericResponse & {
  data: EmailTemplateByIdData;
};

export type UpdateEmailTemplateParams = AddEmailTemplateParams & {
  id: number;
};

export type UpdateEmailTemplateResponse = GenericResponse & {
  data: string;
};
