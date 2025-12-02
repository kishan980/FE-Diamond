import { FilterObject } from 'services/archives/customisedReports/types';

const mapFilterData = (filters: FilterObject[]): FilterObject[] => {
  return filters.map((filter) => ({
    dataColumns: {
      selectedIndex: filter.dataColumns.selectedIndex,
      selectedValue: filter.dataColumns.selectedValue,
    },
    dataFilter: {
      selectedIndex: filter.dataFilter.selectedIndex,
      selectedValue: filter.dataFilter.selectedValue,
    },
    operatorOrAnd: {
      selectedValue: filter.operatorOrAnd.selectedValue,
    },
    txtCondition: filter.txtCondition,
    dataType: filter.dataType || 'varchar',
    dataTypeList: filter.dataTypeList || 'typeList',
  }));
};

export default mapFilterData;
