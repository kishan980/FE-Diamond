import { ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';
import { LotBidValues } from 'types/table';
import { calculatePrice, calculateTotal } from 'utils/bidUtils';

interface UseBidInputLogicProps<T> {
  data: T[];
  values: Record<number, { price: string; total: string }>;
  setValues: (values: LotBidValues) => void;
  editedRows?: Set<number>;
  setEditedRows?: Dispatch<SetStateAction<Set<number>>>;
  isClosed?: boolean;
}

export const useBidInputLogic = <T extends { SeqNo: number; cts?: number }>({
  data,
  values,
  setValues,
  editedRows,
  setEditedRows,
  isClosed = false,
}: UseBidInputLogicProps<T>) => {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number, field: 'price' | 'total') => {
      const { value } = e.target;
      const lot = data.find((item) => item.SeqNo === id);
      const cts = lot?.cts ?? 0;
      const currentValues = values[id] || { price: '', total: '' };
      let updatedPrice = currentValues.price;
      let updatedTotal = currentValues.total;

      if (field === 'price') {
        updatedPrice = value;
        updatedTotal = calculateTotal(cts, value);
      } else {
        updatedTotal = value;
        updatedPrice = calculatePrice(cts, value);
      }
      if (setEditedRows && editedRows) {
        setEditedRows((prev) => {
          const newSet = new Set(prev);
          newSet.add(id);
          return newSet;
        });
      }
      const updatedValues = { ...values, [id]: { price: updatedPrice, total: updatedTotal } };

      setValues(updatedValues);
    },
    [data, editedRows, setEditedRows, setValues, values]
  );

  const handleManualPriceChange = useCallback(
    (id: number, delta: number) => {
      if (isClosed) return;

      const current = parseFloat(values[id]?.price || '0');
      const updated = Math.max(0, current + delta);

      const fakeEvent = {
        target: {
          value: updated.toString(),
          name: `price-${id}`,
        },
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent, id, 'price');
    },
    [handleInputChange, values, isClosed]
  );

  return { handleInputChange, handleManualPriceChange };
};
