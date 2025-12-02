// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { KeySquare } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - EVENTS ||============================== //

const access: NavItemType = {
  id: 'item-access',
  title: <FormattedMessage id="access" />,
  icon: KeySquare,
  type: 'item',
  url: '/access',
};

export default access;
