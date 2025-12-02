export const calculateTotal = (cts: number, price: string): string => {
  const priceValue = parseFloat(price);
  return isNaN(priceValue) ? '' : (cts * priceValue).toFixed(3);
};

export const calculatePrice = (cts: number, total: string): string => {
  const totalValue = parseFloat(total);
  return isNaN(totalValue) || cts === 0 ? '' : (totalValue / cts).toFixed(3);
};
