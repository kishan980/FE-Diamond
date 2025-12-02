import { HeadCell } from 'types/table';

export const ADMINISTRATORS_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'seqno', numeric: true, disablePadding: false, label: 'No', sortable: true, fixedWith: '1%' },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'contact', numeric: false, disablePadding: false, label: 'Mobile Number', sortable: true },
  { id: 'emailID1', numeric: false, disablePadding: false, label: 'Email', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true },
];

export const ADMINISTRATORS_STATUS_HEAD_CELLS: HeadCell = {
  id: 'IsAccessArchives',
  numeric: false,
  disablePadding: false,
  label: 'Status',
  sortable: true,
  fixedWith: '1%',
};

export const DOCUMENT_TABLE_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'Docname', numeric: false, disablePadding: false, label: 'Document Type', sortable: true },
  { id: 'DocPath', numeric: false, disablePadding: false, label: 'Document Name', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const LEGAL_DOC_HEAD_CELLS: HeadCell[] = [
  { id: 'documentType', numeric: false, disablePadding: true, label: 'Document Type', sortable: true },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description', sortable: true },
  { id: 'upload', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true },
];

export const POLISHED_BIDDER_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'seqno', numeric: true, disablePadding: false, label: 'No', sortable: true, fixedWith: '1%' },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'co_country', numeric: false, disablePadding: false, label: 'Country', sortable: true },
  { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone', sortable: true },
  { id: 'emailID1', numeric: false, disablePadding: false, label: 'Email', sortable: true },
  { id: 'reqdocs', numeric: false, disablePadding: false, label: 'Pending Legal Documents', sortable: true, minWidth: 150 },
  { id: 'isActive', numeric: false, disablePadding: false, label: 'Bidder Status', sortable: true },
  {
    id: 'Options',
    numeric: false,
    disablePadding: false,
    label: 'Actions',
    sortable: false,
    isFixed: true,
    fixedWith: '1%',
  },
];

