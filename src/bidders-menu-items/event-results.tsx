import { FormattedMessage } from 'react-intl';

// ASSETS
import { Chart21 } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - EVENT RESULTS ||============================== //

const eventResults = (bidderId: string): NavItemType => ({
  id: 'item-event-results',
  title: <FormattedMessage id="eventOutcomes" />,
  icon: Chart21,
  type: 'item',
  url: `/bidder/${bidderId}/event-outcomes`,
});

export default eventResults;
