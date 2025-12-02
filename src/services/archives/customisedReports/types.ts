import { GenericResponse } from 'types/api/ApiGenericResponse';

export type CustomisedReportsData = {
  SeqNo: number;
  ReportName: string;
  ColumnName: string;
  WhereClause: string;
  WhereClauseDtl: string;
  HeaderName: string;
  TopRecord: string;
  refEntityType_Typemas: number;
  InsUserID: string;
  InsTimeStamp: string;
  InsTerminal: string;
  UpdUserID: string;
  UpdTimeStamp: string;
  UpdTerminal: string;
  FromDate: string;
  ToDate: string;
  SellingCmpID: string;
  Description: string;
  BidderWhereClause: string;
  BidderWhereClausedtl: string;
  BiddingWhereClause: string;
  BiddingWhereClausedtl: string;
};

export type CustomisedReportsResponse = GenericResponse & {
  data: CustomisedReportsData[];
};

export type SelectColumnData = {
  COLUMN_NAME: string;
  DISPLAY_NAME: string;
  DATA_TYPE: string;
  DATA_TYPEList?: string;
  DATA_FOR?: string;
  OrdNo?: number;
};

export type SelectedColumnListResponse = GenericResponse & {
  data: SelectColumnData[];
};

export type FormValues = {
  tenderCategory: string | number;
  reportName: string;
  reportDescription: string;
  archivesFromDate: string | null;
  archivesToDate: string | null;
  sellingCompany: string;
  selectedColumns: string;
  definedFilters: string;
};

export type AddCustomisedReportsResponse = GenericResponse & {
  data: string;
};

export type SelectedColumnValue = {
  COLUMN_NAME: string;
  DISPLAY_NAME: string;
};

export type AllItems = SelectedColumnValue[];

export type SellingCompanyValue = {
  co_name: string;
  entityID: string;
};

export interface Filter {
  id: number;
  column: string;
  filterType: string;
  filterValue: string;
  logicalOperator: string;
}

export type FilterObject = {
  dataColumns: { selectedIndex: number; selectedValue: string };
  dataFilter: { selectedIndex: number; selectedValue: string };
  operatorOrAnd: { selectedValue: string };
  txtCondition: string;
  dataType: string;
  dataTypeList?: string;
};

export type DialogFilters = {
  bidderPerformanceData: FilterObject[];
  biddingPerformanceData: FilterObject[];
};

export type AddCustomisedReportsParams = {
  bidderPerformanceData: FilterObject[];
  biddingPerformanceData: FilterObject[];
  reportName: string;
  reportDescription: string;
  columnName: string;
  headerName: string;
  sellingCompanyId: string;
  refEntityType_Typemas: string;
  fromDate: string;
  toDate: string;
};

export type UpdateCustomisedReportsParams = {
  bidderPerformanceData: FilterObject[];
  biddingPerformanceData: FilterObject[];
  seqNo: number;
  reportName: string;
  reportDescription: string;
  columnName: string;
  headerName: string;
  sellingCompanyId: string;
  refEntityType_Typemas: string;
  fromDate: string;
  toDate: string;
};

export type UpdateCustomisedReportsResponse = GenericResponse & {
  data: string;
};

export type SelectedOperatorType =
  | 'Equal to'
  | 'Not equal to'
  | 'Less than'
  | 'Less than or equal to'
  | 'Greater than'
  | 'Greater than or equal to'
  | 'Like'
  | 'In'
  | 'Top'
  | 'Between';
