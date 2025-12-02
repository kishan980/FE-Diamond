export const updatePriceAndTotal = (
  cts: number,
  price: string,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  seqNo: number,
  delta: number
) => {
  const newPrice = Math.max(parseFloat(price || '0') + delta, 0).toFixed(3);
  const newTotal = (cts * parseFloat(newPrice)).toFixed(3);
  setFieldValue(`${seqNo}.price`, newPrice);
  setFieldValue(`${seqNo}.total`, newTotal);
};

export const updateTotalAndPrice = (
  cts: number,
  total: string,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  seqNo: number,
  delta: number
) => {
  const newTotal = Math.max(parseFloat(total || '0') + delta, 0).toFixed(3);
  const newPrice = (parseFloat(newTotal) / cts).toFixed(3);
  setFieldValue(`${seqNo}.total`, newTotal);
  setFieldValue(`${seqNo}.price`, newPrice);
};
