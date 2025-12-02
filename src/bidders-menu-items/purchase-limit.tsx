import { FormattedMessage } from 'react-intl';
import { Information } from 'iconsax-react';
import { NavItemType } from 'types/menu';

const purchaseLimit = (bidderId: string): NavItemType => ({
  id: 'item-purchase-limit',
  title: <FormattedMessage id="purchaseLimit" />,
  icon: Information,
  type: 'item',
  url: `/bidder/${bidderId}/purchase-limit`,
});

export default purchaseLimit;