export const ROUGH_BIDDER_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'seqno', numeric: true, disablePadding: false, label: 'No', sortable: true, fixedWith: '1%' },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'co_country', numeric: false, disablePadding: false, label: 'Country', sortable: true },
  { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone', sortable: true },
  { id: 'emailID1', numeric: false, disablePadding: false, label: 'Email', sortable: true },
  { id: 'reqdocs', numeric: false, disablePadding: false, label: 'Pending Legal Documents', sortable: true, minWidth: 150 },
  { id: 'isActive', numeric: false, disablePadding: false, label: 'Bidder Status', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const ACCESS_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'CompanyName', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'Contact', numeric: false, disablePadding: false, label: 'Telephone', sortable: true },
  { id: 'EmailID', numeric: false, disablePadding: false, label: 'Email', sortable: true },
  { id: 'EntityType', numeric: false, disablePadding: false, label: 'Account Type', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const VIEWER_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'entityID', numeric: true, disablePadding: false, label: 'No', sortable: true, fixedWith: '1%' },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'co_country', numeric: false, disablePadding: false, label: 'Country', sortable: true },
  { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone', sortable: true },
  { id: 'emailID1', numeric: false, disablePadding: false, label: 'Email', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const BIDDERS_PERFORMANCE_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'totalinvited', numeric: true, disablePadding: false, label: 'Total Invitations Accepted', sortable: true, minWidth: 160 },
  { id: 'totalparticipate', numeric: true, disablePadding: false, label: 'Total Events Attended', sortable: true, minWidth: 130 },
  { id: 'TotalEventsAttended', numeric: true, disablePadding: false, label: 'Total Events Bidded', sortable: true, minWidth: 130 },
  { id: 'totalbidplaced', numeric: true, disablePadding: false, label: 'Total Bids Placed', sortable: true, minWidth: 110 },
  { id: 'topHighBid', numeric: true, disablePadding: false, label: 'Total Ranked First', sortable: true, minWidth: 130 },
  { id: 'totalwon', numeric: true, disablePadding: false, label: 'Total Lots Bought', sortable: true, minWidth: 120 },
  { id: 'totalwoncarat', numeric: true, disablePadding: false, label: 'Total Carats Bought', sortable: true, minWidth: 130 },
  { id: 'totalwoncaratprice', numeric: true, disablePadding: false, label: 'Total Value Bought (US$)', sortable: true, minWidth: 130 },
  { id: 'LastBidDate', numeric: false, disablePadding: false, label: 'Last Bid Placed Date', sortable: true, minWidth: 130 },
  { id: 'LastPurchaseDate', numeric: false, disablePadding: false, label: 'Last Purchase Date', sortable: true, minWidth: 140 },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const SELLING_COMPANY_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'seqno', numeric: true, disablePadding: false, label: 'No', sortable: true, fixedWith: '1%' },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'co_city', numeric: false, disablePadding: false, label: 'City', sortable: true },
  { id: 'co_country', numeric: false, disablePadding: false, label: 'Country', sortable: true },
  { id: 'phonecountry1', numeric: false, disablePadding: false, label: 'Telephone', sortable: true },
  { id: 'co_website', numeric: false, disablePadding: false, label: 'Company Website', sortable: true },
  { id: 'IsMultiVendor', numeric: false, disablePadding: false, label: 'Is MultiVendor', sortable: true },
  { id: 'IsActive', numeric: false, disablePadding: false, label: 'Is Alive?', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const SELECT_PARTICIPANT_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'CompanyName', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'totalinvited', numeric: true, disablePadding: false, label: 'Total Invitations Accepted', sortable: true, minWidth: 160 },
  { id: 'TotalEventsAttended', numeric: true, disablePadding: false, label: 'Total Events Attended', sortable: true, minWidth: 130 },
  { id: 'totalparticipate', numeric: true, disablePadding: false, label: 'Total Events Bidded', sortable: true, minWidth: 130 },
  { id: 'totalbidplaced', numeric: true, disablePadding: false, label: 'Total Bids Placed', sortable: true, minWidth: 120 },
  { id: 'topHighBid', numeric: true, disablePadding: false, label: 'Total Ranked First', sortable: true, minWidth: 130 },
  { id: 'totalwon', numeric: true, disablePadding: false, label: 'Total Lots Bought', sortable: true, minWidth: 120 },
  { id: 'totalwoncarat', numeric: true, disablePadding: false, label: 'Total Carats Bought', sortable: true, minWidth: 130 },
  { id: 'totalwoncaratprice', numeric: true, disablePadding: false, label: 'Total Value Bought (US$)', sortable: true, minWidth: 130 },
  { id: 'LastBidDate', numeric: false, disablePadding: false, label: 'Last Bid Placed', sortable: true },
  { id: 'LastPurchaseDate', numeric: false, disablePadding: false, label: 'Last Purchase', sortable: true },
  { id: 'st', numeric: false, disablePadding: false, label: 'Participation Confirmed?', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const MANAGE_ATTENDEES_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'CompanyName', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person 1', sortable: true, minWidth: 130 },
  { id: 'contactPerson2', numeric: false, disablePadding: false, label: 'Contact Person 2', sortable: true, minWidth: 130 },
  { id: 'bidcount', numeric: true, disablePadding: false, label: 'Bid Placed?', sortable: true },
  { id: 'IsActive', numeric: false, disablePadding: false, label: 'Login Enabled?', sortable: false, isFixed: true, fixedRight: 150 },
  { id: 'IsAttended', numeric: false, disablePadding: false, label: 'Attended?', sortable: false, isFixed: true, fixedWith: '1%' },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, fixedWith: '1%' },
];

export const PAST_EVENTS_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'auTen_EvtId', numeric: false, disablePadding: false, label: 'Event No', sortable: true },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Selling Company', sortable: true },
  { id: 'EventCatType', numeric: false, disablePadding: false, label: 'Event Type', sortable: true },
  { id: 'EndDate', numeric: false, disablePadding: false, label: 'End Date', sortable: true },
  { id: 'Attendance', numeric: true, disablePadding: false, label: 'Bidders Attendance', sortable: true },
  { id: 'Participant', numeric: true, disablePadding: false, label: 'Bidders Participation', sortable: true },
  { id: 'Totallots', numeric: true, disablePadding: false, label: 'Lots Tendered', sortable: true },
  { id: 'TotalCts', numeric: true, disablePadding: false, label: 'Carats Tendered', sortable: true },
  { id: 'lotssold', numeric: true, disablePadding: false, label: 'Lots Sold', sortable: true },
  { id: 'caratsold', numeric: true, disablePadding: false, label: 'Carats Sold', sortable: true },
  { id: 'valuesold', numeric: true, disablePadding: false, label: 'Value Sold', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true },
];

