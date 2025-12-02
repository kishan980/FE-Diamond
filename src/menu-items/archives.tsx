// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { DocumentText, ArchiveBook, CalendarTick, AlignBottom } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const archives: NavItemType = {
  id: 'group-archives',
  title: <FormattedMessage id="history" />,
  icon: ArchiveBook,
  type: 'group',
  children: [
    {
      id: 'past-events',
      title: <FormattedMessage id="past-events" />,
      type: 'item',
      url: '/history/past-events',
      icon: CalendarTick,
    },
    {
      id: 'roughbidders-performance',
      title: <FormattedMessage id="roughbidders-performance" />,
      type: 'item',
      url: '/history/roughbidders-performance',
      icon: AlignBottom,
    },
    {
      id: 'polishedbidders-performance',
      title: <FormattedMessage id="polishedbidders-performance" />,
      type: 'item',
      url: '/history/polishedbidders-performance',
      icon: AlignBottom,
    },
    {
      id: 'customised-reports',
      title: <FormattedMessage id="customised-reports" />,
      type: 'item',
      url: '/history/customised-reports',
      icon: DocumentText,
    },
  ],
};

export default archives;
