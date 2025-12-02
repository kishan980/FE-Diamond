import { GenericResponse } from 'types/api/ApiGenericResponse';

export type overallPurchaseLimitData = {
  upperText: string;
  explanationText: string;
};

export type OverallPurchaseLimitListResponse = GenericResponse & {
  data: overallPurchaseLimitData[];
};

export type UpdateOverallPurchaseLimitParams = overallPurchaseLimitData & {
  upperText: string;
  explanationText: string;
};

export type UpdateOverallPurchaseLimitResponse = GenericResponse & {
  data: string;
};
