import { Chart1, DocumentUpload, Judge, Personalcard, TickCircle, User } from 'iconsax-react';
import { ChildTableHeadersProps, MultipleOptions } from 'components/UIComponent/type';

export const EVENT_MENU_ITEMS = [
  { text: 'Upload Lots', icon: DocumentUpload, path: 'events/upload-lots' },
  { text: 'Select Participants', icon: TickCircle, path: 'events/select-participants' },
  { text: 'Manage Attendees', icon: User, path: 'events/manage-attendees' },
  { text: 'Auction Room', icon: Judge, path: 'events/auction-room' },
  { text: 'Event Outcomes', icon: Chart1, path: 'events/event-outcomes' },
  { text: 'Contact Attendees', icon: Personalcard, path: 'events/contact-attendees' },
];

export const AUCTION_INCREMENT_OPTIONS: MultipleOptions[] = [
  { id: 1, name: '1.00%' },
  { id: 0.5, name: '0.5%' },
  { id: 0.25, name: '0.25%' },
  { id: 0, name: 'No minimum increment' },
];

export const YES_NO_OPTIONS: MultipleOptions[] = [
  { id: true, name: 'Yes' },
  { id: false, name: 'No' },
];

export const MODULE_TYPE_OPTIONS: MultipleOptions[] = [
  { id: 'Yes', name: 'Activate' },
  { id: 'No', name: 'Deactivate' },
];

export const MODULE_TYPE_BOOLEAN_OPTIONS: MultipleOptions[] = [
  { id: true, name: 'Activate' },
  { id: false, name: 'Deactivate' },
];

export const INVITATION_TYPE_OPTIONS = [
  { id: 1, name: 'Invite' },
  { id: 0, name: 'UeInvite' },
];

export const LOGIN_STATUS_OPTIONS = [
  { id: 0, name: 'Active' },
  { id: 1, name: 'Deactive' },
];

export const PARTICIPATION_CONFIRMATION_OPTIONS = [
  { id: 1, name: 'Confirmed' },
  { id: 0, name: 'Not Yet' },
];

export const ATTENDANCE_STATUS_OPTIONS = [
  { id: 1, name: 'Attended' },
  { id: 2, name: 'Cancelled' },
  { id: 3, name: 'Not yet' },
];

export const LOGIN_ENABLE_DISABLE_OPTIONS = [
  { id: 0, name: 'Enable' },
  { id: 1, name: 'Disable' },
];

export const CHILD_TABLE_HEADERS: ChildTableHeadersProps[] = [
  { id: 'empty', label: '', align: 'left' },
  { id: 'companyName', label: 'Company Name', align: 'left' },
  { id: 'lotsWon', label: 'Number of Lots Won', align: 'right' },
  { id: 'totalAmount', label: 'Total Amount Won (US$)', align: 'right' },
  { id: 'purchaseLimit', label: 'Purchase Limit (US$)', align: 'right' },
  { id: 'oplExceeded', label: 'OPL Exceeded', align: 'right' },
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export const EVENT_TYPE = { ROUGH: 'Rough', POLISHED: 'Polished' };
