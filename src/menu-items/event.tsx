// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { Calendar } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - EVENTS ||============================== //

const event: NavItemType = {
  id: 'item-events',
  title: <FormattedMessage id="events" />,
  icon: Calendar,
  type: 'item',
  url: '/events',
};

export default event;
