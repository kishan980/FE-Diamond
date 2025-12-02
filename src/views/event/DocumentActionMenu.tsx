'use client';
import Link from 'next/link';
import { createElement, Fragment, useCallback } from 'react';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import { StyledMenu } from 'components/UIComponent/ThemeCSS/StyledMenu/page';
import { StyledRightAlignedIconGroup } from 'views/common.styled';
import { EVENT_MENU_ITEMS } from 'constants/event.constants';
import { DocumentActionMenuPropsType } from 'types/documentAuctionMenu';

const DocumentActionMenu = ({
  open,
  moreMenuEventID,
  moreMenuStartDate,
  moreMenuEndDate,
  eventCategories,
  anchorElMoreMenu,
  detailPageMoreMenuItems,
  eventOutcomesUrl,
  moreMenuTenderEndDate,
  moreMenuAuctionEndDate,
  handleCloseMoreMenuButton,
  moreMenuEnableAuctionLink,
  moreMenuIsAuction,
}: DocumentActionMenuPropsType) => {
  const getMenuHref = useCallback(
    (path: string) => {
      if (!moreMenuEventID) return '/';
      if (path === 'events/select-viewers' && moreMenuEndDate) return `/${path}/${moreMenuEventID}?endDate=${moreMenuEndDate}`;
      if (path === 'events/event-outcomes' && eventOutcomesUrl) return `/${path}/analysing-outcome/${moreMenuEventID}`;
      if (path === 'events/event-outcomes' && !eventOutcomesUrl) return `/${path}/${moreMenuEventID}`;
      if (
        (path === 'events/select-participants' || path === 'events/manage-attendees') &&
        moreMenuStartDate &&
        moreMenuTenderEndDate &&
        eventCategories
      )
        return `/${path}/${moreMenuEventID}?startDate=${moreMenuStartDate}&endDate=${moreMenuTenderEndDate}&eventCategory=${eventCategories}`;

      if (path === 'events/upload-lots' && moreMenuStartDate && moreMenuEndDate && eventCategories) return `/${path}/${moreMenuEventID}`;

      if (path === 'events/contact-attendees') return `/${path}/${moreMenuEventID}?eventCategory=${eventCategories}`;

      if (path === 'events/auction-room') return `/${path}/${moreMenuEventID}`;

      return '/';
    },
    [moreMenuEventID, moreMenuEndDate, moreMenuTenderEndDate, eventOutcomesUrl, moreMenuStartDate, eventCategories]
  );

  const pathname = usePathname();

  const filterList = pathname === '/events' ? EVENT_MENU_ITEMS : detailPageMoreMenuItems;

  return (
    <StyledMenu
      id="long-menu"
      MenuListProps={{ 'aria-labelledby': 'long-button' }}
      anchorEl={anchorElMoreMenu}
      open={open}
      onClose={handleCloseMoreMenuButton}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      data-e2e="action-close-drop-down-menu"
    >
      {filterList?.map((option, index) => {
        const isAuctionRoom = option.path === 'events/auction-room';
        const isDisabled =
          isAuctionRoom &&
          (moreMenuEnableAuctionLink === 'false' || moreMenuTenderEndDate === moreMenuAuctionEndDate || moreMenuIsAuction === 'No');

        return (
          <Fragment key={index}>
            <Link
              href={isDisabled ? '#' : getMenuHref(option.path)}
              style={{ textDecoration: 'none', color: isDisabled ? 'grey' : 'inherit', pointerEvents: isDisabled ? 'none' : 'auto' }}
            >
              <MenuItem disabled={isDisabled}>
                <StyledRightAlignedIconGroup>
                  {createElement(option.icon)}
                  <Typography color={isDisabled ? 'text.disabled' : 'secondary.dark'}>{option.text}</Typography>
                </StyledRightAlignedIconGroup>
              </MenuItem>
            </Link>
            {filterList.length - 1 !== index && <Divider />}
          </Fragment>
        );
      })}
    </StyledMenu>
  );
};

export default DocumentActionMenu;