export const BIDDER_PERFORMANCE_POLISHED_HEAD_CELLS: HeadCell[] = [
  { id: 'SeqNo', numeric: false, disablePadding: false, sortable: false, label: 'Sr No' },
  { id: 'startDate', numeric: false, disablePadding: false, sortable: true, label: "Event's Date" },
  { id: 'co_name', numeric: false, disablePadding: false, sortable: true, label: 'Bidding Company' },
  { id: 'contactPerson', numeric: false, disablePadding: false, sortable: true, label: "Bidder's Name" },
  { id: 'scompnay', numeric: false, disablePadding: false, sortable: true, label: 'Selling Company' },
  { id: 'stockNo', numeric: false, disablePadding: false, sortable: true, label: 'Lot No' },
  { id: 'Shape', numeric: false, disablePadding: false, sortable: true, label: 'Shape' },
  { id: 'Colour', numeric: false, disablePadding: false, sortable: true, label: 'Color' },
  { id: 'Clarity', numeric: false, disablePadding: false, sortable: true, label: 'Clarity' },
  { id: 'pcs', numeric: false, disablePadding: false, sortable: true, label: 'Stone Count' },
  { id: 'rate', numeric: false, disablePadding: false, sortable: true, label: 'Reserve Price (US$/ct.)', minWidth: 130 },
  { id: 'cts', numeric: false, disablePadding: false, sortable: true, label: 'Weight (Carats)' },
  { id: 'bid_value', numeric: false, disablePadding: false, sortable: true, label: 'Bid Amount (US$)', minWidth: 130 },
  { id: 'ranks', numeric: false, disablePadding: false, sortable: true, label: 'Ranking' },
  { id: 'noofbidder', numeric: false, disablePadding: false, sortable: true, label: 'Bidders Number' },
  { id: 'pvale', numeric: false, disablePadding: false, sortable: true, label: 'Value Bought(US$)' },
];

export const BIDDER_PERFORMANCE_ROUGH_HEAD_CELLS: HeadCell[] = [
  { id: 'SeqNo', numeric: false, disablePadding: false, sortable: false, label: 'Sr No' },
  { id: 'startDate', numeric: false, disablePadding: false, sortable: true, label: "Event's Date" },
  { id: 'co_name', numeric: false, disablePadding: false, sortable: true, label: 'Bidding Company' },
  { id: 'contactPerson', numeric: false, disablePadding: false, sortable: true, label: "Bidder's Name" },
  { id: 'scompnay', numeric: false, disablePadding: false, sortable: true, label: 'Selling Company' },
  { id: 'stockNo', numeric: false, disablePadding: false, sortable: true, label: 'Lot No' },
  { id: 'Size', numeric: false, disablePadding: false, sortable: true, label: 'Size Range' },
  { id: 'stockDesc', numeric: false, disablePadding: false, sortable: true, label: 'Lot Description' },
  { id: 'pcs', numeric: false, disablePadding: false, sortable: true, label: 'Stone Count' },
  { id: 'rate', numeric: false, disablePadding: false, sortable: true, label: 'Reserve Price(US$)' },
  { id: 'cts', numeric: false, disablePadding: false, sortable: true, label: 'Weight(Carats)' },
  { id: 'bid_value', numeric: false, disablePadding: false, sortable: true, label: 'Bid Amount (US$)', minWidth: 120 },
  { id: 'ranks', numeric: false, disablePadding: false, sortable: true, label: 'Ranking' },
  { id: 'noofbidder', numeric: false, disablePadding: false, sortable: true, label: 'Bidders Number' },
  { id: 'pvale', numeric: false, disablePadding: false, sortable: true, label: 'Value Bought(US$)' },
];

