import { Icon } from 'iconsax-react';

export interface DocumentActionMenuType {
  text: string;
  icon: Icon;
  path: string;
}

export interface DocumentActionMenuPropsType {
  anchorElMoreMenu: null | HTMLElement;
  open: boolean;
  handleCloseMoreMenuButton: () => void;
  moreMenuEventID?: number | null;
  moreMenuStartDate?: string | null;
  moreMenuEndDate?: string | null;
  eventCategories?: number | null;
  moreMenuTenderEndDate?: string | null;
  moreMenuAuctionEndDate?: string | null;
  detailPageMoreMenuItems?: DocumentActionMenuType[];
  eventOutcomesUrl: boolean | undefined;
  moreMenuEnableAuctionLink?: string | null;
  moreMenuIsAuction?: string | null;
}
