export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'StonesBid';
export const SITE_NAME_TITLE = ` | ${SITE_NAME}`;

interface MetaTitleMap {
  [key: string]: string;
}

export const routeTitleMap: MetaTitleMap = {
  '/events': 'Events',
  '/events/upsert-event': 'Add/Edit Events',
  '/events/select-viewers': 'Select Viewers',
  '/events/auction-room': 'Auction Room',
  '/events/upload-lots': 'Upload Lots',
  '/events/upload-lots/upload-additional-lots': 'Upload-additional-lots',
  '/events/select-participants': 'Select Participants',
  '/events/manage-attendees': 'Manage Attendees',
  '/events/event-outcomes': 'Event Outcomes',
  '/events/event-outcomes/analysing-outcome': 'Analysing Outcome',
  '/events/event-outcomes/analysing-outcome/lot-overview': 'Lot Overview',
  '/events/event-outcomes/manualBids': 'Manual Bids',
  '/events/contact-attendees': 'Contact Attendees',
  '/account/rough-bidders': 'Rough Bidders',
  '/account/rough-bidders/upsert-rough-bidders': 'Add/Edit Rough Bidder',
  '/account/polished-bidders': 'Polished Bidders',
  '/account/polished-bidders/upsert-polished-bidders': 'Add/Edit Polished Bidders',
  '/account/viewers': 'Viewers',
  '/account/viewers/upsert-viewers': 'Add/Edit Viewers',
  '/account/administrators': 'Administrators',
  '/account/administrators/upsert-administrators': 'Add/Edit Administrators',
  '/access': 'Access',
  '/master-setup/home-page-setup': 'Home Page Setup',
  '/master-setup/selling-Company': 'Selling Company',
  '/master-setup/selling-Company/upsert-selling-comapny': 'Add/Edit Selling Company',
  '/master-setup/term-and-condition': 'Terms & Conditions',
  '/master-setup/term-and-condition/upsert-term-and-condition': 'Add/Edit Terms & Conditions',
  '/master-setup/purchase-limit': 'Purchase Limit',
  '/master-setup/legal-document': 'Legal Document',
  '/master-setup/legal-document/upsert-legal-document': 'Add/Edit Legal Document',
  '/master-setup/email-templates': 'Email Templates',
  '/master-setup/email-templates/upsert-email-templates': 'Add/Edit Email Templates',
  '/history/past-events': 'Past Events',
  '/history/past-events/contact-bidders': 'Contact Bidders',
  '/history/past-events/tenderbids-details': 'Tender Bids Details',
  '/history/past-events/cancel-winning-bid': 'Cancel Winning Bid',
  '/history/roughbidders-performance': 'Rough Bidders Performance',
  '/history/roughbidders-performance/details': 'Rough Bidders Performance Details',
  '/history/polishedbidders-performance': 'Polished Bidders Performance',
  '/history/polishedbidders-performance/details': 'Polished Bidders Performance Details',
  '/history/customised-reports': 'Customised Reports',
  '/history/customised-reports/upsert-customised-reports': 'Add/Edit Customised Reports',
  '/bidder/[id]/all-lots': 'All Lots',
  '/bidder/[id]/auction-room': 'Auction Room',
  '/bidder/[id]/submitted-bids': 'Submitted Bids',
  '/bidder/[id]/event-outcomes': 'Event Outcomes',
  '/bidder/[id]/my-profile': 'My Profile',
};

const isUUID = (str: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(str);
};

const normalizePath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  return '/' + segments.map((seg) => (isNaN(Number(seg)) && !isUUID(seg) ? seg : '[id]')).join('/');
};

export const getPageTitle = (pathname: string): string => {
  const normalizedPath = normalizePath(pathname);

  const matchedRoutes = Object.keys(routeTitleMap).filter((route) => normalizedPath.startsWith(route));

  const [bestMatch] = matchedRoutes.sort((a, b) => b.length - a.length);

  return (bestMatch ? routeTitleMap[bestMatch] : 'Dashboard') + SITE_NAME_TITLE;
};
