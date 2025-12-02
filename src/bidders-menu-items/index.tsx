import allLots from './all-lots';
import eventResults from './event-results';
import submittedBids from './submitted-bids';
import auctionRoom from './auction-room';
import purchaseLimit from './purchase-limit';
import { NavItemType } from 'types/menu';
import { GetViewParticipateData } from 'services/bidder/my-profile/type';

const getBiddersMenuItems = (
  bidderId: string,
  eventTenderData: GetViewParticipateData[],
  showAuctionRoom?: boolean
): { items: NavItemType[] } => {
  const items: NavItemType[] = [allLots(bidderId), submittedBids(bidderId)];

  if (showAuctionRoom) {
    items.splice(1, 0, auctionRoom(bidderId));
  }
  if (eventTenderData[0]?.PubliciseResultsToBidders) {
    items.push(eventResults(bidderId));
  }
  if (eventTenderData[0]?.showPurchaseLimit === 'Yes') items.push(purchaseLimit(bidderId));

  return { items };
};

export default getBiddersMenuItems;
