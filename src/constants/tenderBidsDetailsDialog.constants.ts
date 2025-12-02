import { GetTenderHistoryData, LotsData } from 'services/archives/pastEvents/types';

// Type Guard for LotsData
export const isLotsData = (item: any): item is LotsData => {
  return item && typeof item.co_name === 'string' && 'startDate' in item && 'stockNo' in item;
};

// Lot Columns Configuration for Category 1 (Rough)
export const LOT_COLUMNS_CATEGORY_1 = [
  { header: 'Lot No', accessor: (data: LotsData) => data.SeqNo },
  { header: 'Selling Company', accessor: (data: LotsData) => data.co_name },
  { header: 'Size Range', accessor: (data: LotsData) => data.Size },
  { header: 'Weight (Carats)', accessor: (data: LotsData) => Number(data.cts).toFixed(2) },
  { header: 'Stone Count', accessor: (data: LotsData) => data.pcs },
  { header: 'Reserve Price (US$)', accessor: (data: LotsData) => Number(data.rate).toFixed(3), minWidth: 110 },
];

// Lot Columns Configuration for Category 2 (Polished)
export const LOT_COLUMNS_CATEGORY_2 = [
  { header: 'Lot No', accessor: (data: LotsData) => data.SeqNo },
  { header: 'Selling Company', accessor: (data: LotsData) => data.co_name },
  { header: 'Shape', accessor: (data: LotsData) => data.Shape },
  { header: 'Clarity', accessor: (data: LotsData) => data.Clarity },
  { header: 'Weight (Carats)', accessor: (data: LotsData) => Number(data.cts).toFixed(2) },
  { header: 'Colour', accessor: (data: LotsData) => data.Colour },
  { header: 'Stone Count', accessor: (data: LotsData) => data.pcs },
  { header: 'Reserve Price (US$)', accessor: (data: LotsData) => Number(data.rate).toFixed(3), minWidth: 110 },
];

// Bidding Columns Configuration
export const BIDDING_COLUMNS = [
  { header: 'Rank', accessor: (data: GetTenderHistoryData) => data.ranks },
  { header: 'Bidding Company', accessor: (data: GetTenderHistoryData) => data.co_name },
  { header: "Bidder's Name", accessor: (data: GetTenderHistoryData) => data.contactPerson },
  { header: 'Bid Amount (US$)', accessor: (data: GetTenderHistoryData) => Number(data.bid_value).toFixed(2), minWidth: 110 },
  { header: 'Winning Bid (US$)', accessor: (data: GetTenderHistoryData) => data.winningbid, minWidth: 100 },
  { header: 'Value Sold (US$)', accessor: (data: GetTenderHistoryData) => data.winningparcel, minWidth: 110 },
];
