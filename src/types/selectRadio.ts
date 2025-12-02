import { MultipleOptions } from 'components/UIComponent/type';

export interface RadioButtonsGroupProps {
  options: MultipleOptions[];
  defaultValue?: number | string | boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}