export const CUSTOMISED_REPORT_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'ReportName', numeric: false, disablePadding: false, label: 'Report Name', sortable: true },
  { id: 'Description', numeric: false, disablePadding: false, label: 'Report Description', sortable: true },
  { id: 'FromDate', numeric: false, disablePadding: false, label: 'From (MM/YY)', sortable: true },
  { id: 'ToDate', numeric: false, disablePadding: false, label: 'To (MM/YY)', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const CANAL_WINNING_BID_POLISHED_HEAD_CELLS: HeadCell[] = [
  { id: 'SeqNo', numeric: false, disablePadding: false, label: 'Lot No' },
  { id: 'Shape', numeric: false, disablePadding: false, label: 'Shape' },
  { id: 'Colour', numeric: false, disablePadding: false, label: 'Color' },
  { id: 'Clarity', numeric: false, disablePadding: false, label: 'Clarity' },
  { id: 'pcs', numeric: false, disablePadding: false, label: 'Stone Count' },
  { id: 'cts', numeric: false, disablePadding: false, label: 'Weight (Carats)' },
  { id: 'rate', numeric: false, disablePadding: false, label: 'Reserve Price (US$)', minWidth: 150 },
  { id: 'varianceprice', numeric: false, disablePadding: false, label: 'Market Price (US$)', minWidth: 150 },
  { id: 'marketprice', numeric: false, disablePadding: false, label: 'Market / Reserve Price Variance', minWidth: 180 },
];

export const CANAL_WINNING_BID_ROUGH_HEAD_CELLS: HeadCell[] = [
  { id: 'SeqNo', numeric: false, disablePadding: false, label: 'Lot No' },
  { id: 'Size', numeric: false, disablePadding: false, label: 'Size Range' },
  { id: 'stockDesc', numeric: false, disablePadding: false, label: 'Lot Description' },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count' },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight (Carats)' },
  { id: 'rate', numeric: true, disablePadding: false, label: 'Reserve Price (US$)', minWidth: 150 },
  { id: 'varianceprice', numeric: true, disablePadding: false, label: 'Market Price (US$)', minWidth: 150 },
  { id: 'marketprice', numeric: true, disablePadding: false, label: 'Market / Reserve Price Variance', minWidth: 180 },
];

export const CONTACT_BIDDERS_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: false, disablePadding: true, label: 'Sr.No', fixedWith: '1%' },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name' },
  { id: 'contactPerson', numeric: false, disablePadding: false, label: 'Contact Person' },
  { id: 'PhoneNO', numeric: false, disablePadding: false, label: 'Telephone Number' },
  { id: 'Email', numeric: false, disablePadding: false, label: 'Email' },
];

export const EXPORT_EXCEL_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: false, disablePadding: true, label: 'Sr.No', fixedWith: '1%' },
  { id: 'No', numeric: false, disablePadding: false, label: 'Event No' },
  { id: 'CompanyName', numeric: false, disablePadding: false, label: 'Event Date' },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Selling Company' },
  { id: 'Contact', numeric: false, disablePadding: false, label: 'Event Type' },
];

export const TENDER_BIDS_ROUGH_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: false, disablePadding: false, label: 'Sr No', fixedWith: '1%', sortable: false },
  { id: 'SeqNo', numeric: false, disablePadding: false, label: 'Lot No', sortable: false },
  { id: 'Size', numeric: false, disablePadding: false, label: 'Size Range', sortable: true },
  { id: 'stockDesc', numeric: false, disablePadding: false, label: 'Lot Description', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight (Carats)', sortable: true },
  { id: 'rate', numeric: true, disablePadding: false, label: 'Reserve Price (US$/ct.)', sortable: true, minWidth: 180 },
  { id: 'NoOfBids', numeric: true, disablePadding: false, label: 'Bidders Number', sortable: true },
  { id: 'WinnerAmt', numeric: true, disablePadding: false, label: 'Winning Bid (US$)', sortable: true, minWidth: 130 },
  { id: 'lotsvalue', numeric: true, disablePadding: false, label: 'Value Sold (US$)', sortable: true, minWidth: 130 },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const TENDER_BIDS_POLISHED_HEAD_CELLS: HeadCell[] = [
  { id: 'SeqNo', numeric: false, disablePadding: false, label: 'Lot No', sortable: false },
  { id: 'Shape', numeric: false, disablePadding: false, label: 'Shape', sortable: true },
  { id: 'Colour', numeric: false, disablePadding: false, label: 'Color', sortable: true },
  { id: 'Clarity', numeric: false, disablePadding: false, label: 'Clarity', sortable: true },
  { id: 'pcs', numeric: false, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: false, disablePadding: false, label: 'Weight (Carats)', sortable: true },
  { id: 'rate', numeric: false, disablePadding: false, label: 'Reserve Price (US$/ct.)', sortable: true, minWidth: 130 },
  { id: 'NoOfBids', numeric: false, disablePadding: false, label: 'Bidders Number', sortable: true },
  { id: 'WinnerAmt', numeric: false, disablePadding: false, label: 'Winning Bid (US$)', sortable: true, minWidth: 120 },
  { id: 'lotsvalue', numeric: false, disablePadding: false, label: 'Value Sold (US$)', sortable: true, minWidth: 120 },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true },
];

