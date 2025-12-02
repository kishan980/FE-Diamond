import { FormattedMessage } from 'react-intl';

// ASSETS
import { Judge } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - AUCTION ROOM ||============================== //

const auctionRoom = (bidderId: string): NavItemType => ({
  id: 'item-auction-room',
  title: <FormattedMessage id="AuctionRoom" />,
  icon: Judge,
  type: 'item',
  url: `/bidder/${bidderId}/auction-room`,
});

export default auctionRoom;
