import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Filter, SelectColumnData } from 'services/archives/customisedReports/types';

export interface FilterFormProps {
  title: string;
  columns: SelectColumnData[];
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  selectFilterData: SelectColumnData[];
}

export interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
}
