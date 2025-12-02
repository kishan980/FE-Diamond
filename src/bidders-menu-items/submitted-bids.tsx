import { FormattedMessage } from 'react-intl';

// ASSETS
import { Send2 } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - SUBMITTED BIDS ||============================== //

const submittedBids = (bidderId: string): NavItemType => ({
  id: 'item-submitted-bids',
  title: <FormattedMessage id="submittedBids" />,
  icon: Send2,
  type: 'item',
  url: `/bidder/${bidderId}/submitted-bids`,
});

export default submittedBids;