export const TERMS_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'SeqNo', numeric: true, disablePadding: false, label: 'No', sortable: true, fixedWith: '1%' },
  { id: 'Title', numeric: false, disablePadding: false, label: 'Title', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const LEGAL_DOCUMENT_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'DocTitle', numeric: false, disablePadding: false, label: 'Document Title', sortable: true },
  { id: 'docDescription', numeric: false, disablePadding: false, label: 'Document Description', sortable: true },
  { id: 'EventCategory', numeric: false, disablePadding: false, label: 'Event Type', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const EMAIL_TEMPLATE_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'EmailSubject', numeric: false, disablePadding: false, label: 'Subject', sortable: true },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Actions', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const UPLOAD_LOTS_POLISHED_HEAD_CELLS: HeadCell[] = [
  { id: 'LotNo', numeric: false, disablePadding: false, label: 'Lot No', fixedWith: '1%' },
  { id: 'Shape', numeric: false, disablePadding: false, label: 'Shape' },
  { id: 'cts', numeric: false, disablePadding: false, label: 'Carats' },
  { id: 'Colour', numeric: false, disablePadding: false, label: 'Color' },
  { id: 'Clarity', numeric: false, disablePadding: false, label: 'Clarity' },
  { id: 'Cut', numeric: false, disablePadding: false, label: 'Cut' },
  { id: 'pcs', numeric: false, disablePadding: false, label: 'Stone Count' },
  { id: 'Comment', numeric: false, disablePadding: false, label: 'Comment' },
  { id: 'Rfor', numeric: false, disablePadding: false, label: 'Reserve Price (US$/ct.)', minWidth: 130 },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type of Sale', minWidth: 150 },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Image/Video', isFixed: true, fixedWith: '1%' },
];

export const UPLOAD_LOTS_ROUGH_HEAD_CELLS: HeadCell[] = [
  { id: 'LotNo', numeric: false, disablePadding: false, label: 'Lot No', fixedWith: '1%' },
  { id: 'Size', numeric: false, disablePadding: false, label: 'Size Range' },
  { id: 'stockDesc', numeric: false, disablePadding: false, label: 'Lot Desc' },
  { id: 'SellerID', numeric: false, disablePadding: false, label: 'Seller' },
  { id: 'MineID', numeric: false, disablePadding: false, label: 'Mine' },
  { id: 'pcs', numeric: false, disablePadding: false, label: 'Stone Count' },
  { id: 'cts', numeric: false, disablePadding: false, label: 'Weight (Carats)' },
  { id: 'reserve', numeric: false, disablePadding: false, label: 'Reserve Price (US$/ct.)', minWidth: 150 },
  { id: 'totAmt', numeric: false, disablePadding: false, label: 'Type of Sale', minWidth: 150 },
  { id: 'Options', numeric: false, disablePadding: false, label: 'Image/Video', isFixed: true, fixedWith: '1%' },
];

export const SELECT_VIEWER_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', sortable: false, fixedWith: '1%' },
  { id: 'CompanyName', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'ContactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'Contact', numeric: false, disablePadding: false, label: 'Telephone', sortable: true },
  { id: 'EmailID', numeric: false, disablePadding: false, label: 'Email', sortable: true },
  { id: 'st', numeric: false, disablePadding: false, label: 'Invited?', sortable: false, isFixed: true, fixedRight: 150, fixedWith: '1%' },
  { id: 'isLocked', numeric: false, disablePadding: false, label: 'Login Enabled?', sortable: false, isFixed: true, fixedWith: '1%' },
];

