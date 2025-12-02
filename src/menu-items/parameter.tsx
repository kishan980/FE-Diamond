// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { Home, DocumentText, Setting2, DollarSquare, Information, DocumentCode } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const parameter: NavItemType = {
  id: 'group-parameters',
  title: <FormattedMessage id="master-setup" />,
  icon: Setting2,
  type: 'group',
  children: [
    {
      id: 'homepage-display',
      title: <FormattedMessage id="homepage-setup" />,
      type: 'item',
      url: '/master-setup/home-page-setup',
      icon: Home,
    },
    {
      id: 'selling-company',
      title: <FormattedMessage id="selling-company" />,
      type: 'item',
      url: '/master-setup/selling-Company',
      icon: DollarSquare,
    },
    {
      id: 'terms-condtions',
      title: <FormattedMessage id="term-condtion" />,
      type: 'item',
      url: '/master-setup/term-and-condition',
      icon: DocumentText,
    },
    {
      id: 'purchaseLimit',
      title: <FormattedMessage id="purchaseLimit" />,
      type: 'item',
      url: '/master-setup/purchase-limit',
      icon: Information,
    },
    {
      id: 'legal-documents',
      title: <FormattedMessage id="legal-documents" />,
      type: 'item',
      url: '/master-setup/legal-document',
      icon: DocumentText,
    },
    {
      id: 'email-templates',
      title: <FormattedMessage id="email-templates" />,
      type: 'item',
      url: '/master-setup/email-templates',
      icon: DocumentCode,
    },
  ],
};

export default parameter;
