import { GenericResponse } from 'types/api/ApiGenericResponse';

export type SelectParticipantsData = {
  EntityID: number;
  emailID2: string;
  CompanyName: string;
  EntityType: string;
  Country: string;
  ContactPerson: string;
  EmailID: string;
  Contact: string;
  UserName: string;
  st: number;
  bidcount: number;
  IsActive: boolean;
  IsAttended: boolean;
  contactPerson2: string;
  totalinvited: number;
  totalparticipate: number;
  totalbidplaced: number;
  totalwon: number;
  totalwoncarat: number;
  totalwoncaratprice: number;
  topHighBid: number;
  TotalEventsAttended: number;
  LastBidDate: string;
  LastPurchaseDate: string;
};

export type SelectParticipantsByIdResponse = GenericResponse & {
  data: SelectParticipantsData[];
};

export type UpdateInvitedSelectParticipantsParams = {
  id: number;
  seqNOList: string;
  act: number;
};

export type InvitedSelectParticipantsUpdateResponse = GenericResponse & {
  data: string;
};
