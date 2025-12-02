import { FormattedMessage } from 'react-intl';
import { UserSquare, People, Airdrop } from 'iconsax-react';
import { NavItemType } from 'types/menu';

const account: NavItemType = {
  id: 'group-accounts',
  title: <FormattedMessage id="accounts" />,
  icon: UserSquare,
  type: 'group',
  children: [
    {
      id: 'roughbidders',
      title: <FormattedMessage id="roughbidders" />,
      type: 'item',
      url: '/account/rough-bidders',
      icon: People,
    },
    {
      id: 'polishedbidders',
      title: <FormattedMessage id="polishedbidders" />,
      type: 'item',
      url: '/account/polished-bidders',
      icon: People,
    },
    // {
    //   id: 'viewers',
    //   title: <FormattedMessage id="viewers" />,
    //   type: 'item',
    //   url: '/account/viewers',
    //   icon: Eye,
    // },
    {
      id: 'administrators',
      title: <FormattedMessage id="administrators" />,
      type: 'item',
      url: '/account/administrators',
      icon: Airdrop,
    },
  ],
};

export default account;
