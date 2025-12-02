'use client';
import SelectDropDown from 'components/UIComponent/SelectDropDown/SelectDropDown';
import { GenericFilterProps } from 'types/selectDropDown';

const GenericFilter = <T extends { [key: string]: string | number }>({
  filterdata,
  valueKey,
  labelKey,
  selectedEventId,
  handleSelectEvent,
}: GenericFilterProps<T>) => (
  <SelectDropDown
    size="small"
    value={selectedEventId}
    options={[
      { value: 0, label: 'All' },
      ...filterdata.map((item) => ({
        value: item[valueKey],
        label: item[labelKey]?.toString(),
      })),
    ]}
    onChange={(value) => handleSelectEvent?.(Number(value))}
  />
);

export default GenericFilter;
