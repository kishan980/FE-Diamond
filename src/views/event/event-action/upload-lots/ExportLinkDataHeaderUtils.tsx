export const exportUploadLotsToCSVLink = (eventCatagoryId: number) => {
  let str = '';

  if (eventCatagoryId === 1) {
    str = 'Lot No,Size,Lot Description,Seller,Mine,Stone Count,Weight(Carats),Reserve Price(US$ct.),Type of Sale\r\n';
  } else {
    str = 'Lot No,Shape,Carats,Color,Clarity,Cut,Stone Count,Comment,Reserve Price(US$ct.),Type of Sale\r\n';
  }

  return str;
};
