import { FormattedMessage } from 'react-intl';

// ASSETS
import { Layer } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - ALL LOTS ||============================== //

const allLots = (bidderId: string): NavItemType => ({
  id: 'item-all-lots',
  title: <FormattedMessage id="allLots" />,
  icon: Layer,
  type: 'item',
  url: `/bidder/${bidderId}/all-lots`,
});

export default allLots;
