import { KeyboardEvent } from 'react';
import { LotBidValues } from 'types/table';

export type InputRefs = Array<[HTMLInputElement | null, HTMLInputElement | null]>;

export const setInputRef = (refs: InputRefs, rowIndex: number, colIndex: number, element: HTMLInputElement | null) => {
  if (!refs[rowIndex]) refs[rowIndex] = [null, null];
  refs[rowIndex][colIndex] = element;
};

export const handleKeyNavigation = (
  e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  refs: InputRefs,
  rowIndex: number,
  colIndex: 0 | 1,
  handleSubmitForm: (values: LotBidValues) => void,
  values: Record<number, { price: string; total: string }>
) => {
  const moveFocus = (row: number, col: 0 | 1) => {
    e.preventDefault();
    refs[row]?.[col]?.focus();
  };

  switch (e.key) {
    case 'ArrowDown':
      if (refs[rowIndex + 1]?.[colIndex]) moveFocus(rowIndex + 1, colIndex);
      break;
    case 'ArrowUp':
      if (refs[rowIndex - 1]?.[colIndex]) moveFocus(rowIndex - 1, colIndex);
      break;
    case 'ArrowRight':
      if (colIndex === 0 && refs[rowIndex]?.[1]) moveFocus(rowIndex, 1);
      break;
    case 'ArrowLeft':
      if (colIndex === 1 && refs[rowIndex]?.[0]) moveFocus(rowIndex, 0);
      break;
    case 'Enter':
      if (colIndex === 1) {
        e.preventDefault();
        handleSubmitForm(values);
      }
      break;
  }
};

export const handleMultipleKeyNavigation = (
  e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  refs: InputRefs,
  rowIndex: number,
  colIndex: number
) => {
  const moveFocus = (row: number, col: number) => {
    e.preventDefault();
    const ref = refs[row]?.[col];
    if (ref && typeof ref.focus === 'function') {
      ref.focus();
    }
  };

  switch (e.key) {
    case 'ArrowDown':
      if (refs[rowIndex + 1]?.[colIndex]) moveFocus(rowIndex + 1, colIndex);
      break;
    case 'ArrowUp':
      if (refs[rowIndex - 1]?.[colIndex]) moveFocus(rowIndex - 1, colIndex);
      break;
    case 'ArrowRight':
      if (refs[rowIndex]?.[colIndex + 1]) moveFocus(rowIndex, colIndex + 1);
      break;
    case 'ArrowLeft':
      if (refs[rowIndex]?.[colIndex - 1]) moveFocus(rowIndex, colIndex - 1);
      break;
  }
};