export const PRINTSHEET_POLISHED_HEAD_CELLS: HeadCell[] = [
  { id: 'stockNo', numeric: false, disablePadding: false, label: 'Lot Number', sortable: true, fixedWith: '1%' },
  { id: 'Shape', numeric: false, disablePadding: false, label: 'Shape', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight(Carats)', sortable: true },
  { id: 'MinesName', numeric: false, disablePadding: false, label: 'Mines', sortable: true },
  { id: 'PriceperCarats', numeric: false, disablePadding: false, label: 'Price per Carats(US$/ct.)', sortable: false },
  { id: 'TotalLotValue', numeric: false, disablePadding: false, label: 'Total Lot Value(US$)', sortable: false },
  { id: 'Options', numeric: false, disablePadding: true, label: 'Image/Video', sortable: false, fixedWith: '1%' },
];

export const PRINTSHEET_ROUGH_HEAD_CELLS: HeadCell[] = [
  { id: 'stockNo', numeric: false, disablePadding: false, label: 'Lot Number', sortable: true, fixedWith: '1%' },
  { id: 'Size', numeric: false, disablePadding: false, label: 'Size Range', sortable: true },
  { id: 'stockDesc', numeric: false, disablePadding: false, label: 'Lot Description', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight(Carats)', sortable: true },
  { id: 'MinesName', numeric: false, disablePadding: false, label: 'Mines', sortable: true },
  { id: 'PriceperCarats', numeric: false, disablePadding: false, label: 'Price per Carats(US$/ct.)', sortable: false },
  { id: 'TotalLotValue', numeric: false, disablePadding: false, label: 'Total Lot Value(US$)', sortable: false },
  { id: 'Options', numeric: false, disablePadding: true, label: 'Image/Video', sortable: false, fixedWith: '1%' },
];

export const CONTACT_ATTENDEES_HEAD_CELLS: HeadCell[] = [
  { id: 'sr', numeric: true, disablePadding: true, label: 'Sr.No', fixedWith: '1%', sortable: false },
  { id: 'co_name', numeric: false, disablePadding: false, label: 'Company Name', sortable: true },
  { id: 'contactPerson', numeric: false, disablePadding: false, label: 'Contact Person', sortable: true },
  { id: 'PhoneNO', numeric: false, disablePadding: false, label: 'Telephone Number', sortable: true },
  { id: 'emailID1', numeric: false, disablePadding: false, label: 'Email', sortable: true },
];

export const UPLOAD_PAPER_BIDS_ROUGH_HEAD_CELLS: HeadCell[] = [
  { id: 'stockNo', numeric: false, disablePadding: false, label: 'Lot No', sortable: true, fixedWith: '1%' },
  { id: 'Size', numeric: false, disablePadding: false, label: 'Size Range', sortable: true },
  { id: 'stockDesc', numeric: false, disablePadding: false, label: 'Lot Description', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight(Carats)', sortable: true },
  { id: 'ValuePerCarats', numeric: false, disablePadding: false, label: 'Value per Carats(US$)', sortable: false },
  { id: 'ValuePerLot', numeric: false, disablePadding: false, label: 'Value per Lot(US$)', sortable: false, minWidth: 130 },
  { id: 'Options', numeric: false, disablePadding: true, label: 'Image/Video', sortable: false, fixedWith: '1%' },
];

export const UPLOAD_PAPER_BIDS_POLISHED_HEAD_CELLS: HeadCell[] = [
  { id: 'stockNo', numeric: false, disablePadding: false, label: 'Lot Number', sortable: true, fixedWith: '1%' },
  { id: 'Shape', numeric: false, disablePadding: false, label: 'Shape', sortable: true },
  { id: 'Colour', numeric: false, disablePadding: false, label: 'Colour', sortable: true },
  { id: 'Clarity', numeric: false, disablePadding: false, label: 'Clarity', sortable: true },
  { id: 'pcs', numeric: true, disablePadding: false, label: 'Stone Count', sortable: true },
  { id: 'cts', numeric: true, disablePadding: false, label: 'Weight(Carats)', sortable: true },
  { id: 'PriceperCarats', numeric: false, disablePadding: false, label: 'Value per Carat(US$)', sortable: false },
  { id: 'TotalLotValue', numeric: false, disablePadding: false, label: 'Value per Lot(US$)', sortable: false, minWidth: 130 },
  { id: 'Options', numeric: false, disablePadding: true, label: 'Image/Video', sortable: false, fixedWith: '1%' },
];
